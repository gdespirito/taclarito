from app.api.v1.utils import generate_text_embeddings

texts=["hola", "test"]
response = generate_text_embeddings(texts=texts)
print(response)