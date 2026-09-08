import React, { useRef, useEffect, useState } from 'react';
import { Camera, Zone, Detection, ZonePoint } from '../../types';
import { Shield, Crosshair, Eye, PenTool, Check, X, Maximize2 } from 'lucide-react';

interface VideoCanvasProps {
  camera: Camera;
  zones: Zone[];
  detections?: Detection[];
  isDemoIntrusionActive?: boolean;
  onSaveZone?: (newZone: Zone) => void;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  camera,
  zones,
  detections = [],
  isDemoIntrusionActive = false,
  onSaveZone
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Zone drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<ZonePoint[]>([]);
  const [newZoneType, setNewZoneType] = useState<'RESTRICTED_ZONE' | 'MONITORED_ZONE' | 'SAFE_ZONE'>('RESTRICTED_ZONE');
  const [newZoneName, setNewZoneName] = useState('New Restricted Zone');

  // Animation frame loop
  useEffect(() => {
    let animId: number;
    let frameCount = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear and Draw Simulated CCTV Background
      ctx.fillStyle = '#060A10';
      ctx.fillRect(0, 0, w, h);

      // Draw gradient landscape simulation (riverbed, hills, border fence line)
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0D1420');
      grad.addColorStop(0.3, '#101B2B');
      grad.addColorStop(0.65, '#0B131E');
      grad.addColorStop(1, '#080E17');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle CCTV noise / scanlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let i = 0; i < h; i += 4) {
        ctx.fillRect(0, i, w, 1);
      }

      // Border Zero Line on terrain
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, h * 0.18);
      ctx.lineTo(w, h * 0.18);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label on border line
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#EF4444';
      ctx.fillText('BORDER ZERO LINE [NATIONAL BOUNDARY]', 20, h * 0.18 - 6);

      // 2. Draw Configured Polygonal Zones
      zones.forEach((zone) => {
        if (!zone.polygon_coordinates || zone.polygon_coordinates.length < 2) return;

        ctx.beginPath();
        const pts = zone.polygon_coordinates;
        ctx.moveTo((pts[0].x / 100) * w, (pts[0].y / 100) * h);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo((pts[i].x / 100) * w, (pts[i].y / 100) * h);
        }
        ctx.closePath();

        // Fill with translucent color
        if (zone.zone_type === 'RESTRICTED_ZONE') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 1.5;
        } else if (zone.zone_type === 'MONITORED_ZONE') {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1.5;
        } else {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 1.5;
        }
        ctx.fill();
        ctx.stroke();

        // Zone Tag
        const tagX = (pts[0].x / 100) * w + 8;
        const tagY = (pts[0].y / 100) * h + 16;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = zone.color || '#F59E0B';
        ctx.fillText(zone.name.toUpperCase(), tagX, tagY);
      });

      // 3. Draw In-Progress Drawing Polygon
      if (isDrawing && drawingPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo((drawingPoints[0].x / 100) * w, (drawingPoints[0].y / 100) * h);
        for (let i = 1; i < drawingPoints.length; i++) {
          ctx.lineTo((drawingPoints[i].x / 100) * w, (drawingPoints[i].y / 100) * h);
        }
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vertices
        drawingPoints.forEach((p) => {
          ctx.fillStyle = '#06B6D4';
          ctx.beginPath();
          ctx.arc((p.x / 100) * w, (p.y / 100) * h, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 4. Draw AI Detections & Multi-Object Tracking Overlay
      const activeObjects = isDemoIntrusionActive
        ? [
            {
              object_type: 'PERSON' as const,
              confidence: 0.964,
              track_id: '#102',
              bounding_box: {
                x: 36 + Math.sin(frameCount * 0.03) * 6,
                y: 35 - (frameCount % 180) * 0.06,
                width: 7.5,
                height: 20.0
              },
              movement_direction: 'NORTH-EAST',
              speed_kmh: 4.8,
              duration_sec: 18 + Math.floor(frameCount / 30),
              zone: 'RESTRICTED ZONE'
            }
          ]
        : detections.length > 0
        ? detections
        : [
            {
              object_type: 'PERSON' as const,
              confidence: 0.964,
              track_id: '#102',
              bounding_box: {
                x: 42 + Math.sin(frameCount * 0.02) * 3,
                y: 44,
                width: 8.0,
                height: 22.0
              },
              movement_direction: 'NORTH-EAST',
              speed_kmh: 4.6,
              duration_sec: 22,
              zone: camera.camera_id === 'C-07' ? 'RESTRICTED ZONE' : 'SAFE ZONE'
            }
          ];

      activeObjects.forEach((obj) => {
        const bx = (obj.bounding_box.x / 100) * w;
        const by = (obj.bounding_box.y / 100) * h;
        const bw = (obj.bounding_box.width / 100) * w;
        const bh = (obj.bounding_box.height / 100) * h;

        const isThreat = obj.zone?.includes('RESTRICTED') || isDemoIntrusionActive;
        const boxColor = isThreat ? '#EF4444' : '#06B6D4';

        // Trajectory Trail line
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(bx + bw / 2, by + bh);
        ctx.lineTo(bx + bw / 2 - 25, by + bh + 35);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bounding Box Corners (Tactical Military Bracket Style)
        const cornerLen = 10;
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = 2;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(bx, by + cornerLen);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + cornerLen, by);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(bx + bw - cornerLen, by);
        ctx.lineTo(bx + bw, by);
        ctx.lineTo(bx + bw, by + cornerLen);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(bx, by + bh - cornerLen);
        ctx.lineTo(bx, by + bh);
        ctx.lineTo(bx + cornerLen, by + bh);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(bx + bw - cornerLen, by + bh);
        ctx.lineTo(bx + bw, by + bh);
        ctx.lineTo(bx + bw, by + bh - cornerLen);
        ctx.stroke();

        // Subtle box fill
        ctx.fillStyle = isThreat ? 'rgba(239, 68, 68, 0.12)' : 'rgba(6, 182, 212, 0.08)';
        ctx.fillRect(bx, by, bw, bh);

        // Header Tag: "PERSON #102 [96.4%]"
        const labelText = `${obj.object_type} ${obj.track_id} ${(obj.confidence * 100).toFixed(1)}%`;
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(labelText).width;

        ctx.fillStyle = boxColor;
        ctx.fillRect(bx, by - 16, textWidth + 8, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(labelText, bx + 4, by - 4);

        // Vector Subtitle: "MOV: NORTH-EAST | 4.8 km/h"
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isThreat ? '#FCA5A5' : '#67E8F9';
        ctx.fillText(
          `MOV: ${obj.movement_direction || 'NORTH-EAST'} • ${obj.speed_kmh || 4.8} km/h • ${obj.duration_sec || 18}s`,
          bx,
          by + bh + 14
        );
      });

      // 5. Military Tactical OSD Overlays
      // Top Left: Camera ID, Sector, Status
      ctx.fillStyle = 'rgba(7, 10, 15, 0.75)';
      ctx.fillRect(10, 10, 190, 48);
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 190, 48);

      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`CAM: ${camera.camera_id} • ${camera.sector.toUpperCase()}`, 18, 26);

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = camera.status === 'ONLINE' ? '#34D399' : '#FBBF24';
      ctx.fillText(`STATUS: ${camera.status} | FPS: ${camera.fps.toFixed(1)}`, 18, 40);
      ctx.fillText(`LATENCY: ${camera.latency_ms}ms | 1080p FHD`, 18, 51);

      // Top Right: Live REC watermark and real timestamp
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const ms = String(now.getMilliseconds()).padStart(3, '0');

      ctx.fillStyle = 'rgba(7, 10, 15, 0.75)';
      ctx.fillRect(w - 210, 10, 200, 36);
      ctx.strokeStyle = '#1E293B';
      ctx.strokeRect(w - 210, 10, 200, 36);

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(w - 195, 28, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#F8FAFC';
      ctx.fillText(`LIVE REC • ${timeStr}.${ms}`, w - 182, 31);

      // Bottom Center: Target Crosshair
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 20, h / 2);
      ctx.lineTo(w / 2 + 20, h / 2);
      ctx.moveTo(w / 2, h / 2 - 20);
      ctx.lineTo(w / 2, h / 2 + 20);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [camera, zones, detections, isDemoIntrusionActive, isDrawing, drawingPoints]);

  // Handle canvas click during drawing mode
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setDrawingPoints((prev) => [...prev, { x: Math.round(clickX), y: Math.round(clickY) }]);
  };

  const finishDrawing = () => {
    if (drawingPoints.length >= 3 && onSaveZone) {
      const color =
        newZoneType === 'RESTRICTED_ZONE'
          ? '#EF4444'
          : newZoneType === 'MONITORED_ZONE'
          ? '#F59E0B'
          : '#10B981';

      onSaveZone({
        camera_id: camera.camera_id,
        name: newZoneName,
        zone_type: newZoneType,
        polygon_coordinates: drawingPoints,
        color
      });
    }
    setIsDrawing(false);
    setDrawingPoints([]);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setDrawingPoints([]);
  };

  return (
    <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
      {/* Dynamic Tactical Canvas */}
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        onClick={handleCanvasClick}
        className={`w-full aspect-video block ${isDrawing ? 'cursor-crosshair' : 'cursor-default'}`}
      />

      {/* Drawing Toolbar Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {!isDrawing ? (
            <button
              onClick={() => setIsDrawing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono backdrop-blur-md transition-colors"
            >
              <PenTool className="w-3.5 h-3.5 text-cyan-400" />
              <span>DEFINE POLYGON ZONE</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900/95 p-1.5 rounded border border-cyan-500/50 backdrop-blur-md">
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                className="bg-black/80 px-2 py-1 rounded text-xs font-mono text-slate-200 border border-slate-700 w-36"
                placeholder="Zone name"
              />
              <select
                value={newZoneType}
                onChange={(e) => setNewZoneType(e.target.value as any)}
                className="bg-black/80 px-2 py-1 rounded text-xs font-mono text-slate-200 border border-slate-700"
              >
                <option value="RESTRICTED_ZONE">RESTRICTED ZONE (RED)</option>
                <option value="MONITORED_ZONE">MONITORED ZONE (AMBER)</option>
                <option value="SAFE_ZONE">SAFE ZONE (GREEN)</option>
              </select>
              <button
                onClick={finishDrawing}
                disabled={drawingPoints.length < 3}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-mono font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                <span>SAVE ({drawingPoints.length} PTS)</span>
              </button>
              <button
                onClick={cancelDrawing}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Legend status pill */}
        <div className="hidden sm:flex items-center gap-3 bg-black/80 px-3 py-1.5 rounded border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-md pointer-events-auto">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> RESTRICTED
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> MONITORED
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> SAFE
          </span>
        </div>
      </div>
    </div>
  );
};
