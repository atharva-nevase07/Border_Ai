from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.session import get_db
from ..models.entities import Evidence, Incident
from ..schemas.all_schemas import EvidenceResponse

router = APIRouter(prefix="/api/evidence", tags=["Evidence"])

@router.get("", response_model=List[EvidenceResponse])
def get_all_evidence(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Evidence).order_by(Evidence.timestamp.desc()).limit(limit).all()

@router.get("/{evidence_id}", response_model=EvidenceResponse)
def get_evidence(evidence_id: int, db: Session = Depends(get_db)):
    ev = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence record not found")
    return ev
