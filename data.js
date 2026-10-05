// Sample data for the preview. All names, figures and clients are invented.
const D = {
  jobs: [
    { id: 'MTG-2410', name: 'Topside inspection and maintenance', facility: 'FPSO Kestrel', client: 'Kestrel Offshore Nigeria', progress: 72, status: 'On track', due: '28 Nov' },
    { id: 'MTG-2411', name: 'Automated ultrasonic testing, separator', facility: 'FPSO Orca', client: 'Orca Production Ltd', progress: 45, status: 'On track', due: '12 Dec' },
    { id: 'MTG-2412', name: 'Crude tank sludge profiling', facility: 'Bluewater Terminal', client: 'Bluewater Marine Ops', progress: 88, status: 'On track', due: '14 Oct' },
    { id: 'MTG-2413', name: 'Offloading hose supply (8 strings)', facility: 'FPSO Tidal Ridge', client: 'Tidal Ridge Energy', progress: 31, status: 'Delayed', due: '30 Oct' },
    { id: 'MTG-2414', name: 'Wellhead maintenance', facility: 'FPSO Kestrel', client: 'Kestrel Offshore Nigeria', progress: 12, status: 'Starting', due: '20 Jan' }
  ],
  months: [
    { m: 'May', in: 62, out: 41 }, { m: 'Jun', in: 48, out: 39 }, { m: 'Jul', in: 75, out: 52 },
    { m: 'Aug', in: 58, out: 47 }, { m: 'Sep', in: 91, out: 60 }, { m: 'Oct', in: 44, out: 28 }
  ],
  employees: [
    { id: 'E-014', name: 'Tunde Adebayo', role: 'Offshore Inspector', dept: 'Operations', site: 'FPSO Kestrel', status: 'Offshore', salary: 620000 },
    { id: 'E-021', name: 'Ngozi Eze', role: 'Procurement Officer', dept: 'Procurement', site: 'Warri office', status: 'Active', salary: 540000 },
    { id: 'E-023', name: 'Emeka Obi', role: 'NDT Technician (UT)', dept: 'Engineering', site: 'FPSO Orca', status: 'Offshore', salary: 710000 },
    { id: 'E-030', name: 'Fatima Bello', role: 'Accountant', dept: 'Finance', site: 'Warri office', status: 'Active', salary: 580000 },
    { id: 'E-034', name: 'Chidi Okafor', role: 'Warehouse Supervisor', dept: 'Procurement', site: 'Warri base', status: 'Active', salary: 450000 },
    { id: 'E-041', name: 'Ibrahim Musa', role: 'HSE Officer', dept: 'HSE', site: 'Warri base', status: 'Active', salary: 520000 },
    { id: 'E-045', name: 'Blessing Udoh', role: 'Design Engineer', dept: 'Engineering', site: 'Warri office', status: 'Active', salary: 760000 },
    { id: 'E-052', name: 'Samuel Ekpo', role: 'Welder (6G)', dept: 'Operations', site: 'FPSO Tidal Ridge', status: 'Offshore', salary: 480000 },
    { id: 'E-058', name: 'Amaka Nwachukwu', role: 'HR Assistant', dept: 'HR', site: 'Warri office', status: 'On leave', salary: 380000 }
  ],
  leave: [
    { id: 1, who: 'Amaka Nwachukwu', type: 'Annual leave', from: '05 Oct', to: '23 Oct', days: 14, status: 'Approved' },
    { id: 2, who: 'Tunde Adebayo', type: 'Annual leave', from: '02 Nov', to: '13 Nov', days: 10, status: 'Pending' },
    { id: 3, who: 'Ngozi Eze', type: 'Sick leave', from: '08 Oct', to: '10 Oct', days: 3, status: 'Pending' },
    { id: 4, who: 'Samuel Ekpo', type: 'Compassionate', from: '19 Oct', to: '23 Oct', days: 5, status: 'Pending' }
  ],
  certs: [
    { who: 'Emeka Obi', cert: 'NDT Level II (UT)', days: 12 },
    { who: 'Samuel Ekpo', cert: 'Offshore medical', days: 19 },
    { who: 'Tunde Adebayo', cert: 'Sea survival and helicopter escape', days: 34 },
    { who: 'Ibrahim Musa', cert: 'Working at height', days: 58 },
    { who: 'Blessing Udoh', cert: 'Offshore medical', days: 91 },
    { who: 'Samuel Ekpo', cert: 'Swimming pass', days: 140 }
  ],
  ledger: [
    { d: '03 Oct', ref: 'INV-1048', desc: 'Payment received, hose supply', cat: 'Sales', type: 'Income', amt: 28400000, cur: '₦' },
    { d: '02 Oct', ref: 'EXP-3321', desc: 'Helicopter crew transfer', cat: 'Logistics', type: 'Expense', amt: 4650000, cur: '₦' },
    { d: '01 Oct', ref: 'EXP-3318', desc: 'Customs clearance, 40ft container', cat: 'Import duties', type: 'Expense', amt: 7120000, cur: '₦' },
    { d: '30 Sep', ref: 'INV-1046', desc: 'Payment received, AUT inspection', cat: 'Sales', type: 'Income', amt: 62000, cur: '$' },
    { d: '29 Sep', ref: 'PAY-0930', desc: 'September payroll', cat: 'Payroll', type: 'Expense', amt: 31800000, cur: '₦' },
    { d: '27 Sep', ref: 'EXP-3305', desc: 'Warehouse diesel and power', cat: 'Utilities', type: 'Expense', amt: 1380000, cur: '₦' },
    { d: '25 Sep', ref: 'EXP-3299', desc: 'Safety gear (PPE) restock', cat: 'HSE', type: 'Expense', amt: 2940000, cur: '₦' },
    { d: '22 Sep', ref: 'INV-1044', desc: 'Payment received, sludge profiling', cat: 'Sales', type: 'Income', amt: 41500000, cur: '₦' },
    { d: '20 Sep', ref: 'EXP-3287', desc: 'Equipment hire: dewatering pumps', cat: 'Equipment', type: 'Expense', amt: 5200000, cur: '₦' }
  ],
  invoices: [
    { no: 'INV-1050', client: 'Kestrel Offshore Nigeria', issued: '01 Oct', due: '31 Oct', amt: 34131250, cur: '₦', status: 'Sent' },
    { no: 'INV-1049', client: 'Orca Production Ltd', issued: '28 Sep', due: '28 Oct', amt: 74500, cur: '$', status: 'Sent' },
    { no: 'INV-1048', client: 'Tidal Ridge Energy', issued: '12 Sep', due: '12 Oct', amt: 28400000, cur: '₦', status: 'Paid' },
    { no: 'INV-1047', client: 'Bluewater Marine Ops', issued: '05 Sep', due: '05 Oct', amt: 19800000, cur: '₦', status: 'Overdue' },
    { no: 'INV-1046', client: 'Orca Production Ltd', issued: '30 Aug', due: '29 Sep', amt: 62000, cur: '$', status: 'Paid' },
    { no: 'INV-1045', client: 'Kestrel Offshore Nigeria', issued: '24 Aug', due: '23 Sep', amt: 33750000, cur: '₦', status: 'Overdue' },
    { no: 'INV-1051', client: 'Tidal Ridge Energy', issued: '—', due: '—', amt: 12600000, cur: '₦', status: 'Draft' }
  ],
  invoiceLines: [
    { d: 'Offloading hose, single carcass, 10 in × 12 m', q: 8, p: 3200000 },
    { d: 'Hose accessories and end fittings (set)', q: 8, p: 450000 },
    { d: 'Freight, customs clearance and delivery to Warri base', q: 1, p: 1900000 },
    { d: 'Inspection and certification', q: 1, p: 650000 }
  ],
  orders: [
    { po: 'PO-7731', item: 'Offloading hoses, 8 strings', supplier: 'Marine Hose Works (UK)', client: 'Tidal Ridge Energy', stage: 2, eta: '18 Oct' },
    { po: 'PO-7729', item: 'Safety relief valves ×6', supplier: 'ValveTech GmbH', client: 'Kestrel Offshore Nigeria', stage: 3, eta: '09 Oct' },
    { po: 'PO-7726', item: 'Subsea flexible hose, 100 m', supplier: 'Subflex Ltd', client: 'Orca Production Ltd', stage: 1, eta: '02 Nov' },
    { po: 'PO-7722', item: 'Triplex pump with manifold', supplier: 'Pressline Pumps', client: 'Kestrel Offshore Nigeria', stage: 4, eta: 'Delivered' },
    { po: 'PO-7735', item: '2.5 in flowline, 200 m', supplier: 'Delta Steel Supply', client: 'Kestrel Offshore Nigeria', stage: 0, eta: '25 Oct' }
  ],
  stages: ['Ordered', 'Shipped', 'Customs', 'In warehouse', 'Delivered'],
  stock: [
    { sku: 'HSE-001', name: 'Safety helmets', qty: 38, min: 40, loc: 'Bay A' },
    { sku: 'HSE-014', name: 'Fire-retardant coveralls', qty: 120, min: 60, loc: 'Bay A' },
    { sku: 'NDT-203', name: 'UT couplant gel (5 L)', qty: 6, min: 10, loc: 'Bay C' },
    { sku: 'WLD-110', name: 'Welding rods, 6013 (box)', qty: 74, min: 30, loc: 'Bay D' },
    { sku: 'SCF-300', name: 'Scaffold tubes, 6 m', qty: 410, min: 200, loc: 'Yard' },
    { sku: 'FLT-022', name: 'Hydraulic filters', qty: 9, min: 12, loc: 'Bay B' },
    { sku: 'GSK-051', name: 'Flange gasket kits', qty: 55, min: 25, loc: 'Bay B' }
  ],
  requests: [
    { d: '04 Oct', from: 'Kestrel Offshore Nigeria', what: 'Quote: topside blasting and painting', type: 'Quote request', status: 'New' },
    { d: '03 Oct', from: 'Orca Production Ltd', what: 'Hire: 2 booster pumps, 6 weeks', type: 'Equipment hire', status: 'New' },
    { d: '01 Oct', from: 'Tidal Ridge Energy', what: 'Two NDT technicians, short term', type: 'Personnel hire', status: 'In review' }
  ],
  kanban: [
    { col: 'Design (FEED)', cards: [
      { t: 'Pump skid layout, Orca', who: 'Blessing Udoh', due: '20 Oct', tag: 'Design' },
      { t: 'Flowline routing study', who: 'Blessing Udoh', due: '02 Nov', tag: 'Design' } ] },
    { col: 'In progress', cards: [
      { t: 'Topside inspection, Kestrel', who: 'Tunde Adebayo', due: '28 Nov', tag: 'Inspection' },
      { t: 'AUT scan, crude separator', who: 'Emeka Obi', due: '12 Dec', tag: 'NDT' },
      { t: 'Wellhead overhaul prep', who: 'Samuel Ekpo', due: '15 Nov', tag: 'Repair' } ] },
    { col: 'Awaiting review', cards: [
      { t: 'Sludge profile report, Bluewater', who: 'Emeka Obi', due: '10 Oct', tag: 'Report' } ] },
    { col: 'Done', cards: [
      { t: 'Hull compartment repair', who: 'Samuel Ekpo', due: 'Closed 21 Sep', tag: 'Repair' },
      { t: 'Vessel pump installation', who: 'Tunde Adebayo', due: 'Closed 09 Sep', tag: 'Install' } ] }
  ]
};
