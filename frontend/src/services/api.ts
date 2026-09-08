import { Camera, Incident, Alert, EvidenceRecord, Zone, SystemStatus, ThreatSeverity } from '../types';
import { INITIAL_CAMERAS, INITIAL_INCIDENTS, INITIAL_ALERTS, INITIAL_EVIDENCE, INITIAL_ZONES, SYSTEM_STATUS_DATA } from './mockData';

const BACKEND_URL = '';

// In-Memory Fallback State (persists during frontend session)
let camerasStore: Camera[] = [...INITIAL_CAMERAS];
let incidentsStore: Incident[] = [...INITIAL_INCIDENTS];
let alertsStore: Alert[] = [...INITIAL_ALERTS];
let evidenceStore: EvidenceRecord[] = [...INITIAL_EVIDENCE];
let zonesStore: Zone[] = [...INITIAL_ZONES];

export const api = {
  // 1. Cameras
  async getCameras(): Promise<Camera[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/cameras`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Backend not running, use store
    }
    return camerasStore;
  },

  async getCamera(id: string): Promise<Camera | undefined> {
    const cams = await this.getCameras();
    return cams.find(c => c.camera_id.toLowerCase() === id.toLowerCase() || String(c.id) === id);
  },

  // 2. Incidents
  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/incidents`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    return incidentsStore;
  },

  async getIncident(id: string): Promise<Incident | undefined> {
    const list = await this.getIncidents();
    return list.find(inc => inc.incident_code.toLowerCase() === id.toLowerCase() || String(inc.id) === id);
  },

  // 3. Alerts
  async getAlerts(): Promise<Alert[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/alerts`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    return alertsStore;
  },

  async acknowledgeAlert(alertId: number, officer: string = 'OFFICER-7492'): Promise<Alert | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/alerts/${alertId}/acknowledge?officer=${encodeURIComponent(officer)}`, {
        method: 'POST',
        signal: AbortSignal.timeout(1500)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    
    // In-memory update
    const idx = alertsStore.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      alertsStore[idx] = {
        ...alertsStore[idx],
        acknowledged: true,
        acknowledged_by: officer,
        acknowledged_at: new Date().toISOString()
      };
      return alertsStore[idx];
    }
    return null;
  },

  // 4. Evidence
  async getEvidence(): Promise<EvidenceRecord[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/evidence`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    return evidenceStore;
  },

  async capturePhoneSnapshot(payload?: {
    stream_url?: string;
    incident_id?: number;
    camera_id?: string;
    object_type?: string;
    track_id?: string;
    confidence?: number;
    metadata?: Record<string, any>;
  }): Promise<EvidenceRecord | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/evidence/snapshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {})
      });
      if (res.ok) {
        const data = await res.json();
        evidenceStore = [data, ...evidenceStore];
        return data;
      }
    } catch {}
    return null;
  },

  // 5. Zones
  async getZones(cameraId?: string): Promise<Zone[]> {
    try {
      const url = cameraId ? `${BACKEND_URL}/api/zones?camera_id=${cameraId}` : `${BACKEND_URL}/api/zones`;
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map(z => ({
            ...z,
            polygon_coordinates: typeof z.polygon_coordinates === 'string' ? JSON.parse(z.polygon_coordinates) : z.polygon_coordinates
          }));
        }
      }
    } catch {}
    if (cameraId) {
      return zonesStore.filter(z => z.camera_id === cameraId);
    }
    return zonesStore;
  },

  async saveZone(zone: Zone): Promise<Zone> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/zones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camera_id: zone.camera_id,
          name: zone.name,
          zone_type: zone.zone_type,
          polygon_coordinates: JSON.stringify(zone.polygon_coordinates),
          color: zone.color
        }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        const data = await res.json();
        return {
          ...data,
          polygon_coordinates: JSON.parse(data.polygon_coordinates)
        };
      }
    } catch {}
    const newZone = { ...zone, id: zonesStore.length + 1 };
    zonesStore.push(newZone);
    return newZone;
  },

  // 6. System Status
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/system-status`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {}
    return SYSTEM_STATUS_DATA;
  },

  // 7. Trigger Live Intrusion Demo
  async triggerDemoIntrusion(cameraId: string = 'C-07'): Promise<any> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/demo/trigger-intrusion?camera_id=${cameraId}`, {
        method: 'POST',
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {}

    // In-memory simulation
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const code = `INC-2026-09-08-00${Math.floor(Math.random() * 50) + 43}`;

    const newInc: Incident = {
      id: incidentsStore.length + 1,
      incident_code: code,
      camera_id: cameraId,
      sector: 'Sector B',
      incident_type: 'Restricted Zone Intrusion',
      severity: 'CRITICAL',
      risk_score: 87,
      timestamp: now.toISOString(),
      status: 'OPEN',
      description: `Tactical breach: Target Track #102 crossed Restricted Polygon Alpha at ${timeStr} heading towards border zero line.`,
      threat_factors: [
        'Person detected in surveillance grid (+10)',
        'Restricted zone intrusion breach (+40)',
        'Critical national border boundary crossed (+50)',
        'Tactical evasive movement vector (+25)'
      ],
      timeline_events: [
        { time: timeStr, event: 'Person detected', desc: 'AI Object Detector identified target as PERSON (96.4% confidence).' },
        { time: timeStr, event: 'Track ID assigned', desc: 'Multi-Object Tracker locked Track #102.' },
        { time: timeStr, event: 'Approached restricted zone', desc: 'Target moved inside Monitored Buffer.' },
        { time: timeStr, event: 'Boundary crossed', desc: 'Polygon intersection confirmed with Restricted Zone.' },
        { time: timeStr, event: 'Risk calculated (87/100)', desc: 'Threat Engine scored causal factors: Threat CRITICAL.' },
        { time: timeStr, event: 'Critical Alert dispatched', desc: 'Red alert broadcasted to command console.' },
        { time: timeStr, event: 'Forensic evidence archived', desc: 'Annotated snapshot and video buffer stored.' }
      ]
    };

    incidentsStore.unshift(newInc);

    const newAlert: Alert = {
      id: alertsStore.length + 1,
      incident_id: newInc.id,
      severity: 'CRITICAL',
      message: `CRITICAL ALERT: Restricted Zone Intrusion at Camera ${cameraId} (Sector B) - Risk 87/100`,
      created_at: now.toISOString(),
      acknowledged: false
    };
    alertsStore.unshift(newAlert);

    const newEv: EvidenceRecord = {
      id: evidenceStore.length + 1,
      incident_id: newInc.id,
      snapshot_path: 'incident_0042.jpg',
      video_path: 'incident_0042.mp4',
      timestamp: now.toISOString(),
      object_type: 'PERSON',
      track_id: '#102',
      confidence: 0.964,
      metadata_json: JSON.stringify({
        camera: cameraId,
        sector: 'Sector B',
        risk: 87,
        resolution: '1080p FHD'
      })
    };
    evidenceStore.unshift(newEv);

    return {
      status: 'SUCCESS',
      incident_code: code,
      camera_id: cameraId,
      sector: 'Sector B',
      track_id: '#102',
      risk_score: 87,
      severity: 'CRITICAL' as ThreatSeverity,
      alert_id: newAlert.id
    };
  },

  // 8. AI Investigation Assistant Natural Language Query
  async queryAssistant(query: string): Promise<{
    answer: string;
    matched_incidents: Incident[];
    suggestions: string[];
    query_intent: Record<string, any>;
  }> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/assistant/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) return await res.json();
    } catch {}

    // Robust client-side fallback query parser
    const q = query.toLowerCase().trim();
    let matched: Incident[] = [];
    let answer = '';
    const suggestions = [
      'Show suspicious activity in Sector B',
      'What happened at Camera C-07?',
      'Show all critical incidents today',
      'Was there any boundary crossing in the last hour?',
      'Show incidents involving vehicles',
      'Which camera has the highest number of alerts?'
    ];

    if (q.includes('c-07') || q.includes('camera 7') || q.includes('camera c-07')) {
      matched = incidentsStore.filter(i => i.camera_id === 'C-07');
      answer = `Surveillance query for Camera C-07: Found ${matched.length} registered incident(s). Latest incident is ${matched[0]?.incident_code} (Risk ${matched[0]?.risk_score}/100, ${matched[0]?.severity}) with restricted zone intrusion.`;
    } else if (q.includes('sector b')) {
      matched = incidentsStore.filter(i => i.sector.toLowerCase().includes('sector b'));
      answer = `Perimeter Sector B Report: Located ${matched.length} suspicious incident(s) in Sector B requiring command attention.`;
    } else if (q.includes('sector a')) {
      matched = incidentsStore.filter(i => i.sector.toLowerCase().includes('sector a'));
      answer = `Sector A Report: Retrieved ${matched.length} incident(s) including Abandoned Object in culvert sector.`;
    } else if (q.includes('critical') || q.includes('urgent') || q.includes('highest risk')) {
      matched = incidentsStore.filter(i => i.severity === 'CRITICAL');
      answer = `Priority Security Escalation: ${matched.length} CRITICAL threat incidents currently logged on the border perimeter.`;
    } else if (q.includes('boundary') || q.includes('crossing') || q.includes('breach')) {
      matched = incidentsStore.filter(i => 
        i.incident_type.toLowerCase().includes('boundary') || 
        i.incident_type.toLowerCase().includes('intrusion') ||
        i.threat_factors.some(f => f.toLowerCase().includes('boundary'))
      );
      answer = `Border Boundary Analysis: Identified ${matched.length} intrusion breach incident(s) crossing sensor lines.`;
    } else if (q.includes('vehicle') || q.includes('truck') || q.includes('car')) {
      matched = incidentsStore.filter(i => 
        i.incident_type.toLowerCase().includes('vehicle') || 
        i.description.toLowerCase().includes('vehicle')
      );
      answer = `Vehicle Tracking Intelligence: Found ${matched.length} incident(s) involving vehicular targets near the border line.`;
    } else if (q.includes('highest number of alerts') || q.includes('most alerts')) {
      matched = incidentsStore.filter(i => i.camera_id === 'C-07');
      answer = `Perimeter Sensor Telemetry: Camera C-07 (Sector B) generated the highest number of alerts today (12 alerts, 87/100 maximum risk score).`;
    } else if (q.includes('10:42')) {
      matched = incidentsStore.filter(i => i.incident_code.includes('0042'));
      answer = `Found Critical Incident INC-2026-09-08-0042 recorded at 10:42:17 at Camera C-07 (Sector B) with risk score 87/100.`;
    } else {
      matched = incidentsStore.slice(0, 3);
      answer = `BORDER AI intelligence engine parsed query. Displaying ${matched.length} most relevant surveillance records:`;
    }

    return {
      answer,
      matched_incidents: matched,
      suggestions,
      query_intent: { query }
    };
  }
};
