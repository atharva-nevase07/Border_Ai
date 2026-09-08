import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database.session import Base

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. "C-01"
    name = Column(String(100), nullable=False) # e.g. "Post Alpha Perimeter"
    sector = Column(String(50), index=True, nullable=False) # e.g. "Sector A"
    location = Column(String(200), nullable=False) # Coordinates or outpost name
    status = Column(String(20), default="ONLINE") # ONLINE, WARNING, OFFLINE
    stream_url = Column(String(255), default="")
    fps = Column(Float, default=25.0)
    resolution = Column(String(50), default="1080p FHD")
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
    latency_ms = Column(Integer, default=78)

    zones = relationship("Zone", back_populates="camera", cascade="all, delete-orphan")
    detections = relationship("Detection", back_populates="camera")
    incidents = relationship("Incident", back_populates="camera")

class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String(50), ForeignKey("cameras.camera_id"), nullable=False)
    name = Column(String(100), nullable=False)
    zone_type = Column(String(50), nullable=False) # SAFE_ZONE, MONITORED_ZONE, RESTRICTED_ZONE, BORDER_LINE
    polygon_coordinates = Column(Text, nullable=False) # JSON string of [{x: float, y: float}]
    color = Column(String(50), default="#EF4444")

    camera = relationship("Camera", back_populates="zones")

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String(50), ForeignKey("cameras.camera_id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    object_type = Column(String(50), nullable=False) # PERSON, VEHICLE, MOTORCYCLE, TRUCK, BAG, ABANDONED_OBJECT
    confidence = Column(Float, nullable=False) # e.g. 0.964
    track_id = Column(String(50), nullable=False, index=True) # e.g. "#102"
    bounding_box = Column(Text, nullable=False) # JSON: {x, y, width, height}
    movement_direction = Column(String(50), default="NORTH-EAST")
    speed_kmh = Column(Float, default=4.2)
    duration_sec = Column(Integer, default=12)

    camera = relationship("Camera", back_populates="detections")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. "INC-2026-09-08-0042"
    camera_id = Column(String(50), ForeignKey("cameras.camera_id"), nullable=False)
    sector = Column(String(50), index=True, nullable=False)
    incident_type = Column(String(100), nullable=False) # Restricted Zone Intrusion, Boundary Crossing, etc.
    severity = Column(String(20), nullable=False) # NORMAL, LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Integer, nullable=False) # 0 - 100
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    status = Column(String(50), default="OPEN") # OPEN, INVESTIGATING, RESOLVED, ESCALATED
    description = Column(Text, nullable=False)
    threat_factors = Column(Text, default="[]") # JSON list of reasons: ["Restricted zone entry", "Boundary crossing"]
    timeline_events = Column(Text, default="[]") # JSON array of {time, event, description}

    camera = relationship("Camera", back_populates="incidents")
    evidence_records = relationship("Evidence", back_populates="incident", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="incident", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    snapshot_path = Column(String(255), nullable=False)
    video_path = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    object_type = Column(String(50), default="PERSON")
    track_id = Column(String(50), default="#102")
    confidence = Column(Float, default=0.96)
    metadata_json = Column(Text, default="{}")

    incident = relationship("Incident", back_populates="evidence_records")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    severity = Column(String(20), nullable=False) # NORMAL, LOW, MEDIUM, HIGH, CRITICAL
    message = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(100), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)

    incident = relationship("Incident", back_populates="alerts")
