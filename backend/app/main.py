import os
import json
import asyncio
import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database.session import engine, Base, SessionLocal
from .database.seed_data import seed_database
from .api import (
    cameras,
    detections,
    incidents,
    alerts,
    evidence,
    zones,
    analytics,
    assistant,
    system,
    demo
)

# 1. Initialize Tables & Seed Data
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

# 2. Create FastAPI Application
app = FastAPI(
    title="BORDER AI - Border Surveillance Video Analytics Platform",
    description="SIH26187: Intelligent CCTV Video Analytics Platform for Border Security",
    version="1.0.0"
)

# 3. CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Mount API Routers
app.include_router(cameras.router)
app.include_router(detections.router)
app.include_router(incidents.router)
app.include_router(alerts.router)
app.include_router(evidence.router)
app.include_router(zones.router)
app.include_router(analytics.router)
app.include_router(assistant.router)
app.include_router(system.router)
app.include_router(demo.router)

# 5. Evidence directory static mount
evidence_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "evidence_storage")
os.makedirs(evidence_dir, exist_ok=True)
app.mount("/evidence", StaticFiles(directory=evidence_dir), name="evidence")

# 6. WebSocket Live Stream Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial status
        await websocket.send_text(json.dumps({
            "type": "CONNECTION_ESTABLISHED",
            "message": "Connected to BORDER AI Real-time Event Bus",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }))
        while True:
            # Keep-alive loop with telemetry ping
            data = await websocket.receive_text()
            # Echo or process incoming client commands
            await websocket.send_text(json.dumps({
                "type": "PONG",
                "received": data,
                "timestamp": datetime.datetime.utcnow().isoformat()
            }))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "system": "BORDER AI - Intelligent Border Surveillance Video Analytics Platform",
        "problem_statement": "SIH26187",
        "status": "ONLINE",
        "api_docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
