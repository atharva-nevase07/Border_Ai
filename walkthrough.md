# Walkthrough: BORDER AI – Intelligent Border Surveillance Platform (SIH26187)

We have built, verified, and delivered **BORDER AI** — a high-end defense-grade border surveillance command center and intelligent video analytics platform tailored for SIH Problem Statement **SIH26187** (*AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure*).

---

## 1. System Overview & Core Capabilities

| Capability | Implementation Detail |
|---|---|
| **CCTV Ingestion** | 24 surveillance cameras across Sectors A, B, C, and D with live telemetry (FPS, resolution, latency). |
| **AI Detection & Tracking** | Simulated YOLOv11 and ByteTrack multi-object tracking (`PERSON #102 [96.4%]`, speed vectors, trajectory trails). |
| **Border Intelligence** | Interactive polygon zone editor supporting **Safe Zone**, **Monitored Zone**, **Restricted Zone**, and **Border Zero Line**. |
| **Threat Scoring Engine** | Multi-factor 0–100 risk scoring with transparent causal explanations (+10 person, +20 monitored, +40 restricted, +50 boundary breach). |
| **Automatic Evidence Vault** | High-resolution annotated snapshots, 10s video buffers, and cryptographic SHA-256 integrity verification. |
| **Tactical Alert Dispatch** | Real-time audible sirens (Web Audio API), emergency toast banners, and console notifications. |
| **AI Investigation Assistant** | Natural-language query interface answering operational questions with structured incident previews. |
| **Judge Demo Controller** | One-click 12-step automated scenario illustrating the entire end-to-end intrusion pipeline in real time. |

---

## 2. Visual Walkthrough & Key Screens

### 2.1 Defense Landing Screen (`/`)
![Landing Page](/landing_page_1788843254994.png)
*Features Level-4 clearance authentication, operational encryption specs, and system telemetry indicators.*

---

### 2.2 Command Center Dashboard (`/dashboard`)
![Dashboard Overview](/dashboard_overview_1788843421294.png)
*Displays 6 primary KPI metric cards, Live Threat Level Distribution bar (Normal, Low, Medium, High, Critical), Active Threats panel, and AI Subsystems status.*

![Dashboard Lower Panel](/dashboard_scrolled_1788843481482.png)
*Active Threats registry sorted by risk score, alongside live perimeter event feeds.*

---

### 2.3 One-Click 12-Step Judge Demonstration Modal
![Judge Demo Controller](/demo_completed_modal_1788843654011.png)
*Step-by-step interactive runner illuminating all 12 stages from baseline CCTV monitoring through YOLO detection, boundary breach, risk score escalation (87/100), alert dispatch, evidence generation, to AI Assistant readiness.*

---

### 2.4 AI Investigation Assistant (`/assistant`)
![AI Assistant Results](/ai_assistant_results_1788843760213.png)
*Responds to queries like "Show suspicious activity in Sector B" with structured incident cards, threat badges, and deep-link actions.*

---

### 2.5 Live Surveillance & Polygon Zone Editor (`/surveillance`)
![Live Surveillance](/live_surveillance_c07_1788843813724.png)
*HTML5 Canvas-powered CCTV feed featuring real-time AI bounding boxes, motion vectors, and customizable polygon zone overlays.*

---

### 2.6 Tactical Geospatial Radar Map (`/map`)
![Border Map](/border_map_tactical_1788843856943.png)
*Geospatial representation of the National Border Zero Line, Sectors A-D, and clickable camera mast nodes.*

---

### 2.7 Alerts & Evidence Vault
| Alert Center (`/alerts`) | Forensic Evidence Vault (`/evidence`) |
|---|---|
| ![Alerts](/alerts_page_1788843893980.png) | ![Evidence Vault](/evidence_vault_page_1788843996210.png) |

---

### 2.8 Analytics & Diagnostics
| Analytics Dashboard (`/analytics`) | System Status Matrix (`/system`) |
|---|---|
| ![Analytics](/analytics_page_1788844027029.png) | ![System Status](/system_status_page_1788844055229.png) |

---

## 3. Automated Verification Results

### Frontend TypeScript Validation:
- Ran `tsc -b && vite build`
- Output: `✓ 2448 modules transformed, built in 18.52s with 0 errors`

### Backend FastAPI Test Suite:
- Tested camera endpoints: `GET /api/cameras` (Returned 24 cameras)
- Tested incident endpoints: `GET /api/incidents` (Returned 4 seed incidents)
- Tested AI Assistant query: `POST /api/assistant/query` (Sector B NLP matching succeeded)
- Tested demo intrusion: `POST /api/demo/trigger-intrusion` (Status: SUCCESS, Risk score: 100/100, 5 causal factors)

### Browser Subagent End-to-End Test:
- Successfully traversed all 9 views in headless Chromium
- Recorded complete demonstration session: [border_ai_demo.webp](file:///C:/Users/Atharva%20Nevase/.gemini/antigravity-ide/brain/a7b05c02-5465-4d22-a83d-630b0c06223c/border_ai_demo_1788843147543.webp)

---

## 4. How to Run Locally

### Method 1: One-Click Launcher (Windows)
Double-click `start_demo.bat` in `SIH2K26/`.

### Method 2: Manual Start
- **Backend**:
  ```bash
  cd backend
  python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
- Open your browser at `http://127.0.0.1:5173/`
