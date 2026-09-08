import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Camera as CameraIcon,
  Clock,
  ShieldAlert,
  Activity
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  // Chart Data mirroring requirements in Section 15
  const incidentsOverTime = [
    { time: '00:00', incidents: 2, normal: 12 },
    { time: '02:00', incidents: 1, normal: 8 },
    { time: '04:00', incidents: 4, normal: 10 },
    { time: '06:00', incidents: 2, normal: 25 },
    { time: '08:00', incidents: 7, normal: 38 },
    { time: '10:00', incidents: 9, normal: 42 },
    { time: '12:00', incidents: 5, normal: 35 },
    { time: '14:00', incidents: 3, normal: 29 },
    { time: '16:00', incidents: 6, normal: 33 },
    { time: '18:00', incidents: 8, normal: 31 },
    { time: '20:00', incidents: 4, normal: 22 },
    { time: '22:00', incidents: 3, normal: 16 }
  ];

  const threatCategories = [
    { category: 'Restricted Zone', count: 18, fill: '#EF4444' },
    { category: 'Vehicle Activity', count: 31, fill: '#F97316' },
    { category: 'Unusual Movement', count: 12, fill: '#F59E0B' },
    { category: 'Abandoned Object', count: 5, fill: '#8B5CF6' },
    { category: 'Normal Activity', count: 61, fill: '#10B981' }
  ];

  const threatDistribution = [
    { name: 'NORMAL', value: 108, color: '#10B981' },
    { name: 'LOW', value: 20, color: '#3B82F6' },
    { name: 'MEDIUM', value: 15, color: '#F59E0B' },
    { name: 'HIGH', value: 3, color: '#F97316' },
    { name: 'CRITICAL', value: 1, color: '#EF4444' }
  ];

  const cameraActivity = [
    { camera: 'C-07 (Sec B)', alerts: 12 },
    { camera: 'C-03 (Sec A)', alerts: 8 },
    { camera: 'C-05 (Sec B)', alerts: 7 },
    { camera: 'C-08 (Sec C)', alerts: 6 },
    { camera: 'C-14 (Sec C)', alerts: 5 },
    { camera: 'C-11 (Sec B)', alerts: 4 },
    { camera: 'C-04 (Sec A)', alerts: 4 },
    { camera: 'C-19 (Sec D)', alerts: 3 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wide text-slate-100">
              Border Surveillance Video Analytics &amp; Metrics
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              REAL-TIME AGGREGATES
            </span>
          </div>
          <p className="text-slate-400 mt-0.5 text-[11px]">
            Statistical analysis of CCTV detections, risk scores, threat categories, and sensor alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0B0F17] px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            TIME RANGE: <strong className="text-cyan-400">PAST 24 HOURS</strong>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>EVENTS TODAY</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">147</div>
          <div className="text-emerald-400 text-[10px] mt-1">+14% vs yesterday</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>AVG THREAT EVALUATION</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">4.2 ms</div>
          <div className="text-slate-500 text-[10px] mt-1">Sub-frame latency</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>AVG RESPONSE TIME</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">42.8s</div>
          <div className="text-emerald-500 text-[10px] mt-1">-8s response improvement</div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[10px] flex items-center justify-between">
            <span>HOTSPOT CAMERA</span>
            <CameraIcon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-1">C-07</div>
          <div className="text-slate-500 text-[10px] mt-1">12 Alerts (Sector B)</div>
        </div>
      </div>

      {/* Row 1: Line Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incidents Over Time (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B0F17] p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-sm text-slate-200">
              Perimeter Incidents &amp; Detections Over Time (24h)
            </span>
            <span className="text-[10px] text-slate-500">Hourly Distribution</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="High/Critical Incidents"
                />
                <Line
                  type="monotone"
                  dataKey="normal"
                  stroke="#06B6D4"
                  strokeWidth={1.5}
                  name="Normal Activity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Severity Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0F17] p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-sm text-slate-200">Threat Severity Distribution</span>
            <span className="text-[10px] text-slate-500">147 Events</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Threat Categories Bar & Camera Alert Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Categories (6 cols) */}
        <div className="lg:col-span-6 bg-[#0B0F17] p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-sm text-slate-200">Threats by Intelligence Category</span>
            <span className="text-[10px] text-slate-500">Classification count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={10} />
                <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={10} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {threatCategories.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Alert Generating Cameras (6 cols) */}
        <div className="lg:col-span-6 bg-[#0B0F17] p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-sm text-slate-200">Top Alert-Generating Cameras</span>
            <span className="text-[10px] text-slate-500">Perimeter Sensor Hotspots</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cameraActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="camera" stroke="#64748B" fontSize={9} />
                <YAxis stroke="#64748B" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#334155', fontSize: '11px' }}
                />
                <Bar dataKey="alerts" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Alert Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
