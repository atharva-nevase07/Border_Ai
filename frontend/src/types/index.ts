export type ThreatSeverity = 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';
export type ZoneType = 'SAFE_ZONE' | 'MONITORED_ZONE' | 'RESTRICTED_ZONE' | 'BORDER_LINE';

export interface Camera {
  id: number;
  camera_id: string; // e.g. "C-01"
  name: string;
  sector: string;
  location: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  stream_url?: string;
  fps: number;
  resolution: string;
  latency_ms: number;
  last_seen: string;
}

export interface ZonePoint {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export interface Zone {
  id?: number;
  camera_id: string;
  name: string;
  zone_type: ZoneType;
  polygon_coordinates: ZonePoint[];
  color: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id?: number;
  camera_id: string;
  timestamp: string;
  object_type: 'PERSON' | 'VEHICLE' | 'MOTORCYCLE' | 'TRUCK' | 'BAG' | 'ABANDONED OBJECT';
  confidence: number;
  track_id: string;
  bounding_box: BoundingBox;
  movement_direction?: string;
  speed_kmh?: number;
  duration_sec?: number;
  zone?: string;
}

export interface TimelineEvent {
  time: string;
  event: string;
  desc: string;
}

export interface EvidenceRecord {
  id: number;
  incident_id: number;
  snapshot_path: string;
  video_path?: string;
  timestamp: string;
  object_type: string;
  track_id: string;
  confidence: number;
  metadata_json?: string;
}

export interface Alert {
  id: number;
  incident_id?: number;
  severity: ThreatSeverity;
  message: string;
  created_at: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
}

export interface Incident {
  id: number;
  incident_code: string;
  camera_id: string;
  sector: string;
  incident_type: string;
  severity: ThreatSeverity;
  risk_score: number;
  timestamp: string;
  status: IncidentStatus;
  description: string;
  threat_factors: string[];
  timeline_events: TimelineEvent[];
  evidence_records?: EvidenceRecord[];
  alerts?: Alert[];
}

export interface SystemStatus {
  cctv_network: string;
  video_ingestion: string;
  object_detection: string;
  tracking_engine: string;
  threat_engine: string;
  evidence_storage: string;
  alert_service: string;
  ai_assistant: string;
  total_cameras: number;
  active_cameras: number;
  warning_cameras: number;
  offline_cameras: number;
  uptime: string;
  timestamp: string;
}

export interface DemoStep {
  step: number;
  title: string;
  desc: string;
  status: 'pending' | 'running' | 'completed';
}
