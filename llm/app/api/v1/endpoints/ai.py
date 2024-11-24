from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from ..models import ChatRequest, CategorizeRequest, ExpensedItems, ExpensedItemsWrapped, EmbeddingRequest, EmbeddingResponse, Roast, RoastRequest
from typing import List
from ..utils import process_uploaded_files, generate_text_embeddings, serialize_dates
from ..cache import get_cached_results, cache_results, log_results
from dotenv import load_dotenv
import instructor
import json
from anthropic import AsyncAnthropicBedrock
from openai import AsyncOpenAI
import asyncio
from datetime import datetime
import hashlib
from loguru import logger

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

@router.post("/categorize-wrapped", response_model=ExpensedItemsWrapped)
async def categorize_wrapped_endpoint(request: CategorizeRequest):
    cached_results = get_cached_results(query = json.dumps(request.data), database='wrapped_cache')
    if cached_results:
        logger.info("Using cached results")
        cached_data = json.loads(cached_results)
        cached_response = ExpensedItemsWrapped(**cached_data)
        return cached_response
    
    client = instructor.from_anthropic(AsyncAnthropicBedrock())
    
    resp = await client.messages.create(
        model=model_id,
        max_tokens=1024,
        messages=[{"role": "system", "content": "Categorize the provided transactions and identify the individual items or transfers. For transactions from MercadoLibre, Shein, or AliExpress, assign them to their specific categories (e.g., 'mercadoLibre', 'shein', 'aliexpress') instead of using the general 'shopping' category."},
                  {"role": "user", "content": json.dumps(request.data)}],
        response_model=ExpensedItemsWrapped,
    )
    
    serialized_data = resp.dict(by_alias=True, exclude_none=True)
    json_data_results = json.dumps(serialized_data, default=lambda x: x.isoformat() if isinstance(x, datetime) else x)
    cache_results(query = json.dumps(request.data), results = json_data_results, database='wrapped_cache')
    log_results(query = json.dumps(request.data), results = json_data_results)

    return resp.model_dump()

@router.post("/categorize", response_model=ExpensedItems)
async def categorize_endpoint(request: CategorizeRequest):
    cached_results = get_cached_results(query = json.dumps(request.data), database='categorize_cache')
    if cached_results:
        logger.info("Using cached results")
        cached_data = json.loads(cached_results)
        cached_response = ExpensedItems(**cached_data)
        return cached_response
    
    client = instructor.from_anthropic(AsyncAnthropicBedrock())
    
    resp = await client.messages.create(
        model=model_id,
        max_tokens=4096,
        messages=[{"role": "system", "content": "Categorize the provided transactions and identify the individual items or transfers."},
                  {"role": "user", "content": json.dumps(request.data)}],
        response_model=ExpensedItems,
    )
    
    serialized_data = resp.dict(by_alias=True, exclude_none=True)
    json_data_results = json.dumps(serialized_data, default=lambda x: x.isoformat() if isinstance(x, datetime) else x)
    cache_results(query = json.dumps(request.data), results = json_data_results, database='categorize_cache')
    log_results(query = json.dumps(request.data), results = json_data_results)

    return resp.model_dump()

@router.post("/categorize-document", response_model=ExpensedItemsWrapped)
async def categorize_document_endpoint(files: List[UploadFile] = File(...)):
    results: ExpensedItemsWrapped = ExpensedItemsWrapped(expensed_items=[])
    processed_files = await process_uploaded_files(files)
    
    all_cached_results = []
    def generate_file_hash(file_content):
        return hashlib.sha256(file_content.encode()).hexdigest()
    
    bedrock_client = instructor.from_anthropic(AsyncAnthropicBedrock())
    openai_client = instructor.from_openai(AsyncOpenAI())

    async def process_single_file(file_data):
        try:
            file_hash = generate_file_hash(file_data['content'])

            cached_results = get_cached_results(query=file_hash, database='document_cache')
            if cached_results:
                logger.info(f"Using cached results for file with hash: {file_hash}")
                cached_data = json.loads(cached_results)
                return ExpensedItemsWrapped(**cached_data).expensed_items
            
            if file_data['type'] == 'text':
                # Usar la función categorize para documentos de texto
                resp = await bedrock_client.messages.create(
                    model=model_id,
                    max_tokens=4096,
                    messages=[{"role": "system", "content": "Categorize the provided transactions and identify the individual items or transfers. For transactions from MercadoLibre, Shein, or AliExpress, assign them to their specific categories (e.g., 'mercadoLibre', 'shein', 'aliexpress') instead of using the general 'shopping' category."},
                              {"role": "user", "content": file_data['content']}],
                    response_model=ExpensedItemsWrapped,
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
                                "text": "Categorize the provided transactions and identify the individual items or transfers. For transactions from MercadoLibre, Shein, or AliExpress, assign them to their specific categories (e.g., 'mercadoLibre', 'shein', 'aliexpress') instead of using the general 'shopping' category."
                            }
                        ],
                    }
                ]
                resp = await openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    response_model=ExpensedItemsWrapped,
                )

                # Guardar en caché los resultados
                serialized_data = resp.dict(by_alias=True, exclude_none=True)
                json_data_results = json.dumps(serialized_data, default=lambda x: x.isoformat() if isinstance(x, datetime) else x)
                cache_results(query=file_hash, results=json_data_results, database='document_cache')
                log_results(query=file_hash, results=json_data_results)

            return resp.expensed_items
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Error categorizando el documento: {e}")

    responses = await asyncio.gather(*[process_single_file(file_data) for file_data in processed_files])
    
    # Combinar todos los resultados
    for response in responses:
        all_cached_results.extend(response)

    results.expensed_items = all_cached_results
    return results

@router.post("/roast", response_model=Roast)
async def roast_endpoint(request: RoastRequest):
    client = instructor.from_anthropic(AsyncAnthropicBedrock())

    filtered_data = [
        {
            "title": item.title,
            "amount": item.amount,
            "category": item.category,
            "date": item.date.isoformat()
        }
        for item in request.expensed_items 
        if item.category == request.category
    ]

    min_date = min(item.date for item in request.expensed_items)
    max_date = max(item.date for item in request.expensed_items)
    date_range = (max_date - min_date).days + 1

    category_expenses = {}
    for item in request.expensed_items:
        if item.category not in category_expenses:
            category_expenses[item.category] = 0
        category_expenses[item.category] += item.amount

    message_content = (
        f"Here's the spending breakdown for {request.category} over {date_range} days:\n"
        f"{json.dumps(filtered_data)}\n\n"
        f"Total expenses by category:\n"
        f"{json.dumps(category_expenses)}"
    )

    resp = await client.messages.create(
        model=model_id,
        max_tokens=2048,
        messages=[{"role": "system", "content": f"Roast these spending habits related to {request.category} over a period of {date_range} days like you're a stand-up comedian on fire in just one very simple phrase. Be brutally honest, sharp, and hilarious, but keep it fun and lighthearted. Respond in spanish. Currency is in chilean pesos. Consider the total expenses by category."},
                  {"role": "user", "content":  message_content}],
        response_model=Roast,
    )
    
    return resp.model_dump()

@router.post("/embedding", response_model=EmbeddingResponse)
async def create_embedding(request: EmbeddingRequest):
    embeddings = generate_text_embeddings(request.texts)
    return embeddings