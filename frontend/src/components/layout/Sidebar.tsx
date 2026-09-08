import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Bell,
  AlertTriangle,
  FolderArchive,
  MapPin,
  Bot,
  BarChart3,
  Server,
  ShieldAlert,
  ChevronRight,
  Radio
} from 'lucide-react';

interface SidebarProps {
  activeAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeAlertCount }) => {
  const navItems = [
    { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Surveillance', path: '/surveillance', icon: Video },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: activeAlertCount },
    { name: 'Incidents', path: '/incidents', icon: ShieldAlert },
    { name: 'Evidence Vault', path: '/evidence', icon: FolderArchive },
    { name: 'Border Map', path: '/map', icon: MapPin },
    { name: 'AI Assistant', path: '/assistant', icon: Bot, isAi: true },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'System Status', path: '/system', icon: Server },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-slate-800/90 flex flex-col h-screen select-none shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center border border-cyan-500/40 shadow-lg shadow-cyan-950/40">
            <ShieldAlert className="w-6 h-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-mono font-bold text-lg tracking-wider text-slate-100">
                BORDER <span className="text-cyan-400">AI</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide">
              Intelligent Border Surveillance
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
          Tactical Operations
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium tracking-wide transition-all group ${
                isActive
                  ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-700/50 shadow-sm shadow-cyan-900/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-4 h-4 transition-colors ${item.isAi ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                  {item.badge}
                </span>
              )}
              {item.isAi && (
                <span className="text-[9px] font-mono font-semibold text-cyan-400 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/50">
                  AI
                </span>
              )}
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
            </div>
          </NavLink>
        ))}
      </nav>

      {/* System Telemetry Footer */}
      <div className="p-3.5 border-t border-slate-800/90 bg-[#070A0F]/60 text-[11px] font-mono space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider">AI ENGINE ONLINE</span>
          </div>
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <div className="flex items-center justify-between text-emerald-400/90">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="tracking-wider">CCTV NETWORK ONLINE</span>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-slate-400 border-t border-slate-800/60 text-[10px]">
          <span>GRID CAMERAS:</span>
          <span className="font-bold text-slate-300">24 CONNECTED</span>
        </div>
      </div>
    </aside>
  );
};
