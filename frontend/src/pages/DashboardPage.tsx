import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Incident, Alert } from '../types';
import { ThreatBadge } from '../components/common/ThreatBadge';
import {
  Camera as CameraIcon,
  Activity,
  AlertTriangle,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Cpu,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Radio,
  Eye,
  Bot
} from 'lucide-react';

interface DashboardPageProps {
  cameras: Camera[];
  incidents: Incident[];
  alerts: Alert[];
  onSelectIncident: (incident: Incident) => void;
  onOpenDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  cameras,
  incidents,
  alerts,
  onSelectIncident,
  onOpenDemo
}) => {
  const navigate = useNavigate();

  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const activeCamerasCount = cameras.filter((c) => c.status === 'ONLINE').length;

  const recentActivities = [
    { time: '10:42:17', event: 'Person entered restricted zone', camera: 'Camera C-07', sector: 'Sector B', type: 'breach' },
    { time: '10:31:42', event: 'Vehicle detected near boundary', camera: 'Camera C-04', sector: 'Sector A', type: 'vehicle' },
    { time: '10:18:05', event: 'Unusual movement detected', camera: 'Camera C-11', sector: 'Sector B', type: 'movement' },
    { time: '09:54:31', event: 'Abandoned object detected', camera: 'Camera C-08', sector: 'Sector C', type: 'object' },
    { time: '09:20:14', event: 'Patrol unit check nominal', camera: 'Camera C-02', sector: 'Sector A', type: 'normal' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono tracking-wide text-slate-100">
              Border Intelligence Command Center
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time AI-powered monitoring of existing CCTV infrastructure • SIH26187 Platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/surveillance')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>LIVE CAMERAS ({activeCamerasCount}/{cameras.length})</span>
          </button>
          <button
            onClick={() => navigate('/assistant')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-mono text-xs flex items-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>INVESTIGATE VIA AI</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total Cameras</span>
            <CameraIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{cameras.length || 24}</div>
          <div className="text-[10px] text-slate-500 mt-1">Full Grid Coverage</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Active Cameras</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{activeCamerasCount}</div>
          <div className="text-[10px] text-emerald-500/80 mt-1">91.6% Operational</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>AI Processing</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 mt-1.5">ONLINE</div>
          <div className="text-[10px] text-cyan-500/80 mt-1">Latency: 28ms</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Active Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{activeAlertsCount || 3}</div>
          <div className="text-[10px] text-amber-500/80 mt-1">Requires Ack</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Critical Incidents</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-1">{criticalCount || 1}</div>
          <div className="text-[10px] text-red-400/80 mt-1">Immediate Action</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Objects Today</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-1">147</div>
          <div className="text-[10px] text-slate-500 mt-1">Persons &amp; Vehicles</div>
        </div>
      </div>

      {/* Live Threat Summary Bar (Section 4) */}
      <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-3 font-mono">
          <div className="text-xs font-bold text-slate-300 tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>LIVE THREAT LEVEL DISTRIBUTION</span>
          </div>
          <span className="text-[10px] text-slate-500">Total Analyzed Events: 147</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
          <div className="bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">NORMAL</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">108</div>
            <div className="text-[9px] text-slate-500">Risk 0–20</div>
          </div>

          <div className="bg-blue-950/20 border border-blue-800/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">LOW RISK</div>
            <div className="text-xl font-bold text-blue-300 mt-0.5">20</div>
            <div className="text-[9px] text-slate-500">Risk 21–40</div>
          </div>

          <div className="bg-amber-950/20 border border-amber-800/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">MEDIUM RISK</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">15</div>
            <div className="text-[9px] text-slate-500">Risk 41–60</div>
          </div>

          <div className="bg-orange-950/20 border border-orange-800/40 p-2.5 rounded-lg">
            <div className="text-[10px] text-orange-400 font-bold tracking-wider uppercase">HIGH RISK</div>
            <div className="text-xl font-bold text-orange-300 mt-0.5">3</div>
            <div className="text-[9px] text-slate-500">Risk 61–80</div>
          </div>

          <div className="bg-red-950/30 border border-red-700/60 p-2.5 rounded-lg col-span-2 sm:col-span-1 shadow-sm shadow-red-950/40">
            <div className="text-[10px] text-red-400 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span>CRITICAL</span>
            </div>
            <div className="text-xl font-bold text-red-400 mt-0.5">1</div>
            <div className="text-[9px] text-red-400/70 font-semibold">Risk 81–100</div>
          </div>
        </div>
      </div>

      {/* Main Split: Active Threats & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Threats Panel (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B0F17] rounded-xl border border-slate-800/80 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              <h2 className="font-mono text-sm font-bold text-slate-200">Active Threats</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Sorted by Risk Priority
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-x-auto">
            {incidents.slice(0, 5).map((inc) => (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className="p-4 hover:bg-slate-900/60 transition-colors cursor-pointer flex items-center justify-between gap-4 font-mono text-xs group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">
                      {inc.incident_code}
                    </span>
                    <ThreatBadge severity={inc.severity} />
                  </div>
                  <div className="text-slate-300 font-sans font-medium text-xs">
                    {inc.incident_type}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Camera: <strong className="text-slate-300">{inc.camera_id}</strong></span>
                    <span>•</span>
                    <span>Sector: <strong className="text-slate-300">{inc.sector}</strong></span>
                    <span>•</span>
                    <span>Time: <strong className="text-slate-300">{new Date(inc.timestamp).toLocaleTimeString()}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <div className="text-[10px] text-slate-400">RISK SCORE</div>
                    <div className={`text-base font-bold ${
                      inc.risk_score > 80 ? 'text-red-400' : inc.risk_score > 60 ? 'text-orange-400' : 'text-amber-400'
                    }`}>
                      {inc.risk_score} <span className="text-[10px] text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800/80 bg-[#070A0F] text-center">
            <button
              onClick={() => navigate('/incidents')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              VIEW ALL RECORDED INCIDENTS →
            </button>
          </div>
        </div>

        {/* Right Column: Recent Activity & AI Subsystems Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Subsystems Status Panel (Section 4) */}
          <div className="bg-[#0B0F17] rounded-xl border border-slate-800/80 p-4">
            <div className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AI SUBSYSTEMS STATUS</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                { name: 'OBJECT DETECTION', status: 'ONLINE', model: 'YOLOv11x' },
                { name: 'TRACKING ENGINE', status: 'ONLINE', model: 'ByteTrack Multi-Object' },
                { name: 'THREAT ENGINE', status: 'ONLINE', model: 'Heuristic Rule v2' },
                { name: 'ALERT SYSTEM', status: 'ONLINE', model: 'Real-time WebSocket' },
                { name: 'AI ASSISTANT', status: 'ONLINE', model: 'Semantic NLP Engine' }
              ].map((sys) => (
                <div key={sys.name} className="flex items-center justify-between p-2 rounded bg-[#070A0F] border border-slate-850">
                  <div>
                    <div className="text-slate-200 font-semibold text-[11px]">{sys.name}</div>
                    <div className="text-[9px] text-slate-500">{sys.model}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold">
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed (Section 4) */}
          <div className="bg-[#0B0F17] rounded-xl border border-slate-800/80 p-4">
            <div className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>RECENT PERIMETER ACTIVITY</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2.5 pb-2.5 border-b border-slate-850 last:border-0 last:pb-0">
                  <span className="text-[10px] text-cyan-400 font-bold mt-0.5">{act.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-xs font-sans leading-snug">{act.event}</p>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {act.camera} • {act.sector}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
