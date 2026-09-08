import React, { useState, useEffect } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Play,
  Crosshair,
  User,
  Shield,
  Activity,
  AlertOctagon
} from 'lucide-react';
import { soundManager } from '../../services/soundManager';

interface TopbarProps {
  hasCriticalAlert?: boolean;
  activeCamerasCount?: number;
  totalCamerasCount?: number;
  onOpenDemo: () => void;
  onTriggerIntrusion: () => void;
  onOpenNotifications: () => void;
  unreadAlertCount: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  hasCriticalAlert = false,
  activeCamerasCount = 22,
  totalCamerasCount = 24,
  onOpenDemo,
  onTriggerIntrusion,
  onOpenNotifications,
  unreadAlertCount
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const time = now.toTimeString().split(' ')[0];
      const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
      setCurrentTime(`${time} IST • ${date}`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="h-14 bg-[#0B0F17]/95 border-b border-slate-800/80 px-4 flex items-center justify-between z-20 backdrop-blur-md">
      {/* Left: Live Clock & System Status */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 bg-[#070A0F] px-2.5 py-1 rounded border border-slate-800 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{currentTime || '10:42:17 IST • 08 SEP 2026'}</span>
        </div>

        {/* System Health */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wider">DEFENSE GRID NOMINAL</span>
        </div>

        {/* Camera connection telemetry */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <span>CAMERAS:</span>
          <span className="text-cyan-400 font-bold">{activeCamerasCount}/{totalCamerasCount} ACTIVE</span>
        </div>

        {/* Critical Emergency Alert Indicator */}
        {hasCriticalAlert && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/80 border border-red-600/70 text-red-300 animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold tracking-wider">ACTIVE INTRUSION BREACH</span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Trigger Intrusion Button */}
        <button
          id="btn-trigger-intrusion"
          onClick={onTriggerIntrusion}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium text-amber-300 bg-amber-950/40 border border-amber-700/60 hover:bg-amber-900/60 transition-colors shadow-sm"
          title="Simulates single event intrusion immediately"
        >
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <span>TRIGGER TEST INTRUSION</span>
        </button>

        {/* START LIVE DEMO - High-visibility judge button */}
        <button
          id="btn-start-demo"
          onClick={onOpenDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-bold text-white bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 border border-red-400/50 shadow-lg shadow-red-900/40 hover:shadow-red-700/50 transition-all tracking-wider animate-pulse"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>START LIVE DEMO</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={soundEnabled ? 'Tactical Audio Alarms Enabled' : 'Tactical Audio Alarms Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 relative transition-colors"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold flex items-center justify-center border border-slate-900">
              {unreadAlertCount}
            </span>
          )}
        </button>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Officer Profile Badge */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-slate-200 leading-tight">Officer A. Nevase</div>
            <div className="text-[10px] font-mono text-cyan-400 tracking-wider">COMMANDER / SEC-OPS</div>
          </div>
        </div>
      </div>
    </header>
  );
};
