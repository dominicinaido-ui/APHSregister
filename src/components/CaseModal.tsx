import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { SurgicalCase } from '../types';
import { DOCTORS, SPECIALTIES, CANCELLATION_REASONS, DEFERRAL_REASONS, COMMON_PROCEDURES, COMMON_DIAGNOSES, getHolidayName, getCurrentPublicHolidays } from '../data/constants';

interface CaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caseData: Omit<SurgicalCase, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (updates: Partial<SurgicalCase>) => void;
  editingCase?: SurgicalCase | null;
  initialDate?: string;
}

export const CaseModal: React.FC<CaseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingCase,
  initialDate
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    sex: 'male' as 'male' | 'female',
    origin: '',
    placeOfResidence: '',
    diagnoses: [] as string[],
    procedures: [] as string[],
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    fastingTime: '',
    contactDetails: '',
    isReferral: false,
    referralDetails: '',
    patientType: 'admission' as 'admission' | 'daycase' | 'ward',
    admissionSource: 'sopc' as 'sopc' | 'oncology',
    priority: false,
    status: 'scheduled' as 'scheduled' | 'cancelled' | 'completed' | 'deferred',
    caseType: 'elective' as 'elective' | 'emergency',
    cancellationReason: '',
    deferralReason: '',
    newDate: '',
    rebookCount: 0,
    deferralHistory: [],
    cancellationHistory: [],
    notes: '',
    wardNumber: ''
  });
  const [customDoctor, setCustomDoctor] = useState('');
  const [showCustomDoctor, setShowCustomDoctor] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [selectedDiagnosisSide, setSelectedDiagnosisSide] = useState<'left' | 'right' | 'bilateral' | 'n/a'>('n/a');
  const [diagnosisAdditionalInfo, setDiagnosisAdditionalInfo] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [customProcedure, setCustomProcedure] = useState('');
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | 'bilateral' | 'n/a'>('n/a');
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    if (editingCase) {
      // Convert single diagnosis and procedure strings to arrays for backward compatibility
      const diagnosesArray = editingCase.diagnosis ? [editingCase.diagnosis] : [];
      const proceduresArray = editingCase.procedure ? [editingCase.procedure] : [];
      
      setFormData({
        patientName: editingCase.patientName,
        age: editingCase.age.toString(),
        sex: editingCase.sex,
        origin: editingCase.origin || '',
        placeOfResidence: editingCase.placeOfResidence || '',
        diagnoses: diagnosesArray,
        procedures: proceduresArray,
        doctor: editingCase.doctor,
        specialty: editingCase.specialty,
        date: editingCase.date,
        time: editingCase.time || '',
        fastingTime: editingCase.fastingTime || '',
        contactDetails: editingCase.contactDetails,
        isReferral: editingCase.isReferral,
        referralDetails: editingCase.referralDetails || '',
        patientType: editingCase.patientType,
        admissionSource: editingCase.admissionSource || 'sopc',
        priority: editingCase.priority,
        status: editingCase.status,
        caseType: editingCase.caseType,
        cancellationReason: editingCase.cancellationReason || '',
        deferralReason: editingCase.deferralReason || '',
        newDate: '',
        rebookCount: editingCase.rebookCount,
        deferralHistory: editingCase.deferralHistory || [],
        cancellationHistory: editingCase.cancellationHistory || [],
        notes: editingCase.notes || '',
        wardNumber: editingCase.wardNumber || ''
      });
      
      // Check if the doctor is in the predefined list
      const isPredefinedDoctor = DOCTORS.some(doctor => doctor.name === editingCase.doctor);
      if (!isPredefinedDoctor && editingCase.doctor) {
        setShowCustomDoctor(true);
        setCustomDoctor(editingCase.doctor);
      } else {
        setShowCustomDoctor(false);
        setCustomDoctor('');
      }
    } else {
      // For new cases on public holidays, default to emergency
      const defaultCaseType = (initialDate && isPublicHoliday(initialDate)) ? 'emergency' : 'elective';
      
      setFormData({
        patientName: '',
        age: '',
        sex: 'male',
        origin: '',
        placeOfResidence: '',
        diagnoses: [],
        procedures: [],
        doctor: '',
        specialty: '',
        date: initialDate || '',
        time: '',
        fastingTime: '',
        contactDetails: '',
        isReferral: false,
        referralDetails: '',
        patientType: 'admission',
        admissionSource: 'sopc',
        priority: false,
        status: 'scheduled',
        caseType: defaultCaseType,
        cancellationReason: '',
        deferralReason: '',
        newDate: '',
        rebookCount: 0,
        notes: '',
        wardNumber: ''
      });
      setShowCustomDoctor(false);
      setCustomDoctor('');
    }
    setSelectedDiagnosis('');
    setCustomDiagnosis('');
    setSelectedDiagnosisSide('n/a');
    setDiagnosisAdditionalInfo('');
    setSelectedProcedure('');
    setCustomProcedure('');
    setSelectedSide('n/a');
    setAdditionalInfo('');
  }, [editingCase, initialDate, isOpen]);

  const isPublicHoliday = (dateString: string) => {
    return getCurrentPublicHolidays().includes(dateString);
  };
  
  const addDiagnosis = () => {
    let diagnosisToAdd = '';
    
    if (selectedDiagnosis && selectedDiagnosis !== 'custom') {
      diagnosisToAdd = selectedDiagnosis;
    } else if (selectedDiagnosis === 'custom' && customDiagnosis.trim()) {
      diagnosisToAdd = customDiagnosis.trim();
    }
    
    // Add side specification if applicable
    if (diagnosisToAdd && selectedDiagnosisSide !== 'n/a') {
      if (selectedDiagnosisSide === 'bilateral') {
        diagnosisToAdd = `${diagnosisToAdd} (Bilateral)`;
      } else {
        diagnosisToAdd = `${diagnosisToAdd} (${selectedDiagnosisSide.charAt(0).toUpperCase() + selectedDiagnosisSide.slice(1)})`;
      }
    }
    
    // Add additional information if provided
    if (diagnosisToAdd && diagnosisAdditionalInfo.trim()) {
      diagnosisToAdd = `${diagnosisToAdd} - ${diagnosisAdditionalInfo.trim()}`;
    }
    
    if (diagnosisToAdd && !formData.diagnoses.includes(diagnosisToAdd)) {
      setFormData({
        ...formData,
        diagnoses: [...formData.diagnoses, diagnosisToAdd]
      });
      setSelectedDiagnosis('');
      setCustomDiagnosis('');
      setSelectedDiagnosisSide('n/a');
      setDiagnosisAdditionalInfo('');
    }
  };
  
  const removeDiagnosis = (index: number) => {
    setFormData({
      ...formData,
      diagnoses: formData.diagnoses.filter((_, i) => i !== index)
    });
  };
  
  const addProcedure = () => {
    let procedureToAdd = '';
    
    if (selectedProcedure && selectedProcedure !== 'custom') {
      procedureToAdd = selectedProcedure;
    } else if (selectedProcedure === 'custom' && customProcedure.trim()) {
      procedureToAdd = customProcedure.trim();
    }
    
    // Add side specification if applicable
    if (procedureToAdd && selectedSide !== 'n/a') {
      if (selectedSide === 'bilateral') {
        procedureToAdd = `${procedureToAdd} (Bilateral)`;
      } else {
        procedureToAdd = `${procedureToAdd} (${selectedSide.charAt(0).toUpperCase() + selectedSide.slice(1)})`;
      }
    }
    
    // Add additional information if provided
    if (procedureToAdd && additionalInfo.trim()) {
      procedureToAdd = `${procedureToAdd} - ${additionalInfo.trim()}`;
    }
    
    if (procedureToAdd && !formData.procedures.includes(procedureToAdd)) {
      setFormData({
        ...formData,
        procedures: [...formData.procedures, procedureToAdd]
      });
      setSelectedProcedure('');
      setCustomProcedure('');
      setSelectedSide('n/a');
      setAdditionalInfo('');
    }
  };
  
  const removeProcedure = (index: number) => {
    setFormData({
      ...formData,
      procedures: formData.procedures.filter((_, i) => i !== index)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
     // Use custom doctor name if "Other" is selected
     const doctorName = showCustomDoctor ? customDoctor : formData.doctor;
     
     // Convert diagnoses and procedures arrays back to single strings for backward compatibility
     const diagnosisString = formData.diagnoses.join(', ');
     const procedureString = formData.procedures.join(', ');
     
    if (editingCase && onUpdate) {
      let updates: Partial<SurgicalCase> = {
        patientName: formData.patientName,
        age: parseInt(formData.age),
        sex: formData.sex,
        origin: formData.origin || undefined,
        placeOfResidence: formData.placeOfResidence,
        diagnosis: diagnosisString,
        procedure: procedureString,
        doctor: doctorName,
        specialty: formData.specialty,
        date: formData.date,
        time: formData.time || undefined,
        fastingTime: formData.fastingTime || undefined,
        contactDetails: formData.contactDetails,
        isReferral: formData.isReferral,
        referralDetails: formData.referralDetails || undefined,
        patientType: formData.patientType,
        admissionSource: (formData.patientType === 'admission' || formData.patientType === 'daycase') ? formData.admissionSource : undefined,
        priority: formData.priority,
        status: formData.status,
        caseType: formData.caseType,
        notes: formData.notes,
        wardNumber: formData.wardNumber || undefined
      };

      if (formData.status === 'cancelled') {
        updates.cancellationReason = formData.cancellationReason;
        if (formData.newDate) {
          // Add current cancellation to history
          const currentCancellation = {
            reason: formData.cancellationReason,
            originalDate: editingCase.date,
            cancelledAt: new Date().toISOString()
          };
          
          updates.cancellationHistory = [
            ...(editingCase.cancellationHistory || []),
            currentCancellation
          ];
          
          updates.date = formData.newDate;
          updates.rebookCount = editingCase.rebookCount + 1;
          updates.status = 'scheduled'; // Automatically change status to scheduled when rebooked
          updates.cancellationReason = undefined; // Clear current cancellation reason since it's now in history
        }
      }

      if (formData.status === 'deferred') {
        updates.deferralReason = formData.deferralReason;
        if (formData.newDate) {
          updates.date = formData.newDate;
          updates.rebookCount = editingCase.rebookCount + 1;
        }
      } else if (editingCase.status === 'deferred' && formData.status === 'scheduled') {
        // When changing from deferred back to scheduled, clear current deferral reason
        // but keep the deferral history
        updates.deferralReason = undefined;
      }

      // If rescheduling (changing date or time), increment rebook count
      if (formData.status !== 'deferred' && (editingCase.date !== formData.date || (editingCase.time || '') !== formData.time)) {
        updates.rebookCount = editingCase.rebookCount + 1;
      }

      onUpdate(updates);
    } else {
      const caseData = {
        patientName: formData.patientName,
        age: parseInt(formData.age),
        sex: formData.sex,
        origin: formData.origin || undefined,
        placeOfResidence: formData.placeOfResidence,
        diagnosis: diagnosisString,
        procedure: procedureString,
        doctor: doctorName,
        specialty: formData.specialty,
        date: formData.date,
        time: formData.time || undefined,
        fastingTime: formData.fastingTime || undefined,
        contactDetails: formData.contactDetails,
        isReferral: formData.isReferral,
        referralDetails: formData.referralDetails || undefined,
        patientType: formData.patientType,
        admissionSource: (formData.patientType === 'admission' || formData.patientType === 'daycase') ? formData.admissionSource : undefined,
        priority: formData.priority,
        status: formData.status,
        caseType: formData.caseType,
        confirmedOnOTList: false,
        rebookCount: 0,
        cancellationHistory: [],
        deferralHistory: [],
        notes: formData.notes,
        wardNumber: formData.wardNumber || undefined
      };
      onSave(caseData);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingCase ? 'Edit Surgical Case' : 'Add New Surgical Case'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="150"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.sex}
                  onChange={(e) => setFormData({...formData, sex: e.target.value as 'male' | 'female'})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  placeholder="Patient's place of origin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Place of Residence</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.placeOfResidence}
                  onChange={(e) => setFormData({...formData, placeOfResidence: e.target.value})}
                  placeholder="Current place of residence (optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Details (Optional)</label>
                <input
                  type="text"
                  placeholder="Phone number or emergency contact"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.contactDetails}
                  onChange={(e) => setFormData({...formData, contactDetails: e.target.value})}
                />
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnoses</label>
                
                {/* Selected Diagnoses Display */}
                {formData.diagnoses.length > 0 && (
                  <div className="mt-2 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.diagnoses.map((diagnosis, index) => (
                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          <span>{diagnosis}</span>
                          <button
                            type="button"
                            onClick={() => removeDiagnosis(index)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add Diagnosis Section */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <select
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedDiagnosis}
                        onChange={(e) => {
                          setSelectedDiagnosis(e.target.value);
                          if (e.target.value !== 'custom') {
                            setCustomDiagnosis('');
                          }
                        }}
                      >
                        <option value="">Select a diagnosis</option>
                        {COMMON_DIAGNOSES.map(diagnosis => (
                          <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                        ))}
                        <option value="custom">Custom diagnosis...</option>
                      </select>
                    </div>
                    
                    <div>
                      <select
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedDiagnosisSide}
                        onChange={(e) => setSelectedDiagnosisSide(e.target.value as 'left' | 'right' | 'bilateral' | 'n/a')}
                      >
                        <option value="n/a">No side specification</option>
                        <option value="left">Left side</option>
                        <option value="right">Right side</option>
                        <option value="bilateral">Bilateral (both sides)</option>
                      </select>
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        placeholder="Additional info (optional)"
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={diagnosisAdditionalInfo}
                        onChange={(e) => setDiagnosisAdditionalInfo(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {selectedDiagnosis === 'custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom diagnosis"
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={customDiagnosis}
                      onChange={(e) => setCustomDiagnosis(e.target.value)}
                    />
                  )}
                  
                  <button
                    type="button"
                    onClick={addDiagnosis}
                    disabled={!selectedDiagnosis || (selectedDiagnosis === 'custom' && !customDiagnosis.trim())}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Diagnosis</span>
                  </button>
                </div>
                
                {formData.diagnoses.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">At least one diagnosis is required</p>
                )}
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Procedures</label>
                
                {/* Selected Procedures Display */}
                {formData.procedures.length > 0 && (
                  <div className="mt-2 mb-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.procedures.map((procedure, index) => (
                        <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          <span>{procedure}</span>
                          <button
                            type="button"
                            onClick={() => removeProcedure(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add Procedure Section */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <select
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedProcedure}
                        onChange={(e) => {
                          setSelectedProcedure(e.target.value);
                          if (e.target.value !== 'custom') {
                            setCustomProcedure('');
                          }
                        }}
                      >
                        <option value="">Select a procedure</option>
                        {COMMON_PROCEDURES.map(procedure => (
                          <option key={procedure} value={procedure}>{procedure}</option>
                        ))}
                        <option value="custom">Custom procedure...</option>
                      </select>
                    </div>
                    
                    <div>
                      <select
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedSide}
                        onChange={(e) => setSelectedSide(e.target.value as 'left' | 'right' | 'bilateral' | 'n/a')}
                      >
                        <option value="n/a">No side specification</option>
                        <option value="left">Left side</option>
                        <option value="right">Right side</option>
                        <option value="bilateral">Bilateral (both sides)</option>
                      </select>
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        placeholder="Additional info (optional)"
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {selectedProcedure === 'custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom procedure"
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={customProcedure}
                      onChange={(e) => setCustomProcedure(e.target.value)}
                    />
                  )}
                  
                  <button
                    type="button"
                    onClick={addProcedure}
                    disabled={!selectedProcedure || (selectedProcedure === 'custom' && !customProcedure.trim())}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Procedure</span>
                  </button>
                </div>
                
                {formData.procedures.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">At least one procedure is required</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.doctor}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({...formData, doctor: value});
                    if (value === 'other') {
                      setShowCustomDoctor(true);
                    } else {
                      setShowCustomDoctor(false);
                      setCustomDoctor('');
                    }
                  }}
                >
                  <option value="">Select Doctor</option>
                  {DOCTORS.map(doctor => (
                    <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                  ))}
                  <option value="other">Other (Custom)</option>
                </select>
                {showCustomDoctor && (
                  <input
                    type="text"
                    required
                    placeholder="Enter doctor name"
                    className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customDoctor}
                    onChange={(e) => setCustomDoctor(e.target.value)}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialty</label>
                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                >
                  <option value="">Select Specialty</option>
                  {SPECIALTIES.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  required
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 ${
                    isPublicHoliday(formData.date)
                      ? 'border-orange-300 bg-orange-50 focus:ring-orange-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                {isPublicHoliday(formData.date) && (
                  <p className="mt-1 text-sm text-orange-600">
                    ℹ️ {getHolidayName(formData.date)} - Public Holiday (Only emergency cases allowed)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time (Optional)</label>
                <input
                  type="time"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fasting Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.fastingTime}
                  onChange={(e) => setFormData({...formData, fastingTime: e.target.value})}
                  title="Time to commence fasting (e.g., 22:00 for 10 PM)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Select the time when the patient should start fasting
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Type</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.patientType}
                  onChange={(e) => setFormData({...formData, patientType: e.target.value as 'admission' | 'daycase' | 'ward', wardNumber: e.target.value !== 'ward' ? '' : formData.wardNumber})}
                >
                  <option value="admission">Admission</option>
                  <option value="daycase">Day Case</option>
                  <option value="ward">Ward</option>
                </select>
              </div>
              {(formData.patientType === 'admission' || formData.patientType === 'daycase') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.patientType === 'admission' ? 'Admission Source' : 'Day Case Source'}
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.admissionSource}
                    onChange={(e) => setFormData({...formData, admissionSource: e.target.value as 'sopc' | 'oncology'})}
                  >
                    <option value="sopc">SOPC (Surgical Outpatient Clinic)</option>
                    <option value="oncology">Oncology Clinic</option>
                  </select>
                </div>
              )}
              {formData.patientType === 'ward' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ward Number</label>
                  <select
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.wardNumber}
                    onChange={(e) => setFormData({...formData, wardNumber: e.target.value})}
                  >
                    <option value="">Select Ward</option>
                    <option value="5">Ward 5</option>
                    <option value="4">Ward 4</option>
                    <option value="6">Ward 6</option>
                    <option value="2">Ward 2</option>
                    <option value="ED">ED</option>
                    <option value="ICU">ICU</option>
                    <option value="SCN">SCN</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Case Type</label>
                <select
                  required
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 ${
                    isPublicHoliday(formData.date)
                      ? 'border-orange-300 bg-orange-50 focus:ring-orange-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  value={formData.caseType}
                  onChange={(e) => setFormData({...formData, caseType: e.target.value as 'elective' | 'emergency'})}
                  disabled={isPublicHoliday(formData.date)}
                >
                  {!isPublicHoliday(formData.date) && <option value="elective">Elective (Booked)</option>}
                  <option value="emergency">Emergency</option>
                </select>
                {isPublicHoliday(formData.date) && (
                  <p className="mt-1 text-sm text-orange-600">
                    Only emergency cases can be booked on public holidays
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'scheduled' | 'cancelled' | 'completed'})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="deferred">Deferred</option>
                </select>
              </div>
            </div>

            {formData.status === 'cancelled' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cancellation Reason</label>
                  <select
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.cancellationReason}
                    onChange={(e) => setFormData({...formData, cancellationReason: e.target.value})}
                  >
                    <option value="">Select Reason</option>
                    {CANCELLATION_REASONS.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rebook Date (Optional)</label>
                  <input
                    type="date"
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 ${
                      formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'elective'
                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                        : formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'emergency'
                        ? 'border-orange-300 bg-orange-50 focus:ring-orange-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    value={formData.newDate}
                    onChange={(e) => setFormData({...formData, newDate: e.target.value})}
                  />
                  {formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'elective' && (
                    <p className="mt-1 text-sm text-red-600">
                      ⚠️ {getHolidayName(formData.newDate)} - Public Holiday (Cannot reschedule elective cases to this date)
                    </p>
                  )}
                  {formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'emergency' && (
                    <p className="mt-1 text-sm text-orange-600">
                      ℹ️ {getHolidayName(formData.newDate)} - Public Holiday (Emergency cases allowed)
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    If provided, the case will be automatically rescheduled to this date and rebook count will be incremented.
                  </p>
                </div>
              </div>
            )}

            {formData.status === 'deferred' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deferral Reason</label>
                  <select
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.deferralReason}
                    onChange={(e) => setFormData({...formData, deferralReason: e.target.value})}
                  >
                    <option value="">Select Reason</option>
                    {DEFERRAL_REASONS.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Date (Optional)</label>
                  <input
                    type="date"
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 ${
                      formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'elective'
                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                        : formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'emergency'
                        ? 'border-orange-300 bg-orange-50 focus:ring-orange-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    value={formData.newDate}
                    onChange={(e) => setFormData({...formData, newDate: e.target.value})}
                  />
                  {formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'elective' && (
                    <p className="mt-1 text-sm text-red-600">
                      ⚠️ {getHolidayName(formData.newDate)} - Public Holiday (Cannot reschedule elective cases to this date)
                    </p>
                  )}
                  {formData.newDate && isPublicHoliday(formData.newDate) && formData.caseType === 'emergency' && (
                    <p className="mt-1 text-sm text-orange-600">
                      ℹ️ {getHolidayName(formData.newDate)} - Public Holiday (Emergency cases allowed)
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    If provided, the case will be automatically rescheduled to this date and rebook count will be incremented.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="priority"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.checked})}
              />
              <label htmlFor="priority" className="text-sm font-medium text-gray-700">
                Priority Case
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="confirmedOnOTList"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.confirmedOnOTList}
                onChange={(e) => setFormData({...formData, confirmedOnOTList: e.target.checked})}
              />
              <label htmlFor="confirmedOnOTList" className="text-sm font-medium text-gray-700">
                Confirmed on OT List
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isReferral"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.isReferral}
                onChange={(e) => setFormData({...formData, isReferral: e.target.checked})}
              />
              <label htmlFor="isReferral" className="text-sm font-medium text-gray-700">
                Referral Case
              </label>
            </div>

            {formData.isReferral && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Referral Details</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.referralDetails}
                  onChange={(e) => setFormData({...formData, referralDetails: e.target.value})}
                  placeholder="Referring hospital, doctor, and reason for referral..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes or comments..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formData.diagnoses.length === 0 || formData.procedures.length === 0}
                className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 ${
                  formData.diagnoses.length === 0 || formData.procedures.length === 0
                    ? 'text-gray-500 bg-gray-300 cursor-not-allowed'
                    : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {editingCase ? 'Update Case' : 'Add Case'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};