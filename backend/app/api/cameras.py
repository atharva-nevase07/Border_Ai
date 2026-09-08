from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import os
import cv2
import time
import numpy as np
from ultralytics import YOLO
from ..database.session import get_db
from ..models.entities import Camera
from ..schemas.all_schemas import CameraResponse, CameraCreate

router = APIRouter(prefix="/api/cameras", tags=["Cameras"])

PHONE_STREAM_URL = os.getenv("PHONE_STREAM_URL", "http://10.183.244.231:8080/video")

# Load YOLOv11 nano model globally for live border surveillance inference
yolo_model = YOLO("yolo11n.pt")

latest_phone_frame = None
latest_phone_frame_time = 0.0

def update_phone_frame(frame: np.ndarray):
    global latest_phone_frame, latest_phone_frame_time
    if frame is not None:
        latest_phone_frame = frame.copy()
        latest_phone_frame_time = time.time()

def get_latest_phone_frame(max_age_seconds: float = 3.0):
    global latest_phone_frame, latest_phone_frame_time
    if latest_phone_frame is not None and (time.time() - latest_phone_frame_time) <= max_age_seconds:
        return latest_phone_frame.copy()
    return None

@router.get("", response_model=List[CameraResponse])
def get_cameras(sector: str = None, status: str = None, db: Session = Depends(get_db)):
    query = db.query(Camera)
    if sector:
        query = query.filter(Camera.sector == sector)
    if status:
        query = query.filter(Camera.status == status)
    return query.order_by(Camera.camera_id).all()

def generate_phone_frames():
    cap = cv2.VideoCapture(PHONE_STREAM_URL)
    fail_count = 0
    while True:
        success, frame = cap.read()
        if not success:
            fail_count += 1
            if fail_count > 5:
                cap.release()
                time.sleep(1)
                cap = cv2.VideoCapture(PHONE_STREAM_URL)
                fail_count = 0

            # Tactical standby frame if phone is connecting
            placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(placeholder, "EXTERNAL MOBILE NODE", (40, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            cv2.putText(placeholder, f"CONNECTING: {PHONE_STREAM_URL}", (40, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (180, 180, 180), 1)
            cv2.putText(placeholder, "STATUS: WAITING FOR MOBILE STREAM", (40, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 165, 255), 1)

            ret, buffer = cv2.imencode('.jpg', placeholder, [int(cv2.IMWRITE_JPEG_QUALITY), 75])
            if ret:
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            time.sleep(0.5)
            continue

        fail_count = 0

        # Pass captured frame through YOLOv11 model with confidence threshold 0.5
        results = yolo_model(frame, conf=0.5)
        # Render detection bounding boxes and labels onto the frame
        rendered_frame = results[0].plot()

        update_phone_frame(rendered_frame)
        ret, buffer = cv2.imencode('.jpg', rendered_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        if not ret:
            continue
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@router.get("/live/phone")
def get_phone_live_stream():
    """
    Reads live frames from external phone camera stream (IP Webcam) and yields multipart/x-mixed-replace.
    """
    return StreamingResponse(
        generate_phone_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

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
