from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import asyncio
from app.utils import process_document, search_documents, setup_zilliz
from app.models import SearchResponse

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
    
@app.post("/search")
async def search(query: str = Form(...)):
    try:
        results = await search_documents(query, limit=3)
        return SearchResponse(results=results)
    except Exception as e:
        print(f"Search error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(content={"message": f"Error: {str(e)}"}, status_code=500)