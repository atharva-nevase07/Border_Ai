import { Camera, Zone, Detection, Incident, Alert, EvidenceRecord, SystemStatus } from '../types';

export const INITIAL_CAMERAS: Camera[] = Array.from({ length: 24 }, (_, i) => {
  const id = i + 1;
  const camId = `C-${id.toString().padStart(2, '0')}`;
  const sectors = ['Sector A', 'Sector B', 'Sector C', 'Sector D'];
  const sector = sectors[Math.floor(i / 6)];
  
  let status: 'ONLINE' | 'WARNING' | 'OFFLINE' = 'ONLINE';
  let fps = 25.0;
  let latency = 68 + (i * 4) % 35;

  if (id === 7) {
    status = 'WARNING';
    fps = 18.2;
    latency = 214;
  } else if (id === 14) {
    status = 'WARNING';
    fps = 20.0;
    latency = 185;
  }

  const outpostNames = [
    'Western Ridge Mast',
    'Riverine Delta Tower',
    'Sand Dune Outpost',
    'Border Gate Alpha',
    'Culvert Sector Node',
    'Perimeter Checkpoint'
  ];

  return {
    id,
    camera_id: camId,
    name: `${outpostNames[i % 6]} ${camId}`,
    sector,
    location: `Defense Grid ${140 + id * 3}.${220 + id * 5} - ${sector}`,
    status,
    fps,
    resolution: '1080p FHD',
    latency_ms: latency,
    last_seen: new Date().toISOString()
  };
});

export const INITIAL_ZONES: Zone[] = [
  {
    camera_id: 'C-07',
    name: 'Sector Safe Buffer',
    zone_type: 'SAFE_ZONE',
    polygon_coordinates: [{ x: 5, y: 72 }, { x: 45, y: 72 }, { x: 45, y: 95 }, { x: 5, y: 95 }],
    color: '#10B981'
  },
  {
    camera_id: 'C-07',
    name: 'Perimeter Monitored Strip',
    zone_type: 'MONITORED_ZONE',
    polygon_coordinates: [{ x: 10, y: 42 }, { x: 85, y: 42 }, { x: 85, y: 70 }, { x: 10, y: 70 }],
    color: '#F59E0B'
  },
  {
    camera_id: 'C-07',
    name: 'Restricted Exclusion Zone',
    zone_type: 'RESTRICTED_ZONE',
    polygon_coordinates: [{ x: 15, y: 15 }, { x: 92, y: 15 }, { x: 92, y: 40 }, { x: 15, y: 40 }],
    color: '#EF4444'
  },
  {
    camera_id: 'C-07',
    name: 'Zero Boundary Line',
    zone_type: 'BORDER_LINE',
    polygon_coordinates: [{ x: 0, y: 12 }, { x: 100, y: 12 }],
    color: '#DC2626'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 1,
    incident_code: 'INC-2026-09-08-0042',
    camera_id: 'C-07',
    sector: 'Sector B',
    incident_type: 'Restricted Zone Intrusion',
    severity: 'CRITICAL',
    risk_score: 87,
    timestamp: '2026-09-08T10:42:17Z',
    status: 'OPEN',
    description: 'Male suspect breached perimeter boundary entering high-security restricted zone. Subject tracked on vector NORTH-EAST towards borderline marker 112.',
    threat_factors: [
      'Person detected in surveillance grid (+10)',
      'Restricted zone intrusion breach (+40)',
      'Critical national border boundary crossed (+50)',
      'Tactical evasive movement vector (+25)'
    ],
    timeline_events: [
      { time: '10:41:52', event: 'Person detected', desc: 'Subject entered optical cone of Camera C-07 at 82m range.' },
      { time: '10:42:03', event: 'Person approaching restricted zone', desc: 'Track #102 trajectory crossed Monitored Zone Alpha.' },
      { time: '10:42:17', event: 'Boundary crossed', desc: 'Subject crossed polygon boundary line into tactical exclusion zone.' },
      { time: '10:42:18', event: 'Risk score increased to 87', desc: 'Threat engine computed threat level CRITICAL.' },
      { time: '10:42:20', event: 'Critical alert generated', desc: 'Dispatched audible red alert and operations room notification.' },
      { time: '10:42:21', event: 'Snapshot captured', desc: 'Forensic snapshot incident_0042.jpg tagged with bounding coordinates.' },
      { time: '10:42:22', event: 'Video evidence saved', desc: 'Pre-event and post-event video clip archived in Evidence Vault.' }
    ]
  },
  {
    id: 2,
    incident_code: 'INC-2026-09-08-0038',
    camera_id: 'C-05',
    sector: 'Sector B',
    incident_type: 'Unusual Movement',
    severity: 'HIGH',
    risk_score: 71,
    timestamp: '2026-09-08T09:51:24Z',
    status: 'INVESTIGATING',
    description: 'Suspect moving through dense marshland using irregular evasive crawl vectors. Stationary period of 40s under foliage.',
    threat_factors: [
      'Person detected in surveillance grid (+10)',
      'Monitored perimeter zone entry (+20)',
      'Tactical evasive movement vector (+25)',
      'Prolonged presence detected (+20)'
    ],
    timeline_events: [
      { time: '09:49:10', event: 'Optical trigger', desc: 'Motion detector tripped in marsh sector.' },
      { time: '09:50:24', event: 'Object classified', desc: 'YOLO model confirmed Person classification.' },
      { time: '09:51:24', event: 'Risk escalated to 71', desc: 'High threat assigned due to tactical crawling behavior.' }
    ]
  },
  {
    id: 3,
    incident_code: 'INC-2026-09-08-0032',
    camera_id: 'C-08',
    sector: 'Sector C',
    incident_type: 'Vehicle Near Boundary',
    severity: 'HIGH',
    risk_score: 65,
    timestamp: '2026-09-08T09:12:15Z',
    status: 'OPEN',
    description: 'Black unbadged 4x4 off-road pickup halted 30m from secondary perimeter fence without running lights.',
    threat_factors: [
      'VEHICLE detected near boundary sector (+15)',
      'Monitored perimeter zone entry (+20)',
      'Unidentified vehicle stationary near restricted line (+25)'
    ],
    timeline_events: [
      { time: '09:10:05', event: 'Vehicle detected', desc: 'Thermal mast detected heat signature.' },
      { time: '09:11:40', event: 'Stationary threshold exceeded', desc: 'Vehicle remained static in dark sector.' },
      { time: '09:12:15', event: 'Alert issued', desc: 'Armed reconnaissance patrol dispatched to sector.' }
    ]
  },
  {
    id: 4,
    incident_code: 'INC-2026-09-08-0029',
    camera_id: 'C-03',
    sector: 'Sector A',
    incident_type: 'Abandoned Object',
    severity: 'CRITICAL',
    risk_score: 82,
    timestamp: '2026-09-08T08:54:31Z',
    status: 'RESOLVED',
    description: 'Heavy tactical backpack left beside perimeter culvert. Depositor fled west on foot across river bed.',
    threat_factors: [
      'Unattended suspicious package / payload (+35)',
      'Restricted zone intrusion breach (+40)',
      'Prolonged presence / loitering detected (+20)'
    ],
    timeline_events: [
      { time: '08:52:12', event: 'Payload dropped', desc: 'Person deposited parcel in culvert.' },
      { time: '08:54:31', event: 'Object static timer expired', desc: 'AI classified object as Abandoned Payload.' },
      { time: '08:55:00', event: 'Explosives unit dispatched', desc: 'Cleared and secured by Quick Reaction Team.' }
    ]
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 1,
    incident_id: 1,
    severity: 'CRITICAL',
    message: 'Restricted Zone Intrusion at Camera C-07 (Sector B) - Risk 87/100',
    created_at: '2026-09-08T10:42:17Z',
    acknowledged: false
  },
  {
    id: 2,
    incident_id: 2,
    severity: 'HIGH',
    message: 'Unusual Movement at Camera C-05 (Sector B) - Risk 71/100',
    created_at: '2026-09-08T09:51:24Z',
    acknowledged: false
  },
  {
    id: 3,
    incident_id: 3,
    severity: 'HIGH',
    message: 'Vehicle Near Boundary at Camera C-08 (Sector C) - Risk 65/100',
    created_at: '2026-09-08T09:12:15Z',
    acknowledged: false
  },
  {
    id: 4,
    incident_id: 4,
    severity: 'CRITICAL',
    message: 'Abandoned Object at Camera C-03 (Sector A) - Risk 82/100',
    created_at: '2026-09-08T08:54:31Z',
    acknowledged: true,
    acknowledged_by: 'OFFICER-7492',
    acknowledged_at: '2026-09-08T09:02:00Z'
  }
];

export const INITIAL_EVIDENCE: EvidenceRecord[] = [
  {
    id: 1,
    incident_id: 1,
    snapshot_path: 'incident_0042.jpg',
    video_path: 'incident_0042.mp4',
    timestamp: '2026-09-08T10:42:17Z',
    object_type: 'PERSON',
    track_id: '#102',
    confidence: 0.964,
    metadata_json: JSON.stringify({
      camera: 'C-07',
      sector: 'Sector B',
      threat: 'Restricted Zone Intrusion',
      risk: 87,
      resolution: '1080p FHD'
    })
  },
  {
    id: 2,
    incident_id: 2,
    snapshot_path: 'incident_0038.jpg',
    video_path: 'incident_0038.mp4',
    timestamp: '2026-09-08T09:51:24Z',
    object_type: 'PERSON',
    track_id: '#098',
    confidence: 0.912,
    metadata_json: JSON.stringify({
      camera: 'C-05',
      sector: 'Sector B',
      threat: 'Unusual Movement',
      risk: 71,
      resolution: '1080p FHD'
    })
  },
  {
    id: 3,
    incident_id: 3,
    snapshot_path: 'incident_0032.jpg',
    video_path: 'incident_0032.mp4',
    timestamp: '2026-09-08T09:12:15Z',
    object_type: 'VEHICLE',
    track_id: '#088',
    confidence: 0.941,
    metadata_json: JSON.stringify({
      camera: 'C-08',
      sector: 'Sector C',
      threat: 'Vehicle Near Boundary',
      risk: 65,
      resolution: '1080p FHD'
    })
  },
  {
    id: 4,
    incident_id: 4,
    snapshot_path: 'incident_0029.jpg',
    video_path: 'incident_0029.mp4',
    timestamp: '2026-09-08T08:54:31Z',
    object_type: 'ABANDONED OBJECT',
    track_id: '#074',
    confidence: 0.985,
    metadata_json: JSON.stringify({
      camera: 'C-03',
      sector: 'Sector A',
      threat: 'Abandoned Object',
      risk: 82,
      resolution: '1080p FHD'
    })
  }
];

export const SYSTEM_STATUS_DATA: SystemStatus = {
  cctv_network: 'ONLINE',
  video_ingestion: 'ONLINE',
  object_detection: 'ONLINE',
  tracking_engine: 'ONLINE',
  threat_engine: 'ONLINE',
  evidence_storage: 'ONLINE',
  alert_service: 'ONLINE',
  ai_assistant: 'ONLINE',
  total_cameras: 24,
  active_cameras: 22,
  warning_cameras: 2,
  offline_cameras: 0,
  uptime: '99.98%',
  timestamp: new Date().toISOString()
};
