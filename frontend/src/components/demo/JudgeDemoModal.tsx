import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Bot,
  Video,
  Eye,
  ShieldAlert,
  FolderArchive,
  ArrowRight,
  X,
  RefreshCw
} from 'lucide-react';
import { soundManager } from '../../services/soundManager';
import { api } from '../../services/api';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAssistant: (prefillPrompt?: string) => void;
  onNavigateToSurveillance: () => void;
}

interface DemoStepState {
  num: number;
  title: string;
  detail: string;
  icon: any;
  status: 'pending' | 'active' | 'done';
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToAssistant,
  onNavigateToSurveillance
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [riskGauge, setRiskGauge] = useState<number>(0);
  const [demoCompleted, setDemoCompleted] = useState(false);

  const initialSteps: DemoStepState[] = [
    { num: 1, title: 'Normal CCTV Monitoring', detail: 'Optical feed active on Camera C-07 (Sector B). Grid baseline nominal.', icon: Video, status: 'pending' },
    { num: 2, title: 'Intruder Enters Frame', detail: 'Motion trigger detected at 82m range from secondary border fence.', icon: Eye, status: 'pending' },
    { num: 3, title: 'AI Object Detection', detail: 'YOLO model classifies target: PERSON (Confidence: 96.4%).', icon: CheckCircle2, status: 'pending' },
    { num: 4, title: 'Multi-Object Tracking Assigned', detail: 'Tracker assigns persistent Track ID #102 with vector heading NORTH-EAST.', icon: CheckCircle2, status: 'pending' },
    { num: 5, title: 'Approaching Monitored Zone', detail: 'Target breaches buffer boundary. Risk starts climbing (+10 base, +20 zone).', icon: AlertTriangle, status: 'pending' },
    { num: 6, title: 'Restricted Zone & Boundary Cross', detail: 'Polygon intersection confirmed with Sector B Tactical Exclusion Strip (+40, +50).', icon: ShieldAlert, status: 'pending' },
    { num: 7, title: 'Threat Engine Evaluation', detail: 'Multi-factor causal risk calculation executes in 4ms.', icon: Flame, status: 'pending' },
    { num: 8, title: 'Risk Score Escalates to 87/100', detail: 'Threat level classified as CRITICAL. Immediate alert threshold exceeded.', icon: Flame, status: 'pending' },
    { num: 9, title: 'Audible Red Alert Dispatched', detail: 'Command Center alert dispatched to all consoles with audio alarm pulse.', icon: AlertTriangle, status: 'pending' },
    { num: 10, title: 'Forensic Evidence Captured', detail: 'High-res annotated snapshot incident_0042.jpg & 10s video clip stored.', icon: FolderArchive, status: 'pending' },
    { num: 11, title: 'Incident Timeline Compiled', detail: 'Audit record INC-2026-09-08-0042 written to forensic vault database.', icon: CheckCircle2, status: 'pending' },
    { num: 12, title: 'AI Assistant Primed', detail: 'Investigation engine ready to answer natural language questions for Sector B.', icon: Bot, status: 'pending' }
  ];

  const [steps, setSteps] = useState<DemoStepState[]>(initialSteps);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setCurrentStepIndex(-1);
      setRiskGauge(0);
      setDemoCompleted(false);
      setSteps(initialSteps);
    }
  }, [isOpen]);

  const runLiveDemo = async () => {
    setIsRunning(true);
    setDemoCompleted(false);
    setRiskGauge(10);
    soundManager.playRadarPing();

    for (let i = 0; i < initialSteps.length; i++) {
      setCurrentStepIndex(i);
      setSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? 'done' : idx === i ? 'active' : 'pending'
        }))
      );

      // Sound & risk score progression
      if (i === 4) setRiskGauge(30);
      if (i === 6) setRiskGauge(65);
      if (i === 7) {
        setRiskGauge(87);
        soundManager.playCriticalAlert();
      }
      if (i === 9) {
        soundManager.playRadarPing();
      }

      // Small pacing delay for visual clarity for judges
      await new Promise((r) => setTimeout(r, 650));
    }

    // Trigger backend demo state sync
    try {
      await api.triggerDemoIntrusion('C-07');
    } catch {}

    setSteps((prev) => prev.map((s) => ({ ...s, status: 'done' })));
    setIsRunning(false);
    setDemoCompleted(true);
    soundManager.playAcknowledgeChime();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0B0F17] border border-cyan-500/40 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0E1522] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white border border-red-400/50 shadow-lg shadow-red-950/50">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold text-slate-100">
                  SIH26187 LIVE DEMONSTRATION CONTROLLER
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-semibold">
                  12-STEP SCENARIO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end automated sequence: CCTV Ingestion → AI Detection → Threat Scoring → Incident → Evidence → AI Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Gauges & Controls Bar */}
        <div className="px-6 py-3 bg-[#070A0F] border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={runLiveDemo}
              disabled={isRunning}
              className="px-4 py-2 rounded text-xs font-mono font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:opacity-50 border border-red-400/40 shadow-md flex items-center gap-2 transition-all tracking-wider"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>EXECUTING SIMULATION...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>START 12-STEP LIVE DEMO</span>
                </>
              )}
            </button>

            <button
              onClick={onNavigateToSurveillance}
              className="px-3 py-1.5 rounded text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>WATCH CAMERA C-07 FEED</span>
            </button>
          </div>

          {/* Real-time Threat Engine Risk Gauge */}
          <div className="flex items-center gap-3 bg-[#0E1522] px-3.5 py-1.5 rounded border border-slate-800 font-mono">
            <span className="text-[11px] text-slate-400">SIMULATED THREAT GAUGE:</span>
            <div className="w-32 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  riskGauge > 80 ? 'bg-red-500' : riskGauge > 50 ? 'bg-orange-500' : riskGauge > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${riskGauge}%` }}
              />
            </div>
            <span
              className={`text-xs font-bold ${
                riskGauge > 80 ? 'text-red-400' : riskGauge > 50 ? 'text-orange-400' : 'text-emerald-400'
              }`}
            >
              {riskGauge}/100
            </span>
          </div>
        </div>

        {/* 12-Step Visual Flow Grid */}
        <div className="p-6 overflow-y-auto space-y-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono text-xs">
            {steps.map((step) => {
              const isActive = step.status === 'active';
              const isDone = step.status === 'done';

              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                      : isDone
                      ? 'bg-[#0E1522] border-slate-800 text-slate-200'
                      : 'bg-[#070A0F]/60 border-slate-850 text-slate-500 opacity-60'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center shrink-0 font-bold text-xs ${
                      isActive
                        ? 'bg-cyan-500 text-black animate-pulse'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isActive ? 'text-cyan-300' : isDone ? 'text-slate-100' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      {isActive && (
                        <span className="text-[10px] text-cyan-400 animate-pulse font-bold">
                          RUNNING
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion Celebration & Direct AI Interrogation CTA */}
          {demoCompleted && (
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/50 flex items-center justify-between flex-wrap gap-3 animate-in fade-in">
              <div>
                <div className="font-mono font-bold text-sm text-cyan-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>DEMONSTRATION COMPLETED • INCIDENT INC-2026-09-08-0042 READY</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  The judge can now ask the AI Assistant natural-language questions about this Sector B breach!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAssistant('Show suspicious activity in Sector B');
                  }}
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-900/40 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>ASK AI: &quot;SHOW SUSPICIOUS ACTIVITY IN SECTOR B&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0E1420] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Current Target: <strong className="text-slate-200">Camera C-07 (Sector B)</strong> • Threat Level: <strong className="text-red-400">CRITICAL (87/100)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            CLOSE CONTROLLER
          </button>
        </div>
      </div>
    </div>
  );
};
