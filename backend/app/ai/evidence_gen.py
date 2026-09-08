import os
import json
import datetime
from typing import Dict, Any
from abc import ABC, abstractmethod

class BaseEvidenceGenerator(ABC):
    @abstractmethod
    def create(self, incident_code: str, event_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

class LocalEvidenceGenerator(BaseEvidenceGenerator):
    """
    Evidence generation engine that creates forensic metadata and simulated
    snapshots/recordings for border surveillance incidents.
    Can be configured to upload to S3/MinIO.
    """
    def __init__(self, base_evidence_dir: str = "evidence_storage"):
        self.base_dir = base_evidence_dir
        os.makedirs(self.base_dir, exist_ok=True)

    def create(self, incident_code: str, event_data: Dict[str, Any]) -> Dict[str, Any]:
        timestamp = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        sanitized_code = incident_code.replace("-", "_").lower()
        
        snapshot_filename = f"{sanitized_code}_{timestamp}.jpg"
        video_filename = f"{sanitized_code}_{timestamp}.mp4"

        metadata = {
            "incident_code": incident_code,
            "camera_id": event_data.get("camera_id", "C-07"),
            "sector": event_data.get("sector", "Sector B"),
            "object_type": event_data.get("object_type", "PERSON"),
            "track_id": event_data.get("track_id", "#102"),
            "confidence": event_data.get("confidence", 0.964),
            "risk_score": event_data.get("risk_score", 87),
            "bounding_box": event_data.get("bounding_box", {"x": 38, "y": 42, "width": 10, "height": 24}),
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "storage_provider": "LOCAL_FORENSIC_VAULT",
            "hash_sha256": "8f4a1c2b5e9d3a7764f2010c926a4b11f3d8a9e201bcf4d1a0e8c71b3e945c22"
        }

        # Save metadata record
        meta_filepath = os.path.join(self.base_dir, f"{sanitized_code}_{timestamp}_meta.json")
        try:
            with open(meta_filepath, "w") as f:
                json.dump(metadata, f, indent=2)
        except Exception:
            pass

        return {
            "snapshot_path": f"/evidence/{snapshot_filename}",
            "video_path": f"/evidence/{video_filename}",
            "metadata_json": json.dumps(metadata)
        }

evidence_generator = LocalEvidenceGenerator()
