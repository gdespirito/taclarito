from fastapi import UploadFile
from typing import List
import base64
from pathlib import Path
import fitz
import docx
import pandas as pd
import os
import shutil
import tempfile
import boto3
import json
from datetime import datetime
import hashlib
from dotenv import load_dotenv

load_dotenv()

def is_page_readable(page):
    text = page.get_text()
    min_characters = 300 
    text_ratio = len(text.strip()) / max(1, len(text)) 
    
    return len(text.strip()) >= min_characters and text_ratio > 0.8

async def process_uploaded_files(files: List[UploadFile]):
    results = []
    
    for upload_file in files:
        # Crear un archivo temporal para guardar el contenido
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            # Copiar el contenido del archivo subido al temporal
            shutil.copyfileobj(upload_file.file, temp_file)
            temp_path = temp_file.name

        try:
            file_extension = Path(upload_file.filename).suffix.lower()
            
            # Procesar PDFs
            if file_extension == '.pdf':
                pdf_document = fitz.open(temp_path)
                for page_num in range(pdf_document.page_count):
                    page = pdf_document[page_num]
                    
                    if is_page_readable(page):
                        text = page.get_text()
                        results.append({
                            'file_name': upload_file.filename,
                            'page_number': page_num + 1,
                            'content': text,
                            'type': 'text',
                            'format': 'pdf_text'
                        })
                    else:
                        pix = page.get_pixmap()
                        img_bytes = pix.tobytes()
                        img_base64 = base64.b64encode(img_bytes).decode()
                        results.append({
                            'file_name': upload_file.filename,
                            'page_number': page_num + 1,
                            'content': img_base64,
                            'type': 'image',
                            'format': 'pdf_page'
                        })
                pdf_document.close()


            # Procesar imágenes
            elif file_extension in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
                with open(temp_path, 'rb') as img_file:
                    img_bytes = img_file.read()
                    img_base64 = base64.b64encode(img_bytes).decode()
                    results.append({
                        'file_name': upload_file.filename,
                        'page_number': 1,
                        'content': img_base64,
                        'type': 'image',
                        'format': file_extension[1:]
                    })

            # Procesar documentos Word
            elif file_extension in ['.doc', '.docx']:
                doc = docx.Document(temp_path)
                text_content = []
                for para in doc.paragraphs:
                    if para.text.strip():
                        text_content.append(para.text)
                results.append({
                    'file_name': upload_file.filename,
                    'page_number': 1,
                    'content': '\n'.join(text_content),
                    'type': 'text',
                    'format': file_extension[1:]
                })

            # Procesar archivos Excel
            elif file_extension in ['.xls', '.xlsx']:
                excel_file = pd.ExcelFile(temp_path)
                for sheet_name in excel_file.sheet_names:
                    df = pd.read_excel(temp_path, sheet_name=sheet_name)
                    results.append({
                        'file_name': upload_file.filename,
                        'sheet_name': sheet_name,
                        'content': df.to_json(),
                        'type': 'text',
                        'format': file_extension[1:]
                    })

            # Otros tipos de archivo
            else:
                with open(temp_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    results.append({
                        'file_name': upload_file.filename,
                        'page_number': 1,
                        'content': content,
                        'type': 'text',
                        'format': file_extension[1:] if file_extension else 'unknown'
                    })

        except Exception as e:
            results.append({
                'file_name': upload_file.filename,
                'error': str(e),
                'type': 'error',
                'format': file_extension[1:] if file_extension else 'unknown'
            })
        
        finally:
            # Limpiar el archivo temporal
            os.unlink(temp_path)
            # Cerrar el archivo subido
            upload_file.file.close()

    return results


def generate_text_embeddings(texts: List[str], input_type: str = "search_document"):
    """
    Generate text embedding by using the Cohere Embed model.
    Args:
        body (str) : The reqest body to use.
    Returns:
        dict: The response from the model.
    """

    accept = '*/*'
    content_type = 'application/json'

    bedrock = boto3.client(service_name='bedrock-runtime')

    body = json.dumps({
    "texts": texts,
    "input_type": input_type})

    response = bedrock.invoke_model(
        body=body,
        modelId="cohere.embed-multilingual-v3",
        accept=accept,
        contentType=content_type
    )

    response_body = json.loads(response.get('body').read())

    return { "embeddings": response_body.get('embeddings') }


def serialize_dates(obj):
    if isinstance(obj, dict):
        return {k: serialize_dates(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_dates(item) for item in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()  # Convert datetime to ISO 8601 string
    return obj

def generate_string_hash(string_content):
    """Generate a SHA-256 hash for a normal string."""
    return hashlib.sha256(string_content.encode()).hexdigest()

def generate_file_hash(file_content):
        return hashlib.sha256(file_content.encode()).hexdigest()