import React from 'react';
import { Camera, SystemStatus } from '../types';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Video,
  Database,
  Radio,
  Clock,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface SystemStatusPageProps {
  cameras: Camera[];
  systemStatus: SystemStatus;
}

export const SystemStatusPage: React.FC<SystemStatusPageProps> = ({
  cameras,
  systemStatus
}) => {
  const subsystems = [
    { name: 'CCTV Network Ingestion', status: systemStatus.cctv_network, icon: Video, latency: '42ms' },
    { name: 'Video Ingestion Layer', status: systemStatus.video_ingestion, icon: Activity, latency: '12ms' },
    { name: 'AI Object Detection (YOLO)', status: systemStatus.object_detection, icon: Cpu, latency: '28ms' },
    { name: 'Multi-Object Tracking', status: systemStatus.tracking_engine, icon: Radio, latency: '6ms' },
    { name: 'Border Threat Engine', status: systemStatus.threat_engine, icon: ShieldCheck, latency: '4ms' },
    { name: 'Evidence Vault Storage', status: systemStatus.evidence_storage, icon: Database, latency: '18ms' },
    { name: 'Alert Notification Service', status: systemStatus.alert_service, icon: AlertTriangle, latency: '5ms' },
    { name: 'AI Investigation Assistant', status: systemStatus.ai_assistant, icon: Server, latency: '64ms' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wide text-slate-100">
              System Health &amp; Subsystem Telemetry
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              ● 99.98% UPTIME
            </span>
          </div>
          <p className="text-slate-400 mt-0.5 text-[11px]">
            Real-time diagnostics across all 8 pipeline layers and 24 border CCTV cameras
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0B0F17] px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400 font-semibold">
            STATUS: ALL CORE SERVICES HEALTHY
          </div>
        </div>
      </div>

      {/* Subsystems Cards Grid (Section 16) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {subsystems.map((sub) => (
          <div
            key={sub.name}
            className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between text-slate-400">
              <sub.icon className="w-4 h-4 text-cyan-400" />
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                {sub.status}
              </span>
            </div>
            <div>
              <div className="font-semibold text-slate-200 text-[11px] leading-tight">{sub.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">Latency: {sub.latency}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Camera Health Table (Section 16) */}
      <div className="bg-[#0B0F17] rounded-xl border border-slate-800 overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-sm text-slate-200">
              CCTV Camera Sensor Health Matrix (24 Units)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            22 ONLINE • 2 WARNING • 0 OFFLINE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A0F] border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Camera</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">FPS</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4 text-right">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cameras.map((cam) => {
                const isWarn = cam.status === 'WARNING';

                return (
                  <tr
                    key={cam.camera_id}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      isWarn ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-100">
                      <span className="text-cyan-400">{cam.camera_id}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{cam.sector}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-xs font-sans">
                      {cam.location}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isWarn
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}
                      >
                        {cam.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-200">
                      {cam.fps.toFixed(1)} FPS
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className={isWarn ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {cam.latency_ms}ms
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{cam.resolution}</td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(cam.last_seen).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
