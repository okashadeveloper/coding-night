/** Reference dummy data for AssetCare technician workspace screens */

export const DEMO_ASSETS = [
  {
    id: 'a1',
    name: 'Backup Generator',
    code: 'GEN-HQ-002',
    category: 'Generator',
    location: 'Server Room',
    condition: 'Poor',
    status: 'Out of Service',
    lastService: 'Mar 20, 2026',
    nextService: 'Jun 25, 2026',
    openIssues: 2,
    actions: ['Open', 'QR'],
    manufacturer: 'PowerGen Systems',
    serialNumber: 'PG-8821-HQ',
    notes: 'Primary backup power for the server room. Fuel sensor flagged for replacement.'
  },
  {
    id: 'a2',
    name: 'Classroom Projector 01',
    code: 'PRJ-CLS-001',
    category: 'Projector',
    location: 'Classroom Block A',
    condition: 'Good',
    status: 'Operational',
    lastService: 'Jun 12, 2026',
    nextService: 'Aug 5, 2026',
    openIssues: 0,
    actions: ['Open', 'QR'],
    manufacturer: 'Epson',
    serialNumber: 'EP-PRJ-4410',
    notes: 'Ceiling-mounted unit. Lamp hours within normal range.'
  },
  {
    id: 'a3',
    name: 'Fire Extinguisher Block A',
    code: 'FEX-BLA-014',
    category: 'Safety Equipment',
    location: 'Classroom Block A',
    condition: 'Excellent',
    status: 'Operational',
    lastService: 'Apr 12, 2026',
    nextService: 'Jul 12, 2026',
    openIssues: 1,
    actions: ['Open'],
    manufacturer: 'SafeGuard',
    serialNumber: 'SG-FEX-014',
    notes: 'Monthly inspection due; pressure gauge nominal.'
  },
  {
    id: 'a4',
    name: 'Water Dispenser 05',
    code: 'WDS-CAF-005',
    category: 'Appliance',
    location: 'Cafeteria',
    condition: 'Fair',
    status: 'Under Maintenance',
    lastService: 'May 2, 2026',
    nextService: 'Jul 15, 2026',
    openIssues: 1,
    actions: ['Open', 'QR'],
    manufacturer: 'CoolPure',
    serialNumber: 'CP-WD-05',
    notes: 'Hot tap leak reported; filter due for change.'
  },
  {
    id: 'a5',
    name: 'Reception Laptop 04',
    code: 'LAP-REC-004',
    category: 'IT Equipment',
    location: 'Reception',
    condition: 'Good',
    status: 'Operational',
    lastService: 'Jun 1, 2026',
    nextService: 'Sep 1, 2026',
    openIssues: 1,
    actions: ['Open', 'QR'],
    manufacturer: 'Dell',
    serialNumber: 'DLL-REC-04',
    notes: 'Visitor check-in client intermittently freezes.'
  },
  {
    id: 'a6',
    name: 'IT Lab Printer 02',
    code: 'PRT-ITL-002',
    category: 'Printer',
    location: 'IT Lab',
    condition: 'Fair',
    status: 'Operational',
    lastService: 'May 18, 2026',
    nextService: 'Aug 18, 2026',
    openIssues: 1,
    actions: ['Open', 'QR'],
    manufacturer: 'HP',
    serialNumber: 'HP-ITL-02',
    notes: 'Multi-sheet feed fault under investigation.'
  },
  {
    id: 'a7',
    name: 'HVAC Unit Block B',
    code: 'HVAC-BLB-003',
    category: 'HVAC',
    location: 'Classroom Block B',
    condition: 'Good',
    status: 'Operational',
    lastService: 'Apr 28, 2026',
    nextService: 'Jul 28, 2026',
    openIssues: 0,
    actions: ['Open', 'QR'],
    manufacturer: 'Carrier',
    serialNumber: 'CR-HVAC-B3',
    notes: 'Filter replaced at last service window.'
  },
  {
    id: 'a8',
    name: 'Access Control Panel',
    code: 'ACP-MAIN-001',
    category: 'Security',
    location: 'Main Gate',
    condition: 'Excellent',
    status: 'Operational',
    lastService: 'Jun 8, 2026',
    nextService: 'Dec 8, 2026',
    openIssues: 0,
    actions: ['Open', 'QR'],
    manufacturer: 'SecureEntry',
    serialNumber: 'SE-ACP-001',
    notes: 'Firmware current; no open faults.'
  }
];

export const DEMO_ISSUES = [
  {
    id: 'i1',
    issueNumber: 'ISS-2026-0048',
    asset: 'Backup Generator',
    title: 'Fuel level sensor fault',
    reporter: 'Imran Javaid',
    priority: 'Critical',
    status: 'Assigned',
    assignedTechnician: 'Bilal Khan',
    reportedAt: 'Jul 10, 2026, 4:40 PM',
    lastUpdated: 'Jul 10, 2026, 4:40 PM'
  },
  {
    id: 'i2',
    issueNumber: 'ISS-2026-0043',
    asset: 'IT Lab Printer 02',
    title: 'Printer pulling multiple sheets',
    reporter: 'Faraz Iqbal',
    priority: 'Medium',
    status: 'Reported',
    assignedTechnician: 'Unassigned',
    reportedAt: 'Jul 10, 2026, 11:10 AM',
    lastUpdated: 'Jul 10, 2026, 11:10 AM'
  },
  {
    id: 'i3',
    issueNumber: 'ISS-2026-0045',
    asset: 'Water Dispenser 05',
    title: 'Hot water tap leaking',
    reporter: 'Sara Ahmed',
    priority: 'Low',
    status: 'Assigned',
    assignedTechnician: 'Ahmed Raza',
    reportedAt: 'Jul 9, 2026, 2:15 PM',
    lastUpdated: 'Jul 10, 2026, 9:00 AM'
  },
  {
    id: 'i4',
    issueNumber: 'ISS-2026-0046',
    asset: 'Reception Laptop 04',
    title: 'Visitor check-in software freezing',
    reporter: 'Nadia Khan',
    priority: 'Medium',
    status: 'Assigned',
    assignedTechnician: 'Ahmed Raza',
    reportedAt: 'Jul 9, 2026, 11:40 AM',
    lastUpdated: 'Jul 9, 2026, 4:20 PM'
  }
];

/** Analytics boards — consistent with 8-asset technician directory */
export const ANALYTICS_CONDITION = [
  { name: 'Good', value: 4, color: '#10b981' },
  { name: 'Fair', value: 2, color: '#f59e0b' },
  { name: 'Poor', value: 1, color: '#ef4444' },
  { name: 'Excellent', value: 1, color: '#14b8a6' }
];

export const ANALYTICS_PRIORITY = [
  { name: 'High', value: 3, color: '#f97316' },
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'Medium', value: 4, color: '#14b8a6' },
  { name: 'Low', value: 3, color: '#94a3b8' }
];

export const ANALYTICS_REPEAT_REPAIRS = [
  { name: 'Backup Generator', count: 5 },
  { name: 'Water Dispenser 05', count: 4 },
  { name: 'IT Lab Printer 02', count: 3 },
  { name: 'Reception Laptop 04', count: 2 },
  { name: 'HVAC Unit Block B', count: 1 }
];

export const ANALYTICS_UPCOMING_MAINTENANCE = [
  {
    id: 'm1',
    asset: 'Fire Extinguisher Block A',
    code: 'FEX-BLA-014',
    due: 'Jul 12, 2026',
    type: 'Safety inspection'
  },
  {
    id: 'm2',
    asset: 'Water Dispenser 05',
    code: 'WDS-CAF-005',
    due: 'Jul 15, 2026',
    type: 'Filter & leak repair'
  },
  {
    id: 'm3',
    asset: 'Backup Generator',
    code: 'GEN-HQ-002',
    due: 'Jun 25, 2026',
    type: 'Fuel sensor service',
    overdue: true
  },
  {
    id: 'm4',
    asset: 'HVAC Unit Block B',
    code: 'HVAC-BLB-003',
    due: 'Jul 28, 2026',
    type: 'Quarterly service'
  }
];

/** Scheduled Maintenance — mutable seed for timeline view */
export const DEFAULT_SCHEDULED_MAINTENANCE = [
  {
    id: 'sm1',
    assetName: 'Backup Generator',
    assetCode: 'GEN-HQ-002',
    task: 'Quarterly Fuel Line Inspection',
    assignedTo: 'Bilal Khan',
    dueDate: 'Jul 15, 2026',
    priority: 'High',
    status: 'Pending'
  },
  {
    id: 'sm2',
    assetName: 'HVAC Unit Block B',
    assetCode: 'HVAC-BLB-003',
    task: 'Filter & Coil Cleaning',
    assignedTo: 'Sara Ali',
    dueDate: 'Jul 22, 2026',
    priority: 'Medium',
    status: 'Scheduled'
  }
];

/** Technician directory — mutable seed */
export const DEFAULT_TECHNICIANS = [
  {
    id: 't1',
    name: 'Ahmed Raza',
    role: 'Senior Maintenance Technician',
    specialization: 'Electrical & HVAC Systems',
    activeLoad: 4,
    activeLoadLabel: '4 assigned issues',
    availability: 'On-Duty',
    initials: 'AR'
  },
  {
    id: 't2',
    name: 'Bilal Khan',
    role: 'Maintenance Specialist',
    specialization: 'Power Systems & Generators',
    activeLoad: 2,
    activeLoadLabel: '2 assigned issues',
    availability: 'On-Duty',
    initials: 'BK'
  },
  {
    id: 't3',
    name: 'Sara Ali',
    role: 'IT Infrastructure Tech',
    specialization: 'Hardware & Networking',
    activeLoad: 1,
    activeLoadLabel: '1 assigned issue',
    availability: 'On Leave',
    initials: 'SA'
  }
];

/** Notifications stream — mutable seed */
export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'Critical Alert',
    message: 'New issue reported: Fuel level sensor fault on Backup Generator',
    timestamp: '10 mins ago',
    unread: true
  },
  {
    id: 'n2',
    type: 'Task Assignment',
    message: "You have been assigned to 'Visitor check-in software freezing'",
    timestamp: '2 hours ago',
    unread: true
  },
  {
    id: 'n3',
    type: 'System Update',
    message: "Asset 'Water Dispenser 05' status changed to 'Under Maintenance'",
    timestamp: '1 day ago',
    unread: false
  }
];

/** Settings preference defaults */
export const DEFAULT_SETTINGS_PREFS = {
  pushOnAssignment: true,
  emailDailyDigest: false,
  offlineCaching: true
};

export const DEFAULT_ACCOUNT = {
  name: 'Ahmed Raza',
  email: 'technician@assetcare.demo',
  role: 'Senior Maintenance Technician',
  campus: 'SMIT Technology Campus'
};
