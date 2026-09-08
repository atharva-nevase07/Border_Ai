from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database.session import get_db
from ..models.entities import Incident
from ..schemas.all_schemas import IncidentResponse, IncidentCreate

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentResponse])
def get_incidents(
    sector: str = None,
    severity: str = None,
    camera_id: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    q = db.query(Incident).options(
        joinedload(Incident.evidence_records),
        joinedload(Incident.alerts)
    )
    if sector:
        q = q.filter(Incident.sector == sector)
    if severity:
        q = q.filter(Incident.severity == severity.upper())
    if camera_id:
        q = q.filter(Incident.camera_id == camera_id)
    if status:
        q = q.filter(Incident.status == status.upper())
    return q.order_by(Incident.timestamp.desc()).all()

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    q = db.query(Incident).options(
        joinedload(Incident.evidence_records),
        joinedload(Incident.alerts)
    )
    if incident_id.isdigit():
        inc = q.filter(Incident.id == int(incident_id)).first()
    else:
        inc = q.filter(Incident.incident_code == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.patch("/{incident_id}/status")
def update_incident_status(incident_id: str, status: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(
        (Incident.id == int(incident_id) if incident_id.isdigit() else False) |
        (Incident.incident_code == incident_id)
    ).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    inc.status = status.upper()
    db.commit()
    db.refresh(inc)
    return {"message": f"Incident {inc.incident_code} status updated to {inc.status}"}
