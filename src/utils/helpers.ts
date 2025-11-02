export const getPatientTypeDisplay = (
  patientType: string,
  wardNumber?: string,
  admissionSource?: 'sopc' | 'oncology'
): string => {
  // Handle undefined or invalid patientType
  if (!patientType || typeof patientType !== 'string') {
    return 'Unknown Patient Type';
  }

  if (patientType === 'ward' && wardNumber) {
    return `Ward ${wardNumber}`;
  }
  if (patientType === 'admission' && admissionSource) {
    return admissionSource === 'sopc' ? 'Admission (SOPC)' : 'Admission (Oncology)';
  }
  if (patientType === 'daycase') {
    if (admissionSource) {
      return admissionSource === 'sopc' ? 'Day Case (SOPC)' : 'Day Case (Oncology)';
    }
    return 'Day Case';
  }
  return patientType.charAt(0).toUpperCase() + patientType.slice(1);
};