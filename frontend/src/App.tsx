import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SurveillancePage } from './pages/SurveillancePage';
import { AlertsPage } from './pages/AlertsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage';
import { BorderMapPage } from './pages/BorderMapPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SystemStatusPage } from './pages/SystemStatusPage';
import { MainLayout } from './layouts/MainLayout';
import { api } from './services/api';
import { Camera, Incident, Alert, EvidenceRecord, Zone, SystemStatus } from './types';
import { soundManager } from './services/soundManager';

// Wrapper to extract location state for AIAssistantPage
const AIAssistantWrapper: React.FC<{ onSelectIncident: (inc: Incident) => void }> = ({ onSelectIncident }) => {
  const location = useLocation();
  const initialPrompt = (location.state as any)?.initialPrompt;
  return <AIAssistantPage onSelectIncident={onSelectIncident} initialPrompt={initialPrompt} />;
};

export function App() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cctv_network: 'ONLINE',
    video_ingestion: 'ONLINE',
    object_detection: 'ONLINE',
    tracking_engine: 'ONLINE',
    threat_engine: 'ONLINE',
    evidence_storage: 'ONLINE',
    alert_service: 'ONLINE',
    ai_assistant: 'ONLINE',
    total_cameras: 24,
    active_cameras: 22,
    warning_cameras: 2,
    offline_cameras: 0,
    uptime: '99.98%',
    timestamp: new Date().toISOString()
  });

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Initial Data Fetch
  const loadData = async () => {
    try {
      const [cams, incs, alts, evs, zns, sys] = await Promise.all([
        api.getCameras(),
        api.getIncidents(),
        api.getAlerts(),
        api.getEvidence(),
        api.getZones(),
        api.getSystemStatus()
      ]);
      setCameras(cams);
      setIncidents(incs);
      setAlerts(alts);
      setEvidenceList(evs);
      setZones(zns);
      setSystemStatus(sys);
    } catch {
      // Handled internally in api.ts
    }
  };

  useEffect(() => {
    loadData();
    // Poll telemetry every 12 seconds to keep in sync with backend
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Trigger Intrusion simulation
  const handleTriggerIntrusion = async () => {
    soundManager.playCriticalAlert();
    try {
      await api.triggerDemoIntrusion('C-07');
      await loadData();
    } catch {
      // Local fallback
    }
  };

  // Acknowledge Alert
  const handleAcknowledgeAlert = async (id: number) => {
    soundManager.playAcknowledgeChime();
    await api.acknowledgeAlert(id);
    await loadData();
  };

  // Save new polygon zone
  const handleSaveZone = async (newZone: Zone) => {
    await api.saveZone(newZone);
    await loadData();
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Defense Clearance Landing Screen */}
        <Route path="/" element={<LandingPage />} />

        {/* Command Center Operations Shell */}
        <Route
          element={
            <MainLayout
              cameras={cameras}
              incidents={incidents}
              alerts={alerts}
              zones={zones}
              selectedIncident={selectedIncident}
              onSelectIncident={setSelectedIncident}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onTriggerIntrusion={handleTriggerIntrusion}
              onSaveZone={handleSaveZone}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                cameras={cameras}
                incidents={incidents}
                alerts={alerts}
                onSelectIncident={setSelectedIncident}
                onOpenDemo={handleTriggerIntrusion}
              />
            }
          />
          <Route
            path="/surveillance"
            element={
              <SurveillancePage
                cameras={cameras}
                zones={zones}
                onSaveZone={handleSaveZone}
              />
            }
          />
          <Route
            path="/alerts"
            element={
              <AlertsPage
                alerts={alerts}
                incidents={incidents}
                onAcknowledge={handleAcknowledgeAlert}
                onViewIncident={setSelectedIncident}
                onOpenAssistantWithIncident={(code) => {
                  window.location.href = `/assistant`;
                }}
              />
            }
          />
          <Route
            path="/incidents"
            element={
              <IncidentsPage
                incidents={incidents}
                onSelectIncident={setSelectedIncident}
              />
            }
          />
          <Route
            path="/evidence"
            element={
              <EvidenceVaultPage
                evidenceList={evidenceList}
                incidents={incidents}
                onSelectIncident={setSelectedIncident}
              />
            }
          />
          <Route
            path="/map"
            element={
              <BorderMapPage
                cameras={cameras}
                incidents={incidents}
                onSelectIncident={setSelectedIncident}
              />
            }
          />
          <Route
            path="/assistant"
            element={<AIAssistantWrapper onSelectIncident={setSelectedIncident} />}
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="/system"
            element={
              <SystemStatusPage
                cameras={cameras}
                systemStatus={systemStatus}
              />
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
