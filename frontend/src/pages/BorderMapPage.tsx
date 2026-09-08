import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Incident } from '../types';
import { ThreatBadge } from '../components/common/ThreatBadge';
import {
  MapPin,
  Camera as CameraIcon,
  ShieldAlert,
  Flame,
  Radio,
  Eye,
  Crosshair,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface BorderMapPageProps {
  cameras: Camera[];
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export const BorderMapPage: React.FC<BorderMapPageProps> = ({
  cameras,
  incidents,
  onSelectIncident
}) => {
  const navigate = useNavigate();
  const [selectedCam, setSelectedCam] = useState<Camera | null>(cameras.find(c => c.camera_id === 'C-07') || cameras[0]);
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'RESTRICTED' | 'ACTIVE_BREACH'>('ALL');

  const getIncidentForCam = (camId: string): Incident | undefined => {
    return incidents.find((i) => i.camera_id === camId);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-mono font-bold tracking-wide text-slate-100">
              Tactical Border Geospatial Radar Map
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>RADAR SCAN ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial surveillance grid across national boundary line (Sectors A, B, C, D)
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveLayer('ALL')}
              className={`px-3 py-1 rounded transition-colors ${activeLayer === 'ALL' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60' : 'text-slate-400'}`}
            >
              ALL SENSORS
            </button>
            <button
              onClick={() => setActiveLayer('RESTRICTED')}
              className={`px-3 py-1 rounded transition-colors ${activeLayer === 'RESTRICTED' ? 'bg-amber-950 text-amber-300 font-bold border border-amber-700/60' : 'text-slate-400'}`}
            >
              RESTRICTED STRIP
            </button>
            <button
              onClick={() => setActiveLayer('ACTIVE_BREACH')}
              className={`px-3 py-1 rounded transition-colors ${activeLayer === 'ACTIVE_BREACH' ? 'bg-red-950 text-red-300 font-bold border border-red-700/60' : 'text-slate-400'}`}
            >
              ACTIVE BREACH ONLY
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Telemetry Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tactical Vector Border Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#070A0F] border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-between select-none">
          {/* Subtle Radar sweep effect */}
          <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-900/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-900/30 pointer-events-none" />

          {/* National Border Line (Dashed Red Line) */}
          <div className="absolute top-[42%] left-0 right-0 h-0.5 bg-red-600/70 border-b border-dashed border-red-400/90 z-0">
            <div className="absolute -top-3.5 left-6 text-[10px] font-mono font-bold text-red-400 bg-[#070A0F]/90 px-2 py-0.5 rounded border border-red-900">
              NATIONAL BORDER ZERO LINE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            </div>
          </div>

          {/* Sector Bounded Regions */}
          <div className="relative z-10 grid grid-cols-4 gap-4 h-full">
            {[
              { name: 'SECTOR A', label: 'Western Ridge Outpost', range: [1, 6], color: 'border-blue-900/40' },
              { name: 'SECTOR B', label: 'Northern Riverine Valley', range: [7, 12], color: 'border-red-900/50 bg-red-950/5' },
              { name: 'SECTOR C', label: 'Eastern Desert Flatlands', range: [13, 18], color: 'border-amber-900/40' },
              { name: 'SECTOR D', label: 'Southern Border Gate', range: [19, 24], color: 'border-emerald-900/40' }
            ].map((sector) => (
              <div
                key={sector.name}
                className={`border-r last:border-0 ${sector.color} pr-2 flex flex-col justify-between`}
              >
                <div>
                  <div className="font-mono font-bold text-xs text-slate-200 tracking-wider">
                    {sector.name}
                  </div>
                  <div className="font-mono text-[9px] text-slate-500">
                    {sector.label}
                  </div>
                </div>

                {/* Camera Nodes within Sector */}
                <div className="grid grid-cols-2 gap-2 my-8">
                  {cameras
                    .filter((c) => {
                      const num = parseInt(c.camera_id.replace('C-', ''));
                      return num >= sector.range[0] && num <= sector.range[1];
                    })
                    .map((cam) => {
                      const inc = getIncidentForCam(cam.camera_id);
                      const isThreat = inc?.severity === 'CRITICAL' || cam.camera_id === 'C-07';
                      const isSelected = selectedCam?.camera_id === cam.camera_id;

                      return (
                        <div
                          key={cam.camera_id}
                          onClick={() => setSelectedCam(cam)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer font-mono text-[10px] relative group ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                              : isThreat
                              ? 'bg-red-950/60 border-red-500/80 text-red-200 animate-pulse shadow-md shadow-red-950/40'
                              : 'bg-[#0B0F17]/90 border-slate-800 hover:border-slate-600 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{cam.camera_id}</span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isThreat ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                              }`}
                            />
                          </div>

                          <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                            {cam.name}
                          </div>

                          {isThreat && (
                            <div className="mt-1 text-[8px] font-bold text-red-400 bg-red-950 px-1 py-0.2 rounded border border-red-800 uppercase">
                              CRITICAL
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                <div className="text-[10px] font-mono text-slate-500 pb-1">
                  TERRAIN: {sector.name === 'SECTOR B' ? 'HIGH RISK' : 'SECURED'}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> ONLINE CCTV
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /> INTRUSION ALERT
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                ━━━━ BORDER ZERO LINE
              </span>
            </div>
            <span className="text-[10px] text-slate-500">COORDINATE REF: WGS-84 TACTICAL</span>
          </div>
        </div>

        {/* Right: Selected Camera Tactical Intelligence Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0F17] rounded-xl border border-slate-800 p-5 space-y-4 font-mono text-xs flex flex-col justify-between">
          {selectedCam ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CameraIcon className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-sm text-slate-100">{selectedCam.camera_id} MAST</h3>
                </div>
                <ThreatBadge
                  severity={selectedCam.camera_id === 'C-07' ? 'CRITICAL' : 'NORMAL'}
                />
              </div>

              {/* Simulated Live Mini Canvas Preview */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-cyan-400 font-bold z-10">
                  {selectedCam.camera_id} • LIVE FEED
                </div>
                <div className="text-center p-4">
                  <div className="text-slate-400 text-xs">
                    {selectedCam.name}
                  </div>
                  <div className="text-slate-500 text-[10px] mt-1">
                    {selectedCam.location}
                  </div>
                  {selectedCam.camera_id === 'C-07' && (
                    <div className="mt-2 text-xs font-bold text-red-400 animate-pulse bg-red-950/80 px-2 py-1 rounded border border-red-700">
                      🚨 TRACK #102 BREACH ACTIVE
                    </div>
                  )}
                </div>
              </div>

              {/* Telemetry info */}
              <div className="space-y-2 text-[11px] bg-[#070A0F] p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SECTOR JURISDICTION:</span>
                  <span className="text-slate-200 font-bold">{selectedCam.sector}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">FPS / LATENCY:</span>
                  <span className="text-emerald-400">{selectedCam.fps.toFixed(1)} FPS • {selectedCam.latency_ms}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">RESOLUTION:</span>
                  <span className="text-slate-200">{selectedCam.resolution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className={selectedCam.status === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'}>
                    {selectedCam.status}
                  </span>
                </div>
              </div>

              {/* Associated Incident Card if any */}
              {getIncidentForCam(selectedCam.camera_id) && (
                <div className="bg-red-950/20 border border-red-900/60 p-3 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-red-400 font-bold">
                    <span>ACTIVE INCIDENT DETECTED</span>
                    <span>RISK {getIncidentForCam(selectedCam.camera_id)?.risk_score}/100</span>
                  </div>
                  <div className="text-slate-200 text-xs">
                    {getIncidentForCam(selectedCam.camera_id)?.incident_type}
                  </div>
                  <button
                    onClick={() => {
                      const inc = getIncidentForCam(selectedCam.camera_id);
                      if (inc) onSelectIncident(inc);
                    }}
                    className="w-full mt-2 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 text-[11px] font-semibold transition-colors"
                  >
                    INVESTIGATE INCIDENT DOSSIER
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-center py-10">Select a camera node on the radar map</div>
          )}

          {/* Action button */}
          <button
            onClick={() => navigate('/surveillance')}
            className="w-full py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>SWITCH TO FULL LIVE SURVEILLANCE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
