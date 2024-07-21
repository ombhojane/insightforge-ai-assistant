from pydantic import BaseModel
from typing import List, Dict, Any

class SearchResponse(BaseModel):
    results: List[Dict[str, Any]]