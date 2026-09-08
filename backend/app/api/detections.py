from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
from ..database.session import get_db
from ..models.entities import Detection
from ..schemas.all_schemas import DetectionResponse, DetectionCreate

router = APIRouter(prefix="/api/detections", tags=["Detections"])

@router.get("", response_model=List[DetectionResponse])
def get_detections(camera_id: str = None, limit: int = 50, db: Session = Depends(get_db)):
    q = db.query(Detection)
    if camera_id:
        q = q.filter(Detection.camera_id == camera_id)
    return q.order_by(Detection.timestamp.desc()).limit(limit).all()

@router.get("/live")
def get_live_detections(camera_id: str = "C-07"):
    """
    Returns real-time simulated AI detection coordinates and tracks for camera overlay.
    """
    return {
        "camera_id": camera_id,
        "fps": 25.0,
        "objects_count": 2 if camera_id == "C-07" else 1,
        "detections": [
            {
                "object_type": "PERSON",
                "confidence": 0.964,
                "track_id": "#102",
                "bounding_box": {"x": 38.5, "y": 42.0, "width": 8.5, "height": 22.0},
                "movement_direction": "NORTH-EAST",
                "speed_kmh": 4.8,
                "duration_sec": 18,
                "zone": "RESTRICTED ZONE"
            },
            {
                "object_type": "PERSON",
                "confidence": 0.912,
                "track_id": "#103",
                "bounding_box": {"x": 62.0, "y": 55.0, "width": 7.0, "height": 20.0},
                "movement_direction": "EAST",
                "speed_kmh": 3.2,
                "duration_sec": 8,
                "zone": "MONITORED ZONE"
            }
        ] if camera_id == "C-07" else [
            {
                "object_type": "VEHICLE" if camera_id == "C-04" else "PERSON",
                "confidence": 0.942,
                "track_id": "#088",
                "bounding_box": {"x": 25.0, "y": 40.0, "width": 14.0, "height": 16.0},
                "movement_direction": "SOUTH-WEST",
                "speed_kmh": 12.5,
                "duration_sec": 24,
                "zone": "SAFE ZONE"
            }
        ]
    }
