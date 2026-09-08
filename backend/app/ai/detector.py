from typing import List, Dict, Any
from abc import ABC, abstractmethod

class BaseObjectDetector(ABC):
    """
    Abstract Base Class for Border Surveillance Object Detection.
    Ready for YOLOv8/v11/ONNX model plug-in.
    """
    @abstractmethod
    def detect(self, frame_or_stream_id: str) -> List[Dict[str, Any]]:
        pass

class MockObjectDetector(BaseObjectDetector):
    """
    High-fidelity simulation of object detection for CCTV border streams.
    Generates realistic detections with bounding boxes and high confidence scores.
    """
    def __init__(self):
        self.supported_classes = [
            "PERSON",
            "VEHICLE",
            "MOTORCYCLE",
            "TRUCK",
            "BAG",
            "ABANDONED OBJECT"
        ]

    def detect(self, frame_or_stream_id: str) -> List[Dict[str, Any]]:
        # In actual YOLO integration:
        # results = model(frame)
        # return parsed_boxes
        return [
            {
                "object_type": "PERSON",
                "confidence": 0.964,
                "bounding_box": {"x": 38.5, "y": 42.0, "width": 8.5, "height": 22.0},
                "track_id": "#102"
            }
        ]

# Global singleton instance ready for swapping with YOLODetector
detector = MockObjectDetector()
