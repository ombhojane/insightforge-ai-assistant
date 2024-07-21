from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import asyncio
from app.utils import (
    process_document, 
    search_documents, 
    setup_zilliz, 
    update_document, 
    generate_insights, 
    identify_patterns,
    zilliz_client,
    embed_model,
    get_all_documents
)
from app.models import SearchResponse, InsightResponse, PatternResponse, DocumentListResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def startup_event():
    await setup_zilliz()

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(contents)
        
        processed_nodes = await process_document(file_path)
        os.remove(file_path)
        
        if processed_nodes:
            return JSONResponse(content={
                "message": "File processed successfully",
                "node_count": len(processed_nodes),
                "filename": file.filename
            })
        else:
            return JSONResponse(content={"message": "File processing failed"}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"message": f"Error: {str(e)}"}, status_code=500)

@app.get("/documents")
async def list_documents():
    try:
        documents = await get_all_documents()
        print(f"Documents retrieved: {documents}")
        return DocumentListResponse(documents=documents)
    except Exception as e:
        print(f"Error in list_documents: {e}")
        return JSONResponse(content={"message": f"Error: {str(e)}"}, status_code=500)
    

@app.post("/update/{document_id}")
async def update_file(document_id: str, file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(contents)
        
        updated_nodes = await update_document(document_id, file_path)
        os.remove(file_path)
        
        if updated_nodes:
            return JSONResponse(content={
                "message": "File updated successfully",
                "node_count": len(updated_nodes),
                "filename": file.filename
            })
        else:
            return JSONResponse(content={"message": "File update failed"}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"message": f"Error: {str(e)}"}, status_code=500)

@app.post("/search")
async def search(query: str = Form(...), filters: str = Form(None)):
    try:
        results = await search_documents(query, filters=filters, limit=3)
        return SearchResponse(results=results)
    except Exception as e:
        print(f"Search error: {str(e)}")
        return JSONResponse(content={"message": f"Error: {str(e)}"}, status_code=500)

async def get_latest_insight():
    try:
        results = zilliz_client.query(
            collection_name="documents",
            output_fields=["metadata"],
            expr="metadata['type'] == 'insight'",
            limit=1,
            sort_fields=["metadata['timestamp']"],
            sort_orders=["DESC"]
        )
        print(f"Latest insight query results: {results}")
        if results:
            return results[0]['metadata']['content']
        return None
    except Exception as e:
        print(f"Error fetching latest insight: {e}")
        return None

async def get_latest_pattern():
    try:
        results = zilliz_client.query(
            collection_name="documents",
            output_fields=["metadata"],
            expr="metadata['type'] == 'pattern'",
            limit=1,
            sort_fields=["metadata['timestamp']"],
            sort_orders=["DESC"]
        )
        print(f"Latest pattern query results: {results}")
        if results:
            return results[0]['metadata']['content']
        return None
    except Exception as e:
        print(f"Error fetching latest pattern: {e}")
        return None
    
@app.get("/insights")
async def get_insights():
    try:
        insights = await generate_insights()
        if insights:
            return InsightResponse(insight=insights)
        else:
            return JSONResponse(content={"message": "No insights available yet. Please try again later."}, status_code=404)
    except Exception as e:
        print(f"Error in get_insights: {e}")
        return JSONResponse(content={"message": f"Error generating insights: {str(e)}"}, status_code=500)
    
@app.get("/patterns")
async def get_patterns():
    try:
        await identify_patterns()
        pattern = await get_latest_pattern()
        print(f"Latest pattern: {pattern}")
        if pattern:
            return PatternResponse(pattern=pattern)
        else:
            return JSONResponse(content={"message": "No patterns available yet. Please try again later."}, status_code=404)
    except Exception as e:
        print(f"Error in get_patterns: {e}")
        return JSONResponse(content={"message": f"Error identifying patterns: {str(e)}"}, status_code=500)