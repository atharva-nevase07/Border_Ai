import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models.entities import Alert

class AlertService:
    @staticmethod
    def trigger(
        db: Session,
        incident_id: Optional[int],
        severity: str,
        message: str
    ) -> Alert:
        alert = Alert(
            incident_id=incident_id,
            severity=severity,
            message=message,
            created_at=datetime.datetime.utcnow(),
            acknowledged=False
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def acknowledge(db: Session, alert_id: int, officer_id: str = "OFFICER-7492") -> Optional[Alert]:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.acknowledged = True
            alert.acknowledged_by = officer_id
            alert.acknowledged_at = datetime.datetime.utcnow()
            db.commit()
            db.refresh(alert)
        return alert

alert_service = AlertService()
