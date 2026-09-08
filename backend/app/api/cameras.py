from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.session import get_db
from ..models.entities import Camera
from ..schemas.all_schemas import CameraResponse, CameraCreate

router = APIRouter(prefix="/api/cameras", tags=["Cameras"])

@router.get("", response_model=List[CameraResponse])
def get_cameras(sector: str = None, status: str = None, db: Session = Depends(get_db)):
    query = db.query(Camera)
    if sector:
        query = query.filter(Camera.sector == sector)
    if status:
        query = query.filter(Camera.status == status)
    return query.order_by(Camera.camera_id).all()

@router.get("/{camera_id}", response_model=CameraResponse)
def get_camera(camera_id: str, db: Session = Depends(get_db)):
    cam = db.query(Camera).filter((Camera.camera_id == camera_id) | (Camera.id == int(camera_id) if camera_id.isdigit() else False)).first()
    if not cam:
        raise HTTPException(status_code=404, detail=f"Camera {camera_id} not found")
    return cam

@router.post("", response_model=CameraResponse)
def create_camera(payload: CameraCreate, db: Session = Depends(get_db)):
    existing = db.query(Camera).filter(Camera.camera_id == payload.camera_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Camera ID already exists")
    cam = Camera(**payload.model_dump())
    db.add(cam)
    db.commit()
    db.refresh(cam)
    return cam
