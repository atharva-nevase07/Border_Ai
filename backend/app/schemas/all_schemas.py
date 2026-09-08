import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class CameraBase(BaseModel):
    camera_id: str
    name: str
    sector: str
    location: str
    status: str = "ONLINE"
    stream_url: Optional[str] = ""
    fps: float = 25.0
    resolution: str = "1080p FHD"
    latency_ms: int = 78

class CameraCreate(CameraBase):
    pass

class CameraResponse(CameraBase):
    id: int
    last_seen: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class ZoneBase(BaseModel):
    camera_id: str
    name: str
    zone_type: str # SAFE_ZONE, MONITORED_ZONE, RESTRICTED_ZONE, BORDER_LINE
    polygon_coordinates: str # JSON array of {x, y} in normalized 0-100 coordinates
    color: Optional[str] = "#EF4444"

class ZoneCreate(ZoneBase):
    pass

class ZoneResponse(ZoneBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class DetectionBase(BaseModel):
    camera_id: str
    object_type: str
    confidence: float
    track_id: str
    bounding_box: str # JSON: {x, y, width, height}
    movement_direction: Optional[str] = "NORTH-EAST"
    speed_kmh: Optional[float] = 4.2
    duration_sec: Optional[int] = 12

class DetectionCreate(DetectionBase):
    pass

class DetectionResponse(DetectionBase):
    id: int
    timestamp: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class EvidenceResponse(BaseModel):
    id: int
    incident_id: Optional[int] = None
    snapshot_path: str
    video_path: Optional[str] = None
    timestamp: datetime.datetime
    object_type: str
    track_id: str
    confidence: float
    metadata_json: Optional[str] = "{}"
    model_config = ConfigDict(from_attributes=True)

class SnapshotRequest(BaseModel):
    stream_url: Optional[str] = None
    incident_id: Optional[int] = None
    camera_id: Optional[str] = "PHONE-01"
    object_type: Optional[str] = "PERSON"
    track_id: Optional[str] = "#MOBILE-01"
    confidence: Optional[float] = 0.95
    metadata: Optional[Dict[str, Any]] = None

class AlertBase(BaseModel):
    incident_id: Optional[int] = None
    severity: str
    message: str

class AlertResponse(AlertBase):
    id: int
    created_at: datetime.datetime
    acknowledged: bool
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime.datetime] = None
    model_config = ConfigDict(from_attributes=True)

class IncidentBase(BaseModel):
    incident_code: str
    camera_id: str
    sector: str
    incident_type: str
    severity: str
    risk_score: int
    description: str
    threat_factors: Optional[str] = "[]"
    timeline_events: Optional[str] = "[]"
    status: str = "OPEN"

class IncidentCreate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: int
    timestamp: datetime.datetime
    evidence_records: List[EvidenceResponse] = []
    alerts: List[AlertResponse] = []
    model_config = ConfigDict(from_attributes=True)

class AssistantQueryRequest(BaseModel):
    query: str
    officer_id: Optional[str] = "OFFICER-7492"

class AssistantQueryResponse(BaseModel):
    answer: str
    matched_incidents: List[IncidentResponse] = []
    suggestions: List[str] = []
    query_intent: Dict[str, Any] = {}

class SystemStatusResponse(BaseModel):
    cctv_network: str = "ONLINE"
    video_ingestion: str = "ONLINE"
    object_detection: str = "ONLINE"
    tracking_engine: str = "ONLINE"
    threat_engine: str = "ONLINE"
    evidence_storage: str = "ONLINE"
    alert_service: str = "ONLINE"
    ai_assistant: str = "ONLINE"
    total_cameras: int = 24
    active_cameras: int = 22
    warning_cameras: int = 2
    offline_cameras: int = 0
    uptime: str = "99.98%"
    timestamp: datetime.datetime

class AnalyticsSummary(BaseModel):
    total_events_today: int
    threats_by_category: Dict[str, int]
    threats_by_severity: Dict[str, int]
    alerts_by_hour: List[Dict[str, Any]]
    camera_activity: List[Dict[str, Any]]
    avg_response_time_sec: float
