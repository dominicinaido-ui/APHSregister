export interface SurgicalCase {
  id: string;
  patientName: string;
  age: number;
  sex: 'male' | 'female';
  origin?: string;
  placeOfResidence?: string;
  diagnosis: string;
  procedure: string;
  doctor: string;
  specialty: string;
  date: string;
  time?: string;
  fastingTime?: string;
  contactDetails: string;
  isReferral: boolean;
  referralDetails?: string;
  patientType: 'admission' | 'daycase' | 'ward';
  wardNumber?: string;
  admissionSource?: 'sopc' | 'oncology';
  priority: boolean;
  status: 'scheduled' | 'cancelled' | 'completed' | 'deferred';
  confirmedOnOTList: boolean;
  caseType: 'elective' | 'emergency';
  cancellationReason?: string;
  cancellationHistory?: Array<{
    reason: string;
    originalDate: string;
    cancelledAt: string;
  }>;
  deferralReason?: string;
  deferralHistory?: Array<{
    reason: string;
    originalDate: string;
    deferredAt: string;
  }>;
  originalDate?: string;
  rebookCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
}

export interface Specialty {
  id: string;
  name: string;
  color: string;
}

export interface ActivityLog {
  id: string;
  action: 'created' | 'updated' | 'deleted';
  patientName: string;
  changes?: string;
  timestamp: string;
  user: string;
}