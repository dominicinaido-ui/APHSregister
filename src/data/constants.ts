import { Doctor, Specialty } from '../types';

export const DOCTORS: Doctor[] = [
  { id: 'james', name: 'Dr. James' },
  { id: 'borchem', name: 'Dr. Borchem' },
  { id: 'apamumu', name: 'Dr. Apamumu' },
  { id: 'inaido', name: 'Dr. Inaido' }
];

export const SPECIALTIES: Specialty[] = [
  { id: 'general', name: 'General Surgery', color: '#3b82f6' },
  { id: 'pediatric', name: 'Pediatric', color: '#10b981' },
  { id: 'orthopedic', name: 'Orthopedic', color: '#f59e0b' },
  { id: 'gynecology', name: 'Gynecology', color: '#ec4899' },
  { id: 'urology', name: 'Urology', color: '#8b5cf6' },
  { id: 'cardiothoracic', name: 'Cardiothoracic', color: '#ef4444' },
  { id: 'neurosurgery', name: 'Neurosurgery', color: '#6366f1' },
  { id: 'ophthalmology', name: 'Ophthalmology', color: '#06b6d4' },
  { id: 'plastic', name: 'Plastic Surgery', color: '#14b8a6' },
  { id: 'ent', name: 'ENT Surgery', color: '#f97316' },
  { id: 'dental', name: 'Dental', color: '#84cc16' },
  { id: 'obstetrics', name: 'Obstetrics', color: '#f43f5e' },
  { id: 'gastroenterology', name: 'Gastroenterology', color: '#a855f7' }
];

export const CANCELLATION_REASONS = [
  'Patient request',
  'Medical complications',
  'Equipment unavailable',
  'Surgeon unavailable',
  'Theatre unavailable',
  'Patient unfit for surgery',
  'Emergency case priority',
  'Administrative reason',
  'Other'
];

export const DEFERRAL_REASONS = [
  'Patient unfit for surgery',
  'Medical optimization required',
  'Equipment unavailable',
  'Theatre unavailable',
  'Surgeon unavailable',
  'Patient request',
  'Emergency case priority',
  'Insufficient fasting time',
  'Administrative reason',
  'Other'
];

export const COMMON_PROCEDURES = [
  'Abbe flap',
  'Abdominoperineal Resection',
  'Above knee amputation',
  'Amputation',
  'Anastomosis',
  'Anoplasty',
  'Appendectomy',
  'Arthrotomy + irrigation',
  'Aspiration',
  'Axillary clearance',
  'Axillary Node Biopsy',
  'Backslab cast',
  'Biopsy',
  'Bladder repair',
  'Bone drilling',
  'Bone graft',
  'Bone nibbling',
  'Bowel resection',
  'Burr hole',
  'Candle dilatation',
  'Carpal tunnel release',
  'Cesarean section',
  'Change of dressing',
  'Cholecystectomy',
  'Circumcision',
  'Closed reduction',
  'Colostomy',
  'Colostomy closure',
  'Colostomy revision',
  'Craniectomy',
  'Craniotomy',
  'Curretage',
  'Cut down',
  'Cylinder cast',
  'Cystectomy',
  'Cystoscopy',
  'Cystotomy',
  'Darn repair',
  'Debridemtent',
  'Debulking',
  'Decortication',
  'Desarda repair',
  'Dilatation',
  'Direct Laryngoscopy',
  'Diverting colostomy',
  'Elevation',
  'End to end anastomosis',
  'Endoscopy',
  'Exploratory laparotomy',
  'Escharotomy',
  'Excision',
  'External Fixation',
  'Fasciotomy',
  'First Feet Surgery',
  'Fistulectomy',
  'Flap',
  'Forehead flap',
  'Gastroscopy',
  'Hemicoloectomy',
  'Hemithyroidectomy',
  'Hemorrhoidectomy',
  'Hernioplasty Inguinal',
  'Herniorrhaphy Inguinal',
  'Herniotomy Inguinal',
  'Hypospadias repair',
  'Ileostomy',
  'Ileostomy closure',
  'Internal iliac ligation',
  'Jaboulay procedure',
  'Janeway feeding gastrostomy',
  'K wire removal',
  'Karapandzic flap',
  'Kessler repair',
  'Krakow technique',
  'Ladds procedure',
  'Laminectomy',
  'Lay open',
  'Ligation',
  'lockwoods repair',
  'Lumpectomy',
  'Manipulation under anesthesia (MUA)',
  'Mastectomy',
  'Mayo repair',
  'McEvedy approach',
  'Mesh repair',
  'Millard repair',
  'Neck dissection',
  'Nephrectomy',
  'Nephrostomy',
  'Olecranon Pin Insertion',
  'Open reduction and internal fixation (ORIF)',
  'Open reduction and internal fixation (ORIF) +  K-wire',
  'Open reduction and internal fixation (ORIF) + K-nail',
  'Open reduction and internal fixation (ORIF) + Plate & Screw',
  'Open reduction and internal fixation (ORIF) + Rush Pin',
  'Open reduction and internal fixation (ORIF) + TBW',
  'Orchidectomy',
  'Orchidoplexy',
  'Osteotomy',
  'Pericardial stripping',
  'Polypectomy',
  'POP Window',
  'Posterior Sagittal Anorectoplasty (PSARP)',
  'Proctoscopy',
  'Prostatectomy',
  'Prostectomy',
  'Proximal Control',
  'Radial head resection',
  'Radial nerve exploration',
  'Ramstedt\'s Pyloromyotomy',
  'Ray Amputation',
  'Rectal washout',
  'Removal',
  'Rhinoplasty',
  'Rotational flap',
  'Seton suture',
  'Side to side anastomosis',
  'Sigmoidosopy',
  'Sistrunk procedure',
  'Skin traction',
  'Skull Traction',
  'Splenectomy',
  'SSG',
  'Stricturoplasty',
  'Superficial parotidectomy',
  'Suprapubic catheter (SPC)',
  'Suturing',
  'Swenson\'s Pullthrough',
  'Tendon repair',
  'Tension band wire (TBW)',
  'Thiersch suturing',
  'Thoracotomy anterolateral',
  'Thoracotomy posterolateral',
  'Tibial steinman pin insertion',
  'Total laryngectomy',
  'Tracheostomy',
  'Transanal endorectal pullthorugh (TAERPT)',
  'Under water seal drain (UWSD)',
  'Urethroplasty',
  'Urethroplasty + Glendoplasty + meatoplasty',
  'Urethrostomy',
  'Von Langerback repair',
  'VP shunt',
  'Wash out',
  'Wide excision',
  'Witzel tube',
  'Z plasty'
];

export const COMMON_DIAGNOSES = [
  'Abscess',
  'Achilles tendon injury',
  'Acute appendicitis',
  'Adhesive Bowel Disease',
  'Anorectal malformation (ARM)',
  'Aneurysm false',
  'Aneurysm true',
  'Appendiceal mass',
  'Arterio-Venous fistula',
  'Backer\'s Cyst',
  'Balanitis',
  'Basal cell carcinoma',
  'Basal skull fracture',
  'Bed sores',
  'Benign Prostatic Hyperplasia (BPH)',
  'Bladder outlet obstruction (BOO)',
  'Blunt Abdominal Injury',
  'Bowel obstruction',
  'Breast cancer',
  'Burns',
  'Burst Abdomen',
  'Carbuncle',
  'Cardiac Injury',
  'Carpal Tunnel syndrome',
  'Cellulitis',
  'Congenital Talipes Equinovarus (CETV)',
  'Cholelithiasis',
  'Chronic appendicitis',
  'Cleft Lip',
  'Cleft palate',
  'Colles Fracture',
  'Colorectal Cancer',
  'Colostomy',
  'Closed fracture',
  'Compartment syndrome',
  'Compound fracture',
  'Congenital hydrocephalus',
  'Constrictive Pericarditis',
  'Contracture',
  'Cryptorchidism',
  'Cyst',
  'Cystolithiasis',
  'Depressed skull fracture',
  'Dermoid cyst',
  'Diabetic foot sepsis',
  'Dislocation',
  'Diverticulum',
  'Downs Syndrome',
  'Dysphagia',
  'Empyema',
  'Enterocolitis',
  'Enterocutaneous fistula',
  'Epigastric hernia',
  'Epistaxis',
  'Oesophageal tumour',
  'Ewings sarcoma',
  'Exostosis',
  'Foreign body',
  'Fournier\'s gangrene',
  'Galeazzi fracture',
  'Gangrene',
  'Gastric outlet obstruction',
  'Granuloma',
  'Gun shot wound (GSW)',
  'Head Injury mild',
  'Head Injury moderate',
  'Head Injury severe',
  'Haemangioma',
  'Haemorrhoids',
  'Hernia abdominal',
  'Hirschsprung\'s disease (HSD)',
  'HSD -Post Swenson\'s Pull Through',
  'HSD with Colostomy',
  'Hydrocele',
  'Hydrocephalus',
  'Hypospadias',
  'Ileal atresia',
  'Ileostomy',
  'Impending Airway Obstruction',
  'Imperforated Anus',
  'Infantile Hypertrophic Pyloric Stenosis',
  'Inguinal hernia',
  'Intussusception',
  'Keloid',
  'K-wires insitu',
  'Laceration',
  'Lesion',
  'Liver Abscess',
  'Liver Trauma',
  'Ludwigs\'s angina',
  'Lung fibrosis',
  'Malrotation',
  'Marjolin\'s ulcer',
  'Monteggia fracture',
  'Neglected CTEV',
  'Neurofibroma',
  'Neurogenic bladder',
  'Paraphimosis',
  'Paronychia',
  'Penetrating abdominal Injury',
  'Penile CA',
  'Penile fibroma',
  'Perianal Fistula',
  'Pharyngitis',
  'PR bleeding',
  'Pregnancy',
  'Pressure ulcer',
  'Pyloric Stenosis',
  'Pyomyositis',
  'Rectal lesion',
  'Rectal polyp',
  'Rectovaginal fistula',
  'Retained IDC',
  'Spinal injury',
  'Splenic injury',
  'Thyroglossal cyst',
  'Thyroid tumour',
  'Tracheal injury',
  'Tracheoesophageal Fistula',
  'Tumour',
  'Ulcer',
  'Upper GIT obstruction',
  'Urethral Stricture',
  'Urinary retention',
  'Urosepsis',
  'Vaginal trauma',
  'Volvulus',
  'Wilms Tumour',
  'Wound',
  'Wound breakdown'
];

// Public holidays for Papua New Guinea
export const PUBLIC_HOLIDAYS = [
  // 2024 holidays
  '2024-01-01', // New Year's Day
  '2024-03-29', // Good Friday
  '2024-04-01', // Easter Monday
  '2024-06-10', // Queen's Birthday
  '2024-07-23', // National Remembrance Day
  '2024-09-16', // Independence Day
  '2024-12-25', // Christmas Day
  '2024-12-26', // Boxing Day
  
  // 2025 holidays
  '2025-01-01', // New Year's Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Easter Monday
  '2025-06-09', // Queen's Birthday
  '2025-07-23', // National Remembrance Day
  '2025-09-16', // Independence Day
  '2025-12-25', // Christmas Day
  '2025-12-26', // Boxing Day
  
  // 2026 holidays
  '2026-01-01', // New Year's Day
  '2026-04-03', // Good Friday
  '2026-04-06', // Easter Monday
  '2026-06-08', // Queen's Birthday
  '2026-07-23', // National Remembrance Day
  '2026-09-16', // Independence Day
  '2026-12-25', // Christmas Day
  '2026-12-26', // Boxing Day
];

// Get holiday name from predefined holidays or custom holidays
export const getHolidayName = (date: string): string | null => {
  // Check custom holidays first
  const customHolidays = JSON.parse(localStorage.getItem('customHolidays') || '{}');
  if (customHolidays[date]) {
    return customHolidays[date];
  }
  
  // Check predefined holidays
  const holidayNames: Record<string, string> = {
    '01-01': 'New Year\'s Day',
    '03-29': 'Good Friday',
    '04-01': 'Easter Monday',
    '04-03': 'Good Friday',
    '04-06': 'Easter Monday',
    '04-18': 'Good Friday',
    '04-21': 'Easter Monday',
    '06-08': 'Queen\'s Birthday',
    '06-09': 'Queen\'s Birthday',
    '06-10': 'Queen\'s Birthday',
    '07-23': 'National Remembrance Day',
    '09-16': 'Independence Day',
    '12-25': 'Christmas Day',
    '12-26': 'Boxing Day'
  };
  
  const monthDay = date.substring(5); // Get MM-DD part
  return holidayNames[monthDay] || null;
};

// Get current public holidays (predefined + custom)
export const getCurrentPublicHolidays = (): string[] => {
  const customHolidays = JSON.parse(localStorage.getItem('customHolidays') || '{}');
  const customDates = Object.keys(customHolidays);
  return [...PUBLIC_HOLIDAYS, ...customDates].filter((date, index, arr) => arr.indexOf(date) === index).sort();
};