import json
import datetime
from sqlalchemy.orm import Session
from ..models.entities import Camera, Zone, Detection, Incident, Evidence, Alert

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Camera).count() > 0:
        return

    print("Seeding BORDER AI command center database...")

    # 1. Seed 24 CCTV Cameras
    cameras = []
    sectors = [("Sector A", "Western Ridge Outpost"), 
               ("Sector B", "Northern Riverine Valley"), 
               ("Sector C", "Eastern Desert Flatlands"), 
               ("Sector D", "Southern Border Gate")]

    for i in range(1, 25):
        cam_id = f"C-{i:02d}"
        sector_idx = (i - 1) // 6
        sector_name, base_loc = sectors[sector_idx]
        
        # 22 Online, 2 Warning
        if i == 7:
            status = "WARNING"
            fps = 18.0
            latency = 214
        elif i == 14:
            status = "WARNING"
            fps = 20.0
            latency = 185
        else:
            status = "ONLINE"
            fps = 25.0
            latency = 65 + (i * 3) % 40

        cam = Camera(
            camera_id=cam_id,
            name=f"Tactical Mast {i:02d}",
            sector=sector_name,
            location=f"{base_loc} - Grid Reference {100 + i * 4}.{200 + i * 7}",
            status=status,
            stream_url=f"/simulated_feeds/{cam_id.lower()}_feed.mp4",
            fps=fps,
            resolution="1080p FHD (1920x1080)",
            last_seen=datetime.datetime.utcnow(),
            latency_ms=latency
        )
        db.add(cam)
        cameras.append(cam)
    
    db.commit()

    # 2. Seed Default Zones for Camera C-07 and C-01
    default_zones = [
        Zone(
            camera_id="C-07",
            name="North Buffer Safe Zone",
            zone_type="SAFE_ZONE",
            polygon_coordinates=json.dumps([
                {"x": 5, "y": 70}, {"x": 45, "y": 70}, {"x": 45, "y": 95}, {"x": 5, "y": 95}
            ]),
            color="#10B981"
        ),
        Zone(
            camera_id="C-07",
            name="Perimeter Monitored Zone",
            zone_type="MONITORED_ZONE",
            polygon_coordinates=json.dumps([
                {"x": 10, "y": 40}, {"x": 80, "y": 40}, {"x": 80, "y": 68}, {"x": 10, "y": 68}
            ]),
            color="#F59E0B"
        ),
        Zone(
            camera_id="C-07",
            name="Tactical Restricted Strip",
            zone_type="RESTRICTED_ZONE",
            polygon_coordinates=json.dumps([
                {"x": 20, "y": 15}, {"x": 90, "y": 15}, {"x": 90, "y": 38}, {"x": 20, "y": 38}
            ]),
            color="#EF4444"
        ),
        Zone(
            camera_id="C-07",
            name="Border Zero Line",
            zone_type="BORDER_LINE",
            polygon_coordinates=json.dumps([
                {"x": 0, "y": 12}, {"x": 100, "y": 12}
            ]),
            color="#DC2626"
        )
    ]
    for z in default_zones:
        db.add(z)
    db.commit()

    # 3. Seed Realistic High-Risk and Critical Incidents
    incidents_data = [
        {
            "code": "INC-2026-09-08-0042",
            "camera_id": "C-07",
            "sector": "Sector B",
            "incident_type": "Restricted Zone Intrusion",
            "severity": "CRITICAL",
            "risk_score": 87,
            "time_offset_min": 15,
            "status": "OPEN",
            "description": "Unauthorized male suspect crossed perimeter boundary into restricted zone. Multi-object tracker locked Track #102 moving north-east.",
            "factors": [
                "Person detected in surveillance grid (+10)",
                "Restricted zone intrusion breach (+40)",
                "Critical national border boundary crossed (+50)",
                "Tactical evasive movement vector (+25)"
            ],
            "timeline": [
                {"time": "10:41:52", "event": "Person detected", "desc": "Subject identified at perimeter edge by YOLO model."},
                {"time": "10:42:03", "event": "Person approaching restricted zone", "desc": "Track #102 heading towards monitored sector."},
                {"time": "10:42:17", "event": "Boundary crossed", "desc": "Subject crossed polygon Restricted Zone Alpha."},
                {"time": "10:42:18", "event": "Risk score increased to 87", "desc": "Threat Engine classified threat as CRITICAL."},
                {"time": "10:42:20", "event": "Critical alert generated", "desc": "Red alert dispatched to operations center."},
                {"time": "10:42:21", "event": "Snapshot captured", "desc": "High-res evidence snapshot incident_0042.jpg stored."},
                {"time": "10:42:22", "event": "Video evidence saved", "desc": "Forensic video snippet incident_0042.mp4 archived."}
            ]
        },
        {
            "code": "INC-2026-09-08-0038",
            "camera_id": "C-05",
            "sector": "Sector B",
            "incident_type": "Unusual Movement",
            "severity": "HIGH",
            "risk_score": 71,
            "time_offset_min": 65,
            "status": "INVESTIGATING",
            "description": "Erratic non-linear movement vector detected near marshland sensor grid. Suspect changed heading rapidly under tree cover.",
            "factors": [
                "Person detected in surveillance grid (+10)",
                "Monitored perimeter zone entry (+20)",
                "Tactical evasive movement vector (+25)",
                "Prolonged presence detected (+20)"
            ],
            "timeline": [
                {"time": "09:49:10", "event": "Initial motion ping", "desc": "Radar sensor tripped in marsh area."},
                {"time": "09:50:24", "event": "Tracker locked #098", "desc": "Object tagged as Person with erratic speed."},
                {"time": "09:51:30", "event": "Risk escalated to 71", "desc": "Threat Engine marked HIGH severity."}
            ]
        },
        {
            "code": "INC-2026-09-08-0032",
            "camera_id": "C-08",
            "sector": "Sector C",
            "incident_type": "Vehicle Near Boundary",
            "severity": "HIGH",
            "risk_score": 65,
            "time_offset_min": 104,
            "status": "OPEN",
            "description": "Unregistered 4x4 off-road vehicle stopped 35 meters south of secondary fence without lights.",
            "factors": [
                "VEHICLE detected near boundary sector (+15)",
                "Monitored perimeter zone entry (+20)",
                "Unidentified vehicle stationary near restricted line (+25)"
            ],
            "timeline": [
                {"time": "09:10:05", "event": "Thermal vehicle lock", "desc": "Engine heat signature detected on Mast 08."},
                {"time": "09:11:40", "event": "Vehicle halted", "desc": "Vehicle remained stationary for >90 seconds."},
                {"time": "09:12:15", "event": "Alert generated", "desc": "Patrol Unit Delta-3 dispatched."}
            ]
        },
        {
            "code": "INC-2026-09-08-0029",
            "camera_id": "C-03",
            "sector": "Sector A",
            "incident_type": "Abandoned Object",
            "severity": "CRITICAL",
            "risk_score": 82,
            "time_offset_min": 140,
            "status": "RESOLVED",
            "description": "Large military-grade olive canvas bag left unattended near drainage culvert. Target left on foot.",
            "factors": [
                "Unattended suspicious package / payload (+35)",
                "Restricted zone intrusion breach (+40)",
                "Prolonged presence / loitering detected (+20)"
            ],
            "timeline": [
                {"time": "08:52:12", "event": "Person deposited object", "desc": "Subject placed item and moved away rapidly."},
                {"time": "08:54:31", "event": "Object static timer expired", "desc": "AI classified object as Abandoned Payload."},
                {"time": "08:55:00", "event": "Bomb disposal team alerted", "desc": "Incident verified by Sector Commander."}
            ]
        }
    ]

    for inc_data in incidents_data:
        ts = datetime.datetime.utcnow() - datetime.timedelta(minutes=inc_data["time_offset_min"])
        incident = Incident(
            incident_code=inc_data["code"],
            camera_id=inc_data["camera_id"],
            sector=inc_data["sector"],
            incident_type=inc_data["incident_type"],
            severity=inc_data["severity"],
            risk_score=inc_data["risk_score"],
            timestamp=ts,
            status=inc_data["status"],
            description=inc_data["description"],
            threat_factors=json.dumps(inc_data["factors"]),
            timeline_events=json.dumps(inc_data["timeline"])
        )
        db.add(incident)
        db.flush()

        # Add Evidence record
        evidence = Evidence(
            incident_id=incident.id,
            snapshot_path=f"/evidence/{inc_data['code'].lower()}_snapshot.jpg",
            video_path=f"/evidence/{inc_data['code'].lower()}_clip.mp4",
            timestamp=ts,
            object_type="PERSON" if "Vehicle" not in inc_data["incident_type"] else "VEHICLE",
            track_id="#102" if inc_data["camera_id"] == "C-07" else f"#{100 + incident.id}",
            confidence=0.964 if inc_data["camera_id"] == "C-07" else 0.92,
            metadata_json=json.dumps({
                "camera": inc_data["camera_id"],
                "sector": inc_data["sector"],
                "risk_score": inc_data["risk_score"],
                "resolution": "1080p FHD",
                "verified_by_ai": True
            })
        )
        db.add(evidence)

        # Add Alert record
        alert = Alert(
            incident_id=incident.id,
            severity=inc_data["severity"],
            message=f"{inc_data['severity']} ALERT: {inc_data['incident_type']} at {inc_data['camera_id']} ({inc_data['sector']}) - Risk {inc_data['risk_score']}/100",
            created_at=ts,
            acknowledged=inc_data["status"] == "RESOLVED"
        )
        db.add(alert)

    # 4. Add Live Detection Samples
    detections_data = [
        ("C-07", "PERSON", 0.964, "#102", {"x": 38.5, "y": 42.0, "width": 8.5, "height": 22.0}, "NORTH-EAST", 4.8, 18),
        ("C-07", "PERSON", 0.912, "#103", {"x": 62.0, "y": 55.0, "width": 7.0, "height": 20.0}, "EAST", 3.2, 8),
        ("C-04", "VEHICLE", 0.941, "#088", {"x": 15.0, "y": 30.0, "width": 18.0, "height": 14.0}, "SOUTH-WEST", 22.0, 45),
        ("C-11", "PERSON", 0.895, "#112", {"x": 45.0, "y": 50.0, "width": 6.5, "height": 19.0}, "WEST", 2.1, 14),
    ]

    for c_id, o_type, conf, t_id, bbox, move, spd, dur in detections_data:
        det = Detection(
            camera_id=c_id,
            timestamp=datetime.datetime.utcnow(),
            object_type=o_type,
            confidence=conf,
            track_id=t_id,
            bounding_box=json.dumps(bbox),
            movement_direction=move,
            speed_kmh=spd,
            duration_sec=dur
        )
        db.add(det)

    db.commit()
    print("Database seeding completed successfully.")
