import time
from typing import List, Dict, Any
from abc import ABC, abstractmethod

class BaseTracker(ABC):
    """
    Abstract Base Class for Multi-Object Tracking (MOT).
    Ready for ByteTrack / DeepSORT / Norfair integration.
    """
    @abstractmethod
    def update(self, detections: List[Dict[str, Any]], camera_id: str) -> List[Dict[str, Any]]:
        pass

class SimulatedTracker(BaseTracker):
    """
    Simulated persistent tracker maintaining object trajectories, vectors,
    durations, and unique track IDs across CCTV frames.
    """
    def __init__(self):
        self.active_tracks: Dict[str, Dict[str, Any]] = {}

    def update(self, detections: List[Dict[str, Any]], camera_id: str) -> List[Dict[str, Any]]:
        tracked_results = []
        now = time.time()

        for det in detections:
            track_id = det.get("track_id", f"#{int(now) % 900 + 100}")
            if track_id not in self.active_tracks:
                self.active_tracks[track_id] = {
                    "track_id": track_id,
                    "first_seen": now,
                    "last_seen": now,
                    "object_type": det.get("object_type", "PERSON"),
                    "confidence": det.get("confidence", 0.95),
                    "movement_direction": "NORTH-EAST (TOWARDS BORDER)",
                    "speed_kmh": 4.8,
                    "positions": [det.get("bounding_box", {"x": 40, "y": 45})]
                }
            else:
                track = self.active_tracks[track_id]
                track["last_seen"] = now
                track["confidence"] = det.get("confidence", track["confidence"])

            track_info = self.active_tracks[track_id]
            duration = int(now - track_info["first_seen"])
            
            tracked_results.append({
                "track_id": track_id,
                "object_type": track_info["object_type"],
                "confidence": track_info["confidence"],
                "bounding_box": det.get("bounding_box"),
                "movement_direction": track_info["movement_direction"],
                "speed_kmh": track_info["speed_kmh"],
                "duration_sec": max(1, duration),
                "camera_id": camera_id
            })

        return tracked_results

# Global tracker instance
tracker = SimulatedTracker()
