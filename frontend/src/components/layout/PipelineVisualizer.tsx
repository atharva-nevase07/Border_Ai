import React, { useState } from 'react';
import {
  Camera,
  Cpu,
  Route,
  ShieldAlert,
  Flame,
  BellRing,
  FolderArchive,
  Bot,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const PipelineVisualizer: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    { label: 'Existing CCTV', sub: '24 Cam Feeds', icon: Camera, color: 'text-slate-300' },
    { label: 'AI Detection', sub: 'YOLOv11 Models', icon: Cpu, color: 'text-cyan-400' },
    { label: 'Tracking', sub: 'Multi-Object Vectors', icon: Route, color: 'text-blue-400' },
    { label: 'Border Intel', sub: 'Polygonal Zones', icon: ShieldAlert, color: 'text-amber-400' },
    { label: 'Threat Engine', sub: 'Risk Score 0-100', icon: Flame, color: 'text-orange-400' },
    { label: 'Alert System', sub: 'Real-Time Dispatches', icon: BellRing, color: 'text-red-400' },
    { label: 'Evidence Vault', sub: 'Forensic Proofs', icon: FolderArchive, color: 'text-purple-400' },
    { label: 'AI Assistant', sub: 'Incident Discovery', icon: Bot, color: 'text-emerald-400' },
  ];

  return (
    <div className="bg-[#090D14] border-b border-slate-800/80 px-4 py-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            SIH26187 Architecture Flow:
          </span>
          <span className="text-[11px] text-slate-300 font-medium">
            AI-Based Video Analytics Pipeline for Existing CCTV Infrastructure
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono text-[10px]"
        >
          {collapsed ? 'EXPAND FLOW' : 'COLLAPSE'}
          {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between overflow-x-auto gap-2 pb-1">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex items-center gap-2 bg-[#0E1522] px-3 py-1.5 rounded border border-slate-800 shrink-0 hover:border-slate-700 transition-colors">
                <step.icon className={`w-3.5 h-3.5 ${step.color}`} />
                <div>
                  <div className="font-mono font-semibold text-[11px] text-slate-200 leading-none">
                    {step.label}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                    {step.sub}
                  </div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="text-slate-600 font-mono text-xs select-none shrink-0">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
