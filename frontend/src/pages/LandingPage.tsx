import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  CheckCircle2,
  Cpu,
  Video,
  Radar,
  Flame,
  Bot,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [officerCode, setOfficerCode] = useState('OFFICER-7492');
  const [sectorClearance, setSectorClearance] = useState('ALL-SECTORS (OMEGA)');

  const keyCapabilities = [
    { title: 'Existing CCTV Compatible', desc: 'Plug-and-play RTSP/HLS ingestion without hardware overhaul.' },
    { title: 'AI-Powered Object Detection', desc: 'YOLOv11 neural network identifies Persons, Vehicles, Weapons, Payloads.' },
    { title: 'Multi-Object Tracking', desc: 'Persistent track IDs, velocity vectors, and heading analytics.' },
    { title: 'Border Intelligence', desc: 'Configurable polygon Safe, Monitored, Restricted, and Zero-line zones.' },
    { title: 'Automated Threat Scoring', desc: 'Real-time 0-100 risk calculation with explicit causal factor explanation.' },
    { title: 'Automatic Evidence Generation', desc: 'Instant forensic snapshots and encrypted video snippet vault.' },
    { title: 'Real-Time Alert Dispatch', desc: 'Sub-second auditory and tactical visual warnings for security command.' },
    { title: 'AI-Assisted Investigation', desc: 'Natural language search engine interrogation of forensic incident database.' }
  ];

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 bg-tactical-grid relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/60">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-xl tracking-wider text-slate-100">
              BORDER <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs font-mono text-slate-400 tracking-wider uppercase">
              SIH26187 • Intelligent Border Surveillance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-[#0B0F17] px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GRID TELEMETRY: NOMINAL</span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Mission Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-semibold">
              <Radar className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>DEFENSE OPERATIONS CLEARANCE REQUIRED</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent Video Analytics for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Border Surveillance</span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Transforming existing CCTV infrastructure into real-time actionable intelligence. Detect objects, track trajectories, evaluate boundary intrusions, calculate risk scores, generate forensic evidence, and query incidents via the AI Assistant.
            </p>

            {/* Key capabilities grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {keyCapabilities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-[#0B0F17]/80 p-3 rounded-lg border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tactical Authorization Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B0F17]/90 border border-slate-800 rounded-xl p-6 shadow-2xl shadow-black/80 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>OPERATIONS LOGIN</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  LEVEL 4 SEC-OPS
                </span>
              </div>

              <form onSubmit={handleEnter} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1.5">
                    OPERATOR CREDENTIAL ID:
                  </label>
                  <input
                    type="text"
                    value={officerCode}
                    onChange={(e) => setOfficerCode(e.target.value)}
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1.5">
                    SECTOR CLEARANCE JURISDICTION:
                  </label>
                  <select
                    value={sectorClearance}
                    onChange={(e) => setSectorClearance(e.target.value)}
                    className="w-full bg-[#070A0F] border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="ALL-SECTORS (OMEGA)">ALL SECTORS (A, B, C, D) - FULL COMMAND</option>
                    <option value="SECTOR-B (RIVERINE)">SECTOR B - NORTHERN RIVERINE VALLEY</option>
                    <option value="SECTOR-A (WESTERN)">SECTOR A - WESTERN RIDGE OUTPOST</option>
                  </select>
                </div>

                <div className="p-3 rounded bg-slate-900/80 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>SECURITY STATUS:</span>
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SESSION ENCRYPTION:</span>
                    <span className="text-cyan-400">AES-256-GCM</span>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-enter-command-center"
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-bold font-mono text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all cursor-pointer"
                >
                  <span>ENTER COMMAND CENTER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-center text-slate-500">
                PROPRIETARY DEFENSE SIMULATION PLATFORM • SIH 2026
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-800/60 text-center font-mono text-xs text-slate-500 backdrop-blur-md">
        BORDER AI • Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure
      </footer>
    </div>
  );
};
