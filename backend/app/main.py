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
        return DocumentListResponse(documents=documents)
    except Exception as e:
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

@app.get("/insights")
async def get_insights():
    try:
        await generate_insights()
        results = zilliz_client.search(
            collection_name="documents",
            data=[embed_model.get_text_embedding("latest insight")],
            limit=1,
            expr="metadata.type == 'insight'",
            output_fields=["metadata"]
        )
        if results and results[0]:
            return InsightResponse(insight=results[0]["metadata"]["content"])
        else:
            return JSONResponse(content={"message": "No insights available"}, status_code=404)
    except Exception as e:
        return JSONResponse(content={"message": f"Error: {str(e)}"}, status_code=500)

@app.get("/patterns")
async def get_patterns():
    try:
        await identify_patterns()
        results = zilliz_client.search(
            collection_name="documents",
            data=[embed_model.get_text_embedding("latest pattern")],
            limit=1,
            expr="metadata.type == 'pattern'",
            output_fields=["metadata"]
        )
        if results and results[0]:
            return PatternResponse(pattern=results[0]["metadata"]["content"])
        else:
            return JSONResponse(content={"message": "No patterns available"}, status_code=404)
    except Exception as e:
        return JSONResponse(content={"message": f"Error: {str(e)}"}, status_code=500)