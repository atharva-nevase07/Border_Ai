from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.session import get_db
from ..models.entities import Zone
from ..schemas.all_schemas import ZoneResponse, ZoneCreate

router = APIRouter(prefix="/api/zones", tags=["Zones"])

@router.get("", response_model=List[ZoneResponse])
def get_zones(camera_id: str = None, db: Session = Depends(get_db)):
    q = db.query(Zone)
    if camera_id:
        q = q.filter(Zone.camera_id == camera_id)
    return q.all()

@router.post("", response_model=ZoneResponse)
def create_or_update_zone(payload: ZoneCreate, db: Session = Depends(get_db)):
    zone = Zone(
        camera_id=payload.camera_id,
        name=payload.name,
        zone_type=payload.zone_type,
        polygon_coordinates=payload.polygon_coordinates,
        color=payload.color or "#EF4444"
    )
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone

@router.delete("/{zone_id}")
def delete_zone(zone_id: int, db: Session = Depends(get_db)):
    z = db.query(Zone).filter(Zone.id == zone_id).first()
    if not z:
        raise HTTPException(status_code=404, detail="Zone not found")
    db.delete(z)
    db.commit()
    return {"message": "Zone deleted successfully"}
