import React from 'react';
import { Alert, Incident } from '../../types';
import { AlertOctagon, X, ChevronRight, CheckCircle2, Bot } from 'lucide-react';
import { ThreatBadge } from '../common/ThreatBadge';

interface AlertToastProps {
  alert: Alert;
  onAcknowledge: (id: number) => void;
  onViewIncident: (alert: Alert) => void;
  onOpenAssistant: (incidentCode?: string) => void;
  onClose: () => void;
}

export const AlertToast: React.FC<AlertToastProps> = ({
  alert,
  onAcknowledge,
  onViewIncident,
  onOpenAssistant,
  onClose
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className="bg-[#0D121C] border border-red-500/70 rounded-lg p-4 shadow-2xl shadow-red-950/60 backdrop-blur-md relative overflow-hidden">
        {/* Subtle red pulsing top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-400 tracking-wider uppercase">
                  🚨 {alert.severity} INTRUSION ALERT
                </span>
                <ThreatBadge severity={alert.severity} />
              </div>
              <p className="text-xs text-slate-200 font-medium mt-0.5 leading-snug">
                {alert.message}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewIncident(alert)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 border border-slate-700 transition-colors"
            >
              <span>VIEW INCIDENT</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => onOpenAssistant()}
              className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 flex items-center gap-1 border border-cyan-700/60 transition-colors"
            >
              <Bot className="w-3 h-3 text-cyan-400" />
              <span>AI ASSISTANT</span>
            </button>
          </div>

          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 flex items-center gap-1 border border-emerald-700/50 transition-colors font-semibold"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ACK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
