import os
import asyncio
import PyPDF2
import pytesseract
from PIL import Image
import chardet
from llama_index.core import Document
from llama_index.llms.together import TogetherLLM
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor
from llama_index.core.schema import TransformComponent
from pydantic import Field
from pymilvus import MilvusClient
from typing import Any, List
import json
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Set up environment variables and clients
os.environ["TOGETHER_API_KEY"] = "25980fc3165cda837e9a45f2f5fca4230f89d883ccfce94834c38d958425bc68"
ZILLIZ_CLOUD_URI = "https://in03-b6d5f0fd0f08756.api.gcp-us-west1.zillizcloud.com"
ZILLIZ_CLOUD_TOKEN = "ee580eaa516ad2f5181ff4c46c6ac34739502913618c58f331f612e218bd224b436de4214a5f499c21e78f1b8de938d77c4ea710"

llm = TogetherLLM(model="mistralai/Mixtral-8x7B-Instruct-v0.1")
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
zilliz_client = MilvusClient(uri=ZILLIZ_CLOUD_URI, token=ZILLIZ_CLOUD_TOKEN)

def classify_document(text):
    prompt = f"Classify the following document as either 'invoice', 'contract', or 'report':\n\n{text[:500]}..."
    response = llm.complete(prompt)
    return response.text.strip().lower()

def perform_ocr(file_path):
    image = Image.open(file_path)
    text = pytesseract.image_to_string(image)
    return text

class KeyInfoExtractor(TransformComponent):
    llm: Any = Field(description="The language model to use for extraction")

    def __init__(self, llm):
        super().__init__(llm=llm)

    def __call__(self, nodes, **kwargs):
        for node in nodes:
            prompt = f"Extract key information from this text:\n\n{node.text}"
            response = self.llm.complete(prompt)
            node.metadata["key_info"] = response.text.strip()
        return nodes

class TextCleaner(TransformComponent):
    def __call__(self, nodes, **kwargs):
        for node in nodes:
            node.text = ' '.join(node.text.split())
        return nodes

class VersionTracker(TransformComponent):
    def __call__(self, nodes, **kwargs):
        for node in nodes:
            node.metadata["version"] = 1
            node.metadata["last_updated"] = datetime.now().isoformat()
        return nodes

pipeline = IngestionPipeline(
    transformations=[
        TextCleaner(),
        SentenceSplitter(chunk_size=1024, chunk_overlap=20),
        TitleExtractor(llm=llm),
        KeyInfoExtractor(llm=llm),
        VersionTracker(),
        embed_model,
    ]
)

async def process_document(file_path):
    try:
        # Clear existing collection
        try:
            zilliz_client.drop_collection("documents")
        except Exception as e:
            print(f"Error dropping collection: {e}")
        
        # Recreate the collection
        embed_dim = get_embedding_dim(embed_model)
        zilliz_client.create_collection(
            collection_name="documents",
            dimension=embed_dim
        )

        if file_path.lower().endswith('.pdf'):
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
        elif file_path.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
            text = perform_ocr(file_path)
        else:
            with open(file_path, 'rb') as file:
                raw_data = file.read()
            detected = chardet.detect(raw_data)
            encoding = detected['encoding']
            with open(file_path, 'r', encoding=encoding) as file:
                text = file.read()

        doc = Document(text=text, metadata={"source": file_path})
        doc_type = classify_document(text)
        doc.metadata["type"] = doc_type

        nodes = await pipeline.arun(documents=[doc])

        data = [{
            "id": i,
            "vector": node.embedding,
            "metadata": node.metadata
        } for i, node in enumerate(nodes)]

        zilliz_client.insert(collection_name="documents", data=data)

        return nodes

    except Exception as e:
        print(f"Error processing document: {e}")
        return None

async def update_document(file_path):
    try:
        # Process the new version of the document
        new_nodes = await process_document(file_path)
        
        if not new_nodes:
            return None

        # Find existing documents with the same source
        existing_docs = zilliz_client.query(
            collection_name="documents",
            expr=f"metadata.source == '{file_path}'",
            output_fields=["id", "metadata"]
        )

        for new_node in new_nodes:
            matching_doc = next((doc for doc in existing_docs if doc["metadata"]["source"] == file_path), None)
            
            if matching_doc:
                # Update existing document
                new_version = matching_doc["metadata"].get("version", 0) + 1
                new_node.metadata["version"] = new_version
                new_node.metadata["last_updated"] = datetime.now().isoformat()
                
                zilliz_client.delete(
                    collection_name="documents",
                    expr=f"id == '{matching_doc['id']}'"
                )
            else:
                # Insert as a new document
                new_node.metadata["version"] = 1
                new_node.metadata["last_updated"] = datetime.now().isoformat()

            zilliz_client.insert(
                collection_name="documents",
                data=[{
                    "vector": new_node.embedding,
                    "metadata": new_node.metadata
                }]
            )

        return new_nodes

    except Exception as e:
        print(f"Error updating document: {e}")
        return None

async def search_documents(query_text, filters=None, limit=5):
    query_vector = embed_model.get_text_embedding(query_text)
    
    search_params = {
        "collection_name": "documents",
        "data": [query_vector],
        "limit": limit,
        "output_fields": ["metadata"]
    }
    
    if filters:
        search_params["expr"] = filters

    results = zilliz_client.search(**search_params)
    
    # Print the raw results for debugging
    print("Raw search results:")
    print(json.dumps(results, indent=2, default=str))
    
    # Process the results
    processed_results = []
    for hit in results[0]:
        processed_hit = {
            "id": hit.get("id", "N/A"),
            "distance": hit.get("distance", "N/A"),
            "metadata": hit.get("entity", {}).get("metadata", {})
        }
        processed_results.append(processed_hit)
    
    return processed_results

async def generate_insights():
    # Fetch all documents
    results = zilliz_client.query(
        collection_name="documents",
        output_fields=["metadata"],
        limit=1000  # Adjust as needed
    )

    documents = [result["metadata"] for result in results]
    
    prompt = f"Analyze the following documents and provide insights:\n\n{json.dumps(documents, indent=2)}"
    insights = llm.complete(prompt).text.strip()
    
    # Store insights in a new collection or as a special document
    insight_data = {
        "metadata": {
            "type": "insight",
            "content": insights,
            "timestamp": datetime.now().isoformat()
        }
    }
    zilliz_client.insert(collection_name="documents", data=[insight_data])


async def identify_patterns():
    # Fetch all documents
    results = zilliz_client.query(
        collection_name="documents",
        output_fields=["metadata"],
        limit=1000  # Adjust as needed
    )

    documents = [result["metadata"] for result in results]
    
    prompt = f"Identify patterns across these documents:\n\n{json.dumps(documents, indent=2)}"
    patterns = llm.complete(prompt).text.strip()
    
    # Store patterns in a new collection or as a special document
    pattern_data = {
        "metadata": {
            "type": "pattern",
            "content": patterns,
            "timestamp": datetime.now().isoformat()
        }
    }
    zilliz_client.insert(collection_name="documents", data=[pattern_data])


async def get_all_documents():
    results = zilliz_client.query(
        collection_name="documents",
        output_fields=["metadata"],
        expr="metadata.type != 'insight' && metadata.type != 'pattern'",
        limit=1000  # Adjust as needed
    )
    return [result["metadata"] for result in results]


# ... (keep existing imports and setup)

async def get_latest_insight():
    results = zilliz_client.query(
        collection_name="documents",
        output_fields=["metadata"],
        expr="metadata['type'] == 'insight'",
        limit=1,
        sort="metadata['timestamp'] desc"
    )
    if results:
        return results[0]['metadata']['content']
    return None

async def get_latest_pattern():
    results = zilliz_client.query(
        collection_name="documents",
        output_fields=["metadata"],
        expr="metadata['type'] == 'pattern'",
        limit=1,
        sort="metadata['timestamp'] desc"
    )
    if results:
        return results[0]['metadata']['content']
    return None


def get_embedding_dim(embed_model):
    test_embedding = embed_model.get_text_embedding("test")
    return len(test_embedding)

async def setup_zilliz():
    embed_dim = get_embedding_dim(embed_model)
    try:
        zilliz_client.drop_collection("documents")
    except Exception as e:
        print(f"Error dropping collection: {e}")
    
    try:
        zilliz_client.create_collection(
            collection_name="documents",
            dimension=embed_dim
        )
    except Exception as e:
        print(f"Error creating collection: {e}")

# Initialize scheduler
scheduler = AsyncIOScheduler()

# Schedule tasks
scheduler.add_job(generate_insights, 'interval', hours=24)
scheduler.add_job(identify_patterns, 'interval', hours=48)

# Start the scheduler
scheduler.start()

__all__ = [
    "process_document",
    "search_documents",
    "setup_zilliz",
    "update_document",
    "generate_insights",
    "identify_patterns",
    "zilliz_client",
    "embed_model"
]