from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..schemas.all_schemas import AssistantQueryRequest, AssistantQueryResponse, IncidentResponse
from ..services.assistant_service import assistant_engine

router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])

@router.post("/query", response_model=AssistantQueryResponse)
def query_assistant(payload: AssistantQueryRequest, db: Session = Depends(get_db)):
    result = assistant_engine.query(db, payload.query)
    
    # Format incidents into Pydantic models
    formatted_incidents = []
    for inc in result["matched_incidents"]:
        formatted_incidents.append(IncidentResponse.model_validate(inc))

    return AssistantQueryResponse(
        answer=result["answer"],
        matched_incidents=formatted_incidents,
        suggestions=result["suggestions"],
        query_intent=result["query_intent"]
    )
