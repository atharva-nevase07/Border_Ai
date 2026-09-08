import React from 'react';
import { Incident } from '../../types';
import { ThreatBadge } from '../common/ThreatBadge';
import {
  X,
  Camera as CameraIcon,
  MapPin,
  Clock,
  ShieldAlert,
  Flame,
  CheckCircle2,
  FileText,
  Video,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onStatusChange?: (id: number, status: Incident['status']) => void;
  onOpenAssistantWithIncident?: (code: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onStatusChange,
  onOpenAssistantWithIncident
}) => {
  if (!incident) return null;

  const timeStr = new Date(incident.timestamp).toLocaleTimeString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0B0F17] border border-slate-700/80 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0E1420]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold text-slate-100">
                  {incident.incident_code}
                </h2>
                <ThreatBadge severity={incident.severity} score={incident.risk_score} showScore />
              </div>
              <p className="text-xs text-slate-400">
                {incident.incident_type} • Recorded at {timeStr}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Top Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#070A0F] p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1">
                <CameraIcon className="w-3.5 h-3.5 text-cyan-400" /> CAMERA
              </div>
              <div className="text-slate-200 font-bold">{incident.camera_id}</div>
            </div>

            <div className="bg-[#070A0F] p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> SECTOR
              </div>
              <div className="text-slate-200 font-bold">{incident.sector}</div>
            </div>

            <div className="bg-[#070A0F] p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-red-400" /> RISK SCORE
              </div>
              <div className="text-red-400 font-bold text-sm">
                {incident.risk_score} <span className="text-slate-500 text-[10px]">/ 100</span>
              </div>
            </div>

            <div className="bg-[#070A0F] p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> STATUS
              </div>
              <div className="text-emerald-400 font-bold">{incident.status}</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#070A0F] p-4 rounded-lg border border-slate-800">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
              Incident Situation Report
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Threat Engine Causal Factors (Section 9) */}
          <div className="bg-[#070A0F] p-4 rounded-lg border border-slate-800">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Threat Engine Risk Calculation Factors (Why Score was Generated)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {incident.threat_factors && incident.threat_factors.length > 0 ? (
                incident.threat_factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-red-950/20 border border-red-900/40 px-3 py-2 rounded text-red-300 font-mono text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 font-mono text-xs">Standard perimeter baseline factors applied.</div>
              )}
            </div>
          </div>

          {/* Incident Timeline (Section 12) */}
          <div className="bg-[#070A0F] p-4 rounded-lg border border-slate-800">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chronological Incident Audit Timeline</span>
            </div>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {incident.timeline_events && incident.timeline_events.length > 0 ? (
                incident.timeline_events.map((evt, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-[#0B0F17] group-hover:scale-125 transition-transform" />
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-cyan-400 text-[11px]">{evt.time}</span>
                      <span className="font-semibold text-slate-200 text-xs">{evt.event}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{evt.desc}</p>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 font-mono">No timeline events recorded.</div>
              )}
            </div>
          </div>

          {/* Forensic Evidence Preview (Section 11) */}
          <div className="bg-[#070A0F] p-4 rounded-lg border border-slate-800">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Forensic Evidence Package</span>
              </span>
              <span className="text-[10px] text-slate-500">SHA256: 8F4A1C...E945C22</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-slate-200 font-semibold text-xs">Annotated Snapshot</div>
                    <div className="text-[10px] text-slate-400">1920x1080 JPEG • YOLO Bounding Box</div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-slate-800 text-cyan-300 font-mono text-[10px] font-medium">
                  ARCHIVED
                </span>
              </div>

              <div className="bg-[#0B0F17] p-3 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-slate-200 font-semibold text-xs">Forensic Video Loop</div>
                    <div className="text-[10px] text-slate-400">10s H.264 MP4 Buffer</div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-slate-800 text-purple-300 font-mono text-[10px] font-medium">
                  READY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0E1420] flex items-center justify-between flex-wrap gap-2">
          {/* Status changer */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-400">UPDATE STATUS:</span>
            {(['INVESTIGATING', 'RESOLVED', 'ESCALATED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => onStatusChange && onStatusChange(incident.id, st)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
                  incident.status === st
                    ? 'bg-cyan-600 text-white border-cyan-500'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onOpenAssistantWithIncident && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAssistantWithIncident(incident.incident_code);
                }}
                className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>INTERROGATE VIA AI ASSISTANT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
