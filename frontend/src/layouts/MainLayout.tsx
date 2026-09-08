import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { PipelineVisualizer } from '../components/layout/PipelineVisualizer';
import { AlertToast } from '../components/alerts/AlertToast';
import { IncidentDetailModal } from '../components/incidents/IncidentDetailModal';
import { JudgeDemoModal } from '../components/demo/JudgeDemoModal';
import { Camera, Incident, Alert, Zone } from '../types';
import { api } from '../services/api';
import { soundManager } from '../services/soundManager';

interface MainLayoutProps {
  cameras: Camera[];
  incidents: Incident[];
  alerts: Alert[];
  zones: Zone[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident | null) => void;
  onAcknowledgeAlert: (id: number) => void;
  onTriggerIntrusion: () => void;
  onSaveZone: (zone: Zone) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  cameras,
  incidents,
  alerts,
  zones,
  selectedIncident,
  onSelectIncident,
  onAcknowledgeAlert,
  onTriggerIntrusion,
  onSaveZone
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeToastAlert, setActiveToastAlert] = useState<Alert | null>(null);

  const activeAlertCount = alerts.filter((a) => !a.acknowledged).length;
  const hasCriticalAlert = alerts.some((a) => !a.acknowledged && a.severity === 'CRITICAL');

  // Listen to new alerts for toast display
  useEffect(() => {
    const unackCritical = alerts.find((a) => !a.acknowledged && a.severity === 'CRITICAL');
    if (unackCritical) {
      setActiveToastAlert(unackCritical);
    }
  }, [alerts]);

  const handleOpenAssistantWithPrompt = (prompt?: string) => {
    navigate('/assistant', { state: { initialPrompt: prompt } });
  };

  return (
    <div className="flex h-screen bg-[#070A0F] text-slate-100 overflow-hidden font-sans">
      {/* Permanent Tactical Sidebar (Section 3) */}
      <Sidebar activeAlertCount={activeAlertCount} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar (Section 3) */}
        <Topbar
          hasCriticalAlert={hasCriticalAlert}
          activeCamerasCount={cameras.filter((c) => c.status === 'ONLINE').length}
          totalCamerasCount={cameras.length}
          onOpenDemo={() => setDemoModalOpen(true)}
          onTriggerIntrusion={onTriggerIntrusion}
          onOpenNotifications={() => navigate('/alerts')}
          unreadAlertCount={activeAlertCount}
        />

        {/* SIH Architecture Flow Visualization (Section 27) */}
        <PipelineVisualizer />

        {/* Dynamic Route Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-[#070A0F] relative bg-tactical-grid">
          <Outlet />
        </main>
      </div>

      {/* Real-time Alert Toast Notification */}
      {activeToastAlert && (
        <AlertToast
          alert={activeToastAlert}
          onAcknowledge={(id) => {
            onAcknowledgeAlert(id);
            setActiveToastAlert(null);
          }}
          onViewIncident={() => {
            const inc = incidents.find((i) => i.id === activeToastAlert.incident_id) || incidents[0];
            onSelectIncident(inc);
            setActiveToastAlert(null);
          }}
          onOpenAssistant={() => {
            setActiveToastAlert(null);
            handleOpenAssistantWithPrompt('Show suspicious activity in Sector B');
          }}
          onClose={() => setActiveToastAlert(null)}
        />
      )}

      {/* Global Incident Detail Dossier Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => onSelectIncident(null)}
          onOpenAssistantWithIncident={(code) => {
            handleOpenAssistantWithPrompt(`What happened in incident ${code}?`);
          }}
        />
      )}

      {/* 12-Step Judge Presentation Demo Modal */}
      <JudgeDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onNavigateToAssistant={(prompt) => handleOpenAssistantWithPrompt(prompt)}
        onNavigateToSurveillance={() => navigate('/surveillance')}
      />
    </div>
  );
};
