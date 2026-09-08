import React, { useState, useEffect } from 'react';
import { Camera, Zone, Detection } from '../types';
import { VideoCanvas } from '../components/surveillance/VideoCanvas';
import { ThreatBadge } from '../components/common/ThreatBadge';
import {
  Grid2X2,
  Grid3X3,
  Square,
  Video,
  Activity,
  Layers,
  Shield,
  Eye,
  Crosshair,
  Volume2,
  Maximize2,
  ShieldAlert,
  Radio,
  Wifi,
  Zap,
  X
} from 'lucide-react';

interface SurveillancePageProps {
  cameras: Camera[];
  zones: Zone[];
  onSaveZone: (zone: Zone) => void;
}

export const SurveillancePage: React.FC<SurveillancePageProps> = ({
  cameras,
  zones,
  onSaveZone
}) => {
  const [selectedCameraId, setSelectedCameraId] = useState<string>('C-07');
  const [layoutMode, setLayoutMode] = useState<'focused' | '2x2' | '3x3'>('focused');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [isThreatBannerDismissed, setIsThreatBannerDismissed] = useState<boolean>(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Dynamic Telemetry State for External Mobile Node
  const [telemetry, setTelemetry] = useState({
    fps: 29.8,
    latency: 42,
    bitrate: 4.8,
    health: 99.4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        fps: 29.5 + Math.random() * 0.8,
        latency: 40 + Math.floor(Math.random() * 6),
        bitrate: 4.7 + Math.random() * 0.3,
        health: Number((99.1 + Math.random() * 0.8).toFixed(1))
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const activeCam = cameras.find((c) => c.camera_id === selectedCameraId) || cameras[0];
  const camZones = zones.filter((z) => z.camera_id === selectedCameraId);

  const filteredCameras = cameras.filter((c) => {
    if (sectorFilter !== 'ALL' && c.sector !== sectorFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in">
      {/* High-Confidence Person Detection Threat Warning Banner */}
      {!isThreatBannerDismissed && (
        <div className="relative overflow-hidden bg-gradient-to-r from-red-950/95 via-red-900/90 to-red-950/95 border-2 border-red-500/80 rounded-xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.35)] animate-pulse transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-red-600/30 border border-red-500/60 text-red-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6 text-red-400 animate-ping" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-extrabold tracking-wider uppercase">
                    HIGH CONFIDENCE THREAT
                  </span>
                  <h2 className="text-sm md:text-base font-mono font-bold text-red-100 tracking-wide">
                    PERSON BREACH DETECTED — CAM C-07 (SECTOR C)
                  </h2>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700/80">
                    SCORE: 87/100 (CRITICAL)
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-200 flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                  <span>Target: <strong className="text-red-300">PERSON #102</strong></span>
                  <span>Confidence: <strong className="text-emerald-300">96.4%</strong></span>
                  <span>Zone: <strong className="text-red-300">SECTOR C - RESTRICTED BOUNDARY</strong></span>
                  <span>Vector: <strong className="text-cyan-300">NORTH-EAST @ 4.8 km/h</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs shrink-0 self-end md:self-center">
              {selectedCameraId !== 'C-07' && (
                <button
                  onClick={() => {
                    setSelectedCameraId('C-07');
                    setLayoutMode('focused');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>FOCUS CAM C-07</span>
                </button>
              )}

              <button
                onClick={() => {
                  setDispatchStatus('QRT ALPHA DISPATCHED TO SECTOR C');
                  setTimeout(() => setDispatchStatus(null), 4000);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-700/60 font-bold transition-all flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>{dispatchStatus || 'DISPATCH QRT'}</span>
              </button>

              <button
                onClick={() => setIsThreatBannerDismissed(true)}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                title="Acknowledge & Dismiss Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-mono font-bold tracking-wide text-slate-100">
              Live CCTV Video Analytics &amp; Tactical Grid
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              ● 24 STREAMS ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingestion &amp; AI Detection Overlay (YOLOv11 &amp; ByteTrack Multi-Object Tracking)
          </p>
        </div>

        {/* Layout & Sector Filters */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Sector selector */}
          <div className="flex items-center gap-1.5 bg-[#0B0F17] p-1 rounded-lg border border-slate-800">
            {['ALL', 'Sector A', 'Sector B', 'Sector C', 'Sector D'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  sectorFilter === sec
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setLayoutMode('focused')}
              className={`p-1.5 rounded transition-colors ${
                layoutMode === 'focused' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Focused Stream + AI Overlays"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('2x2')}
              className={`p-1.5 rounded transition-colors ${
                layoutMode === '2x2' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="2x2 Tactical Grid"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('3x3')}
              className={`p-1.5 rounded transition-colors ${
                layoutMode === '3x3' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="3x3 Multi-Camera Matrix"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Focused View (Primary CCTV Inspection) */}
      {layoutMode === 'focused' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Screen with Canvas Overlays (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="tactical-panel p-2">
              {selectedCameraId === 'PHONE-01' ? (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2 font-mono text-xs">
                    <span className="bg-black/80 px-2.5 py-1 rounded text-cyan-400 font-bold border border-cyan-700/60">
                      EXTERNAL MOBILE NODE
                    </span>
                    <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-700 px-2 py-1 rounded flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE STREAM
                    </span>
                  </div>

                  {/* Top Right Corner Telemetry Tags Overlay */}
                  <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                    {/* FPS Counter Tag */}
                    <div className="bg-black/85 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5 shadow-md">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="text-slate-400">FPS:</span>
                      <span className="font-bold text-cyan-300">{telemetry.fps.toFixed(1)}</span>
                    </div>

                    {/* Latency Tag */}
                    <div className="bg-black/85 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5 shadow-md">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-400">LATENCY:</span>
                      <span className="font-bold text-emerald-400">{telemetry.latency}ms</span>
                      <span className="text-[9px] text-slate-500">(±2ms)</span>
                    </div>

                    {/* Bitrate & Quality Tag */}
                    <div className="bg-black/85 border border-slate-800 text-slate-300 px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5 hidden sm:flex">
                      <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-semibold text-slate-200">{telemetry.bitrate.toFixed(1)} Mbps</span>
                      <span className="text-[9px] text-emerald-400 font-bold">1080p@30</span>
                    </div>

                    {/* Connection Health Tag */}
                    <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5 shadow-md font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>HEALTH: {telemetry.health}%</span>
                      <span className="text-[9px] text-emerald-300 bg-emerald-900/60 px-1 py-0.5 rounded border border-emerald-700 hidden lg:inline">5G WEBRTC</span>
                    </div>
                  </div>

                  <img
                    src="/api/cameras/live/phone"
                    alt="External Mobile Node"
                    title="External Mobile Node"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-xs text-slate-300 bg-black/80 px-3 py-1.5 rounded border border-slate-800 backdrop-blur-sm z-10">
                    <span className="text-cyan-300 font-semibold">External Mobile Node</span>
                    <span className="text-slate-400">Endpoint: /api/cameras/live/phone</span>
                    <span className="text-emerald-400 font-bold">● ACTIVE MOBILE NODE</span>
                  </div>
                </div>
              ) : (
                <VideoCanvas
                  camera={activeCam}
                  zones={camZones}
                  onSaveZone={onSaveZone}
                  isDemoIntrusionActive={activeCam.camera_id === 'C-07'}
                />
              )}
            </div>

            {/* Camera Metrics bar */}
            <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-4 font-mono text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400 text-[10px]">CAMERA ID:</span>
                  <div className="font-bold text-slate-100">
                    {selectedCameraId === 'PHONE-01' ? 'MOBILE-01' : activeCam.camera_id}
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-slate-400 text-[10px]">SECTOR:</span>
                  <div className="text-slate-200">
                    {selectedCameraId === 'PHONE-01' ? 'Sector B (Mobile Patrol)' : activeCam.sector}
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-slate-400 text-[10px]">FRAME RATE:</span>
                  <div className="text-emerald-400 font-bold">
                    {selectedCameraId === 'PHONE-01' ? `${telemetry.fps.toFixed(1)} FPS` : `${activeCam.fps.toFixed(1)} FPS`}
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-slate-400 text-[10px]">THREAT LEVEL:</span>
                  <div>
                    <ThreatBadge
                      severity={selectedCameraId === 'PHONE-01' ? 'LOW' : activeCam.camera_id === 'C-07' ? 'CRITICAL' : 'NORMAL'}
                      score={selectedCameraId === 'PHONE-01' ? 25 : activeCam.camera_id === 'C-07' ? 87 : 10}
                      showScore
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Resolution: <span className="text-slate-200 font-semibold">{selectedCameraId === 'PHONE-01' ? '1080p Mobile' : activeCam.resolution}</span> • Latency: <span className="text-cyan-400 font-semibold">{selectedCameraId === 'PHONE-01' ? `${telemetry.latency}ms` : `${activeCam.latency_ms}ms`}</span>
              </div>
            </div>
          </div>

          {/* Right: Camera Selector & Telemetry Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
              <span className="font-bold text-slate-300">SURVEILLANCE CAMERAS</span>
              <span className="text-slate-500">SELECT TO VIEW</span>
            </div>

            <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
              {/* External Mobile Node Card in Selector */}
              <div
                onClick={() => setSelectedCameraId('PHONE-01')}
                className={`p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
                  selectedCameraId === 'PHONE-01'
                    ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                    : 'bg-[#0B0F17] border-cyan-800/40 hover:border-cyan-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-cyan-300">MOBILE-01</span>
                    <span className="text-[11px] text-slate-400">• External Mobile Node</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    LIVE
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-sans mt-1">
                  Mobile Tactical Patrol (http://10.183.244.231:8080/video)
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{telemetry.fps.toFixed(1)} FPS</span>
                  <span>LATENCY: {telemetry.latency}ms</span>
                  <span className="text-cyan-400 font-semibold">HEALTH: {telemetry.health}%</span>
                </div>
              </div>

              {filteredCameras.map((cam) => {
                const isSelected = cam.camera_id === selectedCameraId;
                const isThreat = cam.camera_id === 'C-07';

                return (
                  <div
                    key={cam.camera_id}
                    onClick={() => setSelectedCameraId(cam.camera_id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/30'
                        : 'bg-[#0B0F17] border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isThreat ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
                        <span className="font-bold text-slate-100">{cam.camera_id}</span>
                        <span className="text-[11px] text-slate-400">• {cam.sector}</span>
                      </div>
                      <ThreatBadge severity={isThreat ? 'CRITICAL' : 'NORMAL'} />
                    </div>

                    <div className="text-[11px] text-slate-400 font-sans mt-1">
                      {cam.location}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{cam.fps.toFixed(1)} FPS</span>
                      <span>LATENCY: {cam.latency_ms}ms</span>
                      <span className="text-cyan-400 font-semibold">{isThreat ? '2 TARGETS' : '1 TARGET'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Grid Views (2x2 and 3x3) */}
      {layoutMode !== 'focused' && (
        <div className={`grid gap-4 ${layoutMode === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {/* External Mobile Node in Grid */}
          <div
            onClick={() => {
              setSelectedCameraId('PHONE-01');
              setLayoutMode('focused');
            }}
            className="bg-[#0B0F17] rounded-xl border border-cyan-500/70 p-2 cursor-pointer transition-all hover:border-cyan-400 group shadow-lg shadow-cyan-950/20"
          >
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute top-2 left-2 flex items-center gap-2 z-10 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-black/80 text-cyan-400 font-bold border border-cyan-800">
                  MOBILE-01
                </span>
                <span className="text-[10px] text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                  Sector B (Patrol Unit)
                </span>
              </div>

              {/* Telemetry Tags in Grid View Top Right */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 font-mono text-[10px]">
                <span className="bg-black/85 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 font-bold">
                  {telemetry.fps.toFixed(1)} FPS
                </span>
                <span className="bg-black/85 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800 font-bold">
                  {telemetry.latency}ms
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Stream Image */}
              <img
                src="/api/cameras/live/phone"
                alt="External Mobile Node"
                title="External Mobile Node"
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.7';
                }}
              />

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[10px] text-slate-300 bg-black/75 px-2.5 py-1 rounded backdrop-blur-sm z-10">
                <span className="font-semibold text-cyan-300">External Mobile Node</span>
                <span className="text-emerald-400 font-bold">HEALTH: {telemetry.health}%</span>
                <span className="text-cyan-400">CLICK TO FOCUS</span>
              </div>
            </div>
          </div>

          {filteredCameras.slice(0, layoutMode === '2x2' ? 3 : 8).map((cam) => {
            const isThreat = cam.camera_id === 'C-07';
            return (
              <div
                key={cam.camera_id}
                onClick={() => {
                  setSelectedCameraId(cam.camera_id);
                  setLayoutMode('focused');
                }}
                className={`bg-[#0B0F17] rounded-xl border p-2 cursor-pointer transition-all hover:border-cyan-500 group ${
                  isThreat ? 'border-red-500/70' : 'border-slate-800'
                }`}
              >
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="absolute top-2 left-2 flex items-center gap-2 z-10 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-cyan-400 font-bold border border-slate-800">
                      {cam.camera_id}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-black/60 px-1.5 py-0.5 rounded">
                      {cam.sector}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 z-10">
                    <ThreatBadge severity={isThreat ? 'CRITICAL' : 'NORMAL'} />
                  </div>

                  {/* Simulated Mini Camera Feed */}
                  <div className="w-full h-full bg-gradient-to-b from-[#0F172A] to-[#020617] flex items-center justify-center relative">
                    <Video className="w-8 h-8 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                    {isThreat && (
                      <div className="absolute inset-0 border-2 border-red-500/80 animate-pulse flex items-center justify-center">
                        <span className="bg-red-950/90 text-red-300 font-mono text-xs px-2 py-1 rounded border border-red-600 font-bold">
                          🚨 INTRUSION BREACH
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[10px] text-slate-400 bg-black/70 px-2 py-1 rounded">
                    <span>{cam.fps.toFixed(1)} FPS</span>
                    <span>{cam.resolution}</span>
                    <span className="text-cyan-400">CLICK TO FOCUS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

