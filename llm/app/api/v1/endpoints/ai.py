from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from ..models import ChatRequest, CategorizeRequest, ExpensedItems, EmbeddingRequest, EmbeddingResponse
from typing import List
from ..utils import process_uploaded_files, generate_text_embeddings
from dotenv import load_dotenv
import instructor
import json
from anthropic import AsyncAnthropicBedrock
from openai import AsyncOpenAI
load_dotenv()

router = APIRouter()
model_id = "us.anthropic.claude-3-5-haiku-20241022-v1:0"
# model_id = "us.anthropic.claude-3-5-sonnet-20240620-v1:0"
# model_id = "us.anthropic.claude-3-5-sonnet-20241022-v2:0"


@router.post("/chat")
async def chat_stream(request: ChatRequest):
    client = AsyncAnthropicBedrock()

    async def generate():
        try:
            stream = await client.messages.create(
                messages=request.model_dump()['messages'],
                max_tokens=4096,
                model=model_id,
                stream=True,
            )

            async for event in stream:
                if hasattr(event, 'type') and event.type == 'content_block_delta':
                    yield f"data: {event.delta.text}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )

@router.post("/categorize", response_model=ExpensedItems)
async def categorize_endpoint(request: CategorizeRequest):
    client = instructor.from_anthropic(AsyncAnthropicBedrock())
    
    resp = await client.messages.create(
        model=model_id,
        max_tokens=1024,
        messages=[{"role": "system", "content": "Categorize the provided transactions and identify the individual items or transfers. For transactions from MercadoLibre, Shein, or AliExpress, assign them to their specific categories (e.g., 'mercadoLibre', 'shein', 'aliexpress') instead of using the general 'shopping' category."},
                  {"role": "user", "content": json.dumps(request.data)}],
        response_model=ExpensedItems,
    )
    
    return resp.model_dump()

@router.post("/categorize-document", response_model=ExpensedItems)
async def categorize_document_endpoint(files: List[UploadFile] = File(...)):
    results: ExpensedItems = ExpensedItems(expensed_items=[])
    processed_files = await process_uploaded_files(files)
    

    bedrock_client = instructor.from_anthropic(AsyncAnthropicBedrock())
    openai_client = instructor.from_openai(AsyncOpenAI())
    
    for file_data in processed_files:
        try:
            if file_data['type'] == 'text':
                # Usar la función categorize para documentos de texto
                resp = await bedrock_client.messages.create(
                    model=model_id,
                    max_tokens=4096,
                    messages=[{"role": "user", "content": file_data['content']}],
                    response_model=ExpensedItems,
                )
            else:
                messages = [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {"url":  f"data:image/jpeg;base64,{file_data['content']}"},
                            },
                            {
                                "type": "text",
                                "text": "Analyze the provided transactions and identify each of the expensed items or transfers."
                            }
                        ],
                    }
                ]
                resp = await openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    response_model=ExpensedItems,
                )
            
            results.expensed_items.extend(resp.expensed_items)
            
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Error categorizando el documento: {e}")
    
    return results


@router.post("/embedding", response_model=EmbeddingResponse)
async def create_embedding(request: EmbeddingRequest):
    embeddings = generate_text_embeddings(request.texts)
    return embeddings