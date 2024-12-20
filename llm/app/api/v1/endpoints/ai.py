from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from ..models import (
    ChatRequest, CategorizeRequest, ExpensedItemsWrapped,
    EmbeddingRequest, EmbeddingResponse, Roast, RoastRequest, RoastResponse,
    ItemCategories, ItemCategoriesWrapped,
    CategorizeResponse, CategorizeResponseRow)
from typing import List
from ..utils import process_uploaded_files, generate_text_embeddings, generate_file_hash, generate_string_hash
from ..cache import get_cached_results, cache_results, log_results
from dotenv import load_dotenv
import instructor
import json
from anthropic import AsyncAnthropicBedrock
from openai import AsyncOpenAI
import asyncio
from datetime import datetime, date
from loguru import logger

load_dotenv()

router = APIRouter()
model_id = "us.anthropic.claude-3-5-haiku-20241022-v1:0"
# model_id = "us.anthropic.claude-3-5-sonnet-20240620-v1:0"
# model_id = "us.anthropic.claude-3-5-sonnet-20241022-v2:0"


# @router.post("/chat")
# async def chat_stream(request: ChatRequest):
#     client = AsyncAnthropicBedrock()

#     async def generate():
#         try:
#             stream = await client.messages.create(
#                 messages=request.model_dump()['messages'],
#                 max_tokens=4096,
#                 model=model_id,
#                 stream=True,
#             )

#             async for event in stream:
#                 if hasattr(event, 'type') and event.type == 'content_block_delta':
#                     yield f"data: {event.delta.text}\n\n"
#             yield f"data: {json.dumps({'done': True})}\n\n"

#         except Exception as e:
#             raise HTTPException(
#                 status_code=500,
#                 detail=f"Internal server error: {str(e)}"
#             )

#     return StreamingResponse(
#         generate(),
#         media_type="text/event-stream"
#     )

@router.post("/categorize-wrapped", response_model=CategorizeResponse)
async def categorize_wrapped_endpoint(request: CategorizeRequest):
    cached_results = get_cached_results(query = generate_string_hash(request.model_dump_json()), database='wrapped_cache')
    if cached_results:
        logger.info("Using cached results")
        cached_data = json.loads(cached_results)
        cached_response = CategorizeResponse(**cached_data)
        return cached_response

    bedrock_client = instructor.from_anthropic(AsyncAnthropicBedrock())
    openai_client = instructor.from_openai(AsyncOpenAI())

    messages=[{"role": "system", "content": "Categorize the provided transactions and identify the individual items or transfers. For transactions from MercadoLibre, Shein, or AliExpress, assign them to their specific categories (e.g., 'mercadoLibre', 'shein', 'aliexpress') instead of using the general 'shopping' category."},
              {"role": "user", "content": request.model_dump_json()}]

    resp = None

    try:
        resp = await bedrock_client.messages.create(
            model=model_id,
            max_tokens=4096,
            messages=messages,
            response_model=ItemCategoriesWrapped,
        )
    except Exception as e:
        logger.error("Error using Bedrock client: " + str(e) + ". Trying OpenAI client...")
        resp = await openai_client.chat.completions.create(
            model='gpt-4o',
            messages=messages,
            response_model=ItemCategoriesWrapped,
        )

    response_rows = [ CategorizeResponseRow(
                        id=request.data[i].id,
                        category=category,
                        amount=request.data[i].amount,
                        description=request.data[i].description,
                        date=request.data[i].date,
                      ) for i, (category) in enumerate(resp.categories)]

    final_response = CategorizeResponse(expensed_items = response_rows)

    serialized_data = final_response.dict(by_alias=True, exclude_none=True)
    json_data_results = json.dumps(serialized_data, default=lambda x: x.isoformat() if isinstance(x, (datetime, date)) else x)
    cache_results(query = generate_string_hash(request.model_dump_json()), results = json_data_results, database='wrapped_cache')
    log_results(query = request.model_dump_json(), results = json_data_results)

    return final_response.model_dump()

@router.post("/categorize", response_model=CategorizeResponse)
async def categorize_endpoint(request: CategorizeRequest):
    cached_results = get_cached_results(query = generate_string_hash(request.model_dump_json()), database='categorize_cache')
    if cached_results:
        logger.info("Using cached results")
        cached_data = json.loads(cached_results)
        cached_response = CategorizeResponse(**cached_data)
        return cached_response

    bedrock_client = instructor.from_anthropic(AsyncAnthropicBedrock())
    openai_client = instructor.from_openai(AsyncOpenAI())

    resp = None

    messages = [{"role": "system", "content": "Categorize the provided transactions and identify the individual items or transfers."},
                    {"role": "user", "content": request.model_dump_json()}]
    try:
        resp = await bedrock_client.messages.create(
            model=model_id,
            max_tokens=4096,
            messages=messages,
            response_model=ItemCategories,
        )
    except Exception as e:
        logger.error("Error using Bedrock client: " + str(e) + ". Trying OpenAI client...")
        resp = await openai_client.chat.completions.create(
            model='gpt-4o',
            messages=messages,
            response_model=ItemCategories,
        )

    response_rows = [ CategorizeResponseRow(
                    id=request.data[i].id,
                    category=category,
                    amount=request.data[i].amount,
                    description=request.data[i].description,
                    date=request.data[i].date,
                    ) for i, (category) in enumerate(resp.categories)]

    final_response = CategorizeResponse(expensed_items = response_rows)

    serialized_data = resp.dict(by_alias=True, exclude_none=True)
    json_data_results = json.dumps(serialized_data, default=lambda x: x.isoformat() if isinstance(x, (datetime, date)) else x)
    cache_results(query = generate_string_hash(request.model_dump_json()), results = json_data_results, database='categorize_cache')
    log_results(query = request.model_dump_json(), results = json_data_results)

    return final_response.model_dump()

@router.post("/categorize-document", response_model=ExpensedItemsWrapped)
async def categorize_document_endpoint(files: List[UploadFile] = File(...)):
    results: ExpensedItemsWrapped = ExpensedItemsWrapped(expensed_items=[])
    processed_files = await process_uploaded_files(files)

    all_cached_results = []

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

            resp = None
            if file_data['type'] == 'text':
                messages = [{"role": "system", "content": "Categorize the provided transactions and identify the individual items or transfers. For transactions from MercadoLibre, Shein, or AliExpress, assign them to their specific categories (e.g., 'mercadoLibre', 'shein', 'aliexpress') instead of using the general 'shopping' category."},
                            {"role": "user", "content": file_data['content']}]
                try:
                    resp = await bedrock_client.messages.create(
                        model=model_id,
                        max_tokens=4096,
                        messages=messages,
                        response_model=ExpensedItemsWrapped,
                    )
                except Exception as e:
                    logger.error("Error using Bedrock client: " + str(e) + ". Trying OpenAI client...")
                    resp = await openai_client.chat.completions.create(
                        model='gpt-4o',
                        messages=messages,
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
                json_data_results = json.dumps(serialized_data, default=lambda x: x.isoformat() if isinstance(x, (datetime, date)) else x)
                cache_results(query=file_hash, results=json_data_results, database='document_cache')
                log_results(query=file_hash, results=json_data_results)

            return resp.expensed_items
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Error categorizando el documento: {e}")

    responses = await asyncio.gather(*[process_single_file(file_data) for file_data in processed_files])

    for response in responses:
        all_cached_results.extend(response)


    results.expensed_items = all_cached_results
    return results

@router.post("/roast", response_model=RoastResponse)
async def roast_endpoint(request: RoastRequest):
    unique_categories = set()
    for item in request.expensed_items:
        if (item.category):
            unique_categories.add(item.category)

    min_date = min(item.date for item in request.expensed_items)
    max_date = max(item.date for item in request.expensed_items)
    date_range = (max_date - min_date).days + 1

    bedrock_client = instructor.from_anthropic(AsyncAnthropicBedrock())
    openai_client = instructor.from_openai(AsyncOpenAI())

    async def process_category(category: str):
        filtered_data = [
            {
                "description": item.description,
                "amount": item.amount,
                "category": category,
                "date": item.date.isoformat()
            }
            for item in request.expensed_items
            if item.category == category
        ]

        category_expenses = {}
        for item in request.expensed_items:
            if item.category not in category_expenses:
                category_expenses[item.category] = 0
            category_expenses[item.category] += int(item.amount)

        message_content = (
            f"Here's the spending breakdown for {category} over {date_range} days:\n"
            f"{json.dumps(filtered_data)}\n\n"
            f"Total expenses by category:\n"
            f"{json.dumps(category_expenses)}\n"
            f"Sum of expenses: ${int(sum(category_expenses.values()))} pesos\n\n"
        )

        messages=[{"role": "system", "content": f"""Analyze these spending habits in the {category} category over a period of {date_range} days and respond in Spanish with a very single witty phrase of no more 30 words. If the total expenses in the category are disproportionately high, deliver a sharp, humorous and brutally honest roast like a stand-up comedian on fire, but keeping it fun and lighthearted. If the spending is reasonable or modest, provide a light observation or a constructive tip instead. The currency is in Chilean pesos. Avoid starting sentences with exclamations or using phrases like 'Madre Mía,' 'Compadre,' 'Caramba,' or similar interjections."""},
                    {"role": "user", "content":  message_content}]

        resp = None

        try:
            resp = await bedrock_client.messages.create(
                model=model_id,
                max_tokens=4096,
                messages=messages,
                response_model=Roast,
            )
        except Exception as e:
            logger.error("Error using Bedrock client: " + str(e) + ". Trying OpenAI client...")
            resp = await openai_client.chat.completions.create(
                model='gpt-4o',
                messages=messages,
                response_model=Roast,
            )


        return (category, resp.comment)

    responses = await asyncio.gather(*[process_category(category) for category in unique_categories])
    return {"roasts": {c: r for c, r in responses }}

# @router.post("/embedding", response_model=EmbeddingResponse)
# async def create_embedding(request: EmbeddingRequest):
#     embeddings = generate_text_embeddings(request.texts)
#     return embeddings
