from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.entities import Incident, Alert, Camera

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("")
def get_analytics_data(db: Session = Depends(get_db)):
    return {
        "summary": {
            "total_cameras": 24,
            "active_cameras": 22,
            "ai_processing_status": "ONLINE",
            "active_alerts": db.query(Alert).filter(Alert.acknowledged == False).count(),
            "critical_incidents": db.query(Incident).filter(Incident.severity == "CRITICAL").count(),
            "objects_detected_today": 147,
            "avg_response_time_sec": 42.8
        },
        "threat_summary": {
            "normal": 108,
            "low_risk": 20,
            "medium_risk": 15,
            "high_risk": 3,
            "critical": 1
        },
        "threats_by_category": [
            {"category": "Restricted Zone Intrusion", "count": 18, "color": "#EF4444"},
            {"category": "Vehicle Activity", "count": 31, "color": "#F97316"},
            {"category": "Unusual Movement", "count": 12, "color": "#F59E0B"},
            {"category": "Abandoned Object", "count": 5, "color": "#8B5CF6"},
            {"category": "Boundary Crossing", "count": 7, "color": "#DC2626"},
            {"category": "Normal Patrols", "count": 61, "color": "#10B981"}
        ],
        "threats_by_severity": [
            {"name": "CRITICAL", "value": 1, "color": "#EF4444"},
            {"name": "HIGH", "value": 3, "color": "#F97316"},
            {"name": "MEDIUM", "value": 15, "color": "#F59E0B"},
            {"name": "LOW", "value": 20, "color": "#3B82F6"},
            {"name": "NORMAL", "value": 108, "color": "#10B981"}
        ],
        "incidents_over_time": [
            {"time": "00:00", "incidents": 2, "normal": 12},
            {"time": "02:00", "incidents": 1, "normal": 8},
            {"time": "04:00", "incidents": 4, "normal": 10},
            {"time": "06:00", "incidents": 2, "normal": 25},
            {"time": "08:00", "incidents": 7, "normal": 38},
            {"time": "10:00", "incidents": 9, "normal": 42},
            {"time": "12:00", "incidents": 5, "normal": 35},
            {"time": "14:00", "incidents": 3, "normal": 29},
            {"time": "16:00", "incidents": 6, "normal": 33},
            {"time": "18:00", "incidents": 8, "normal": 31},
            {"time": "20:00", "incidents": 4, "normal": 22},
            {"time": "22:00", "incidents": 3, "normal": 16}
        ],
        "camera_activity": [
            {"camera": "C-07", "alerts": 12, "sector": "Sector B", "status": "WARNING"},
            {"camera": "C-03", "alerts": 8, "sector": "Sector A", "status": "ONLINE"},
            {"camera": "C-05", "alerts": 7, "sector": "Sector B", "status": "ONLINE"},
            {"camera": "C-08", "alerts": 6, "sector": "Sector C", "status": "ONLINE"},
            {"camera": "C-14", "alerts": 5, "sector": "Sector C", "status": "WARNING"},
            {"camera": "C-11", "alerts": 4, "sector": "Sector B", "status": "ONLINE"},
            {"camera": "C-04", "alerts": 4, "sector": "Sector A", "status": "ONLINE"},
            {"camera": "C-19", "alerts": 3, "sector": "Sector D", "status": "ONLINE"}
        ]
    }
