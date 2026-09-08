import datetime
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.entities import Incident, Alert, Evidence, Detection, Camera
from ..ai.threat_engine import threat_engine
from ..ai.evidence_gen import evidence_generator

router = APIRouter(prefix="/api/demo", tags=["Demo Simulation"])

@router.post("/trigger-intrusion")
def trigger_test_intrusion(camera_id: str = "C-07", db: Session = Depends(get_db)):
    """
    Executes the complete 12-step SIH demo sequence:
    1. Detects Person
    2. Assigns Track #102
    3. Triggers Restricted Zone Entry & Boundary Breach
    4. Threat Engine calculates 87/100 (CRITICAL)
    5. Saves Evidence & Timeline
    6. Dispatches Critical Alert
    7. Primes AI Assistant
    """
    ts = datetime.datetime.utcnow()
    time_str = ts.strftime("%H:%M:%S")
    incident_code = f"INC-2026-09-08-00{int(ts.timestamp()) % 80 + 20}"

    event_payload = {
        "camera_id": camera_id,
        "sector": "Sector B",
        "object_type": "PERSON",
        "track_id": "#102",
        "confidence": 0.964,
        "restricted_zone_entry": True,
        "boundary_crossing": True,
        "unusual_movement": True,
        "duration_sec": 26,
        "zone": "RESTRICTED ZONE"
    }

    # Threat Engine evaluation
    risk_score, severity, factors = threat_engine.calculate_risk(event_payload)

    # Timeline generation
    timeline = [
        {"time": time_str, "event": "Person detected", "desc": "AI Object Detector identified target as PERSON (96.4% confidence)."},
        {"time": time_str, "event": "Track ID assigned", "desc": "Multi-Object Tracker initialized persistent Track #102."},
        {"time": time_str, "event": "Approached restricted zone", "desc": "Track #102 vector heading towards Sector B restricted polygon."},
        {"time": time_str, "event": "Boundary breached", "desc": "Polygon intersection confirmed with Border Zero Line."},
        {"time": time_str, "event": f"Risk calculated ({risk_score}/100)", "desc": f"Threat Engine scored causal factors: {', '.join(factors)}."},
        {"time": time_str, "event": "Critical Alert dispatched", "desc": f"Dispatched RED alert to all command center consoles."},
        {"time": time_str, "event": "Forensic evidence generated", "desc": "Captured annotated snapshot and 10s pre/post event video buffer."}
    ]

    # Create Incident
    incident = Incident(
        incident_code=incident_code,
        camera_id=camera_id,
        sector="Sector B",
        incident_type="Restricted Zone Intrusion",
        severity=severity,
        risk_score=risk_score,
        timestamp=ts,
        status="OPEN",
        description="High-priority perimeter breach: Target Track #102 crossed Restricted Polygon Alpha in Sector B towards zero line.",
        threat_factors=json.dumps(factors),
        timeline_events=json.dumps(timeline)
    )
    db.add(incident)
    db.flush()

    # Evidence Generation
    ev_data = evidence_generator.create(incident_code, {
        "camera_id": camera_id,
        "sector": "Sector B",
        "risk_score": risk_score,
        "object_type": "PERSON",
        "track_id": "#102",
        "confidence": 0.964
    })

    evidence = Evidence(
        incident_id=incident.id,
        snapshot_path=ev_data["snapshot_path"],
        video_path=ev_data["video_path"],
        timestamp=ts,
        object_type="PERSON",
        track_id="#102",
        confidence=0.964,
        metadata_json=ev_data["metadata_json"]
    )
    db.add(evidence)

    # Alert Dispatch
    alert = Alert(
        incident_id=incident.id,
        severity=severity,
        message=f"CRITICAL ALERT: Restricted Zone Intrusion at Camera {camera_id} (Sector B) - Risk Score {risk_score}/100",
        created_at=ts,
        acknowledged=False
    )
    db.add(alert)

    # Detection record
    detection = Detection(
        camera_id=camera_id,
        timestamp=ts,
        object_type="PERSON",
        confidence=0.964,
        track_id="#102",
        bounding_box=json.dumps({"x": 38.5, "y": 42.0, "width": 8.5, "height": 22.0}),
        movement_direction="NORTH-EAST",
        speed_kmh=5.4,
        duration_sec=26
    )
    db.add(detection)

    db.commit()

    return {
        "status": "SUCCESS",
        "step_completed": 12,
        "incident_code": incident_code,
        "camera_id": camera_id,
        "sector": "Sector B",
        "track_id": "#102",
        "risk_score": risk_score,
        "severity": severity,
        "threat_factors": factors,
        "alert_id": alert.id,
        "evidence": {
            "snapshot": ev_data["snapshot_path"],
            "video": ev_data["video_path"]
        },
        "timeline": timeline,
        "message": f"Demonstration intrusion triggered successfully for {camera_id}."
    }
