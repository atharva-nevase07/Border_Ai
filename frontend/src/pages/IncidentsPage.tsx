import React, { useState } from 'react';
import { Incident } from '../types';
import { ThreatBadge } from '../components/common/ThreatBadge';
import {
  ShieldAlert,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  Clock,
  MapPin,
  Camera as CameraIcon,
  Flame
} from 'lucide-react';

interface IncidentsPageProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({
  incidents,
  onSelectIncident
}) => {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filtered = incidents.filter((inc) => {
    if (sectorFilter !== 'ALL' && inc.sector !== sectorFilter) return false;
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inc.incident_code.toLowerCase().includes(q) ||
        inc.incident_type.toLowerCase().includes(q) ||
        inc.camera_id.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-mono font-bold tracking-wide text-slate-100">
              Border Surveillance Incident Registry
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              {incidents.length} INCIDENTS RECORDED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified threat situations with AI bounding box tracks, timelines, and causal scores
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, camera, type..."
              className="bg-[#0B0F17] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-lg border border-slate-800">
            {['ALL', 'Sector A', 'Sector B', 'Sector C', 'Sector D'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-2 py-1 rounded transition-colors ${
                  sectorFilter === sec ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60' : 'text-slate-400'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-lg border border-slate-800">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-1 rounded transition-colors ${
                  severityFilter === sev ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-[#0B0F17] rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#070A0F] border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Incident ID</th>
              <th className="py-3 px-4">Threat Type</th>
              <th className="py-3 px-4">Camera &amp; Sector</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((inc) => (
              <tr
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {inc.incident_code}
                </td>
                <td className="py-3.5 px-4 text-slate-100 font-sans font-medium">
                  {inc.incident_type}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  <span className="text-cyan-400 font-bold">{inc.camera_id}</span> • {inc.sector}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`font-bold ${inc.risk_score > 80 ? 'text-red-400' : inc.risk_score > 60 ? 'text-orange-400' : 'text-amber-400'}`}>
                    {inc.risk_score}
                  </span>
                  <span className="text-slate-500 text-[10px]"> / 100</span>
                </td>
                <td className="py-3.5 px-4">
                  <ThreatBadge severity={inc.severity} />
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                    {inc.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  {new Date(inc.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="px-2.5 py-1 rounded bg-slate-800 group-hover:bg-cyan-600 group-hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1 ml-auto">
                    <span>VIEW DETAILS</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
