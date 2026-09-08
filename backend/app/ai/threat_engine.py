from typing import List, Dict, Any, Tuple
from abc import ABC, abstractmethod

class BaseThreatEngine(ABC):
    """
    Abstract Base Class for Border Threat Assessment.
    Can be replaced by an ML/behavioral model.
    """
    @abstractmethod
    def calculate_risk(self, event_data: Dict[str, Any]) -> Tuple[int, str, List[str]]:
        pass

class RuleBasedThreatEngine(BaseThreatEngine):
    """
    Deterministic rule-based border risk scoring engine.
    Calculates 0-100 risk score and identifies exact causal threat factors.
    """
    def calculate_risk(self, event_data: Dict[str, Any]) -> Tuple[int, str, List[str]]:
        score = 0
        factors: List[str] = []

        # 1. Base Object Detection
        obj_type = event_data.get("object_type", "").upper()
        if "PERSON" in obj_type:
            score += 10
            factors.append("Person detected in surveillance grid (+10)")
        elif "VEHICLE" in obj_type or "TRUCK" in obj_type:
            score += 15
            factors.append(f"{obj_type} detected near boundary sector (+15)")

        # 2. Zone Intelligence
        zone = event_data.get("zone", "").upper()
        if "RESTRICTED" in zone or event_data.get("restricted_zone_entry", False):
            score += 40
            factors.append("Restricted zone intrusion breach (+40)")
        elif "MONITORED" in zone or event_data.get("monitored_zone_entry", False):
            score += 20
            factors.append("Monitored perimeter zone entry (+20)")

        # 3. Boundary Crossing
        if event_data.get("boundary_crossing", False):
            score += 50
            factors.append("Critical national border boundary crossed (+50)")

        # 4. Loitering / Prolonged Presence
        if event_data.get("loitering", False) or event_data.get("duration_sec", 0) > 20:
            score += 20
            factors.append(f"Prolonged presence / loitering detected ({event_data.get('duration_sec', 22)}s) (+20)")

        # 5. Unusual Movement / High-Velocity Vectors
        if event_data.get("unusual_movement", False):
            score += 25
            factors.append("Unusual tactical evasive movement vector (+25)")

        # 6. Abandoned Object
        if "ABANDONED" in obj_type or event_data.get("abandoned_object", False):
            score += 35
            factors.append("Unattended suspicious package / payload (+35)")

        # 7. Vehicle near restricted area
        if ("VEHICLE" in obj_type or "TRUCK" in obj_type) and ("RESTRICTED" in zone or event_data.get("restricted_zone_entry", False)):
            score += 25
            factors.append("Unidentified vehicle stationary near restricted line (+25)")

        # Clamp between 0 and 100
        final_score = max(0, min(100, score))

        # Severity categorization
        if final_score <= 20:
            severity = "NORMAL"
        elif final_score <= 40:
            severity = "LOW"
        elif final_score <= 60:
            severity = "MEDIUM"
        elif final_score <= 80:
            severity = "HIGH"
        else:
            severity = "CRITICAL"

        return final_score, severity, factors

# Global singleton instance
threat_engine = RuleBasedThreatEngine()
