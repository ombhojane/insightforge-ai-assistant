from pydantic import BaseModel
from typing import List, Dict, Any

class SearchResponse(BaseModel):
    results: List[Dict[str, Any]]

class InsightResponse(BaseModel):
    insight: str

class PatternResponse(BaseModel):
    pattern: str

class DocumentListResponse(BaseModel):
    documents: List[Dict[str, Any]]