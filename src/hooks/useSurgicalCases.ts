import { useState, useEffect } from 'react';
import { SurgicalCase, ActivityLog } from '../types';
import { supabase } from '../lib/supabase';

export const useSurgicalCases = (logActivity: (activity: Omit<ActivityLog, 'id'>) => void, currentUserUsername: string, isAuthenticated: boolean) => {
  const [cases, setCases] = useState<SurgicalCase[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert database row to SurgicalCase type
  const convertDbRowToCase = (row: any, deferralHistoryMap: Map<string, any[]>): SurgicalCase => {
    const deferralHistory = (deferralHistoryMap.get(row.id) || []).map(dh => ({
      reason: dh.reason,
      originalDate: dh.original_date,
      deferredAt: dh.deferred_at
    }));

    return {
      id: row.id,
      patientName: row.patient_name,
      age: row.age,
      sex: row.sex,
      origin: row.origin,
      placeOfResidence: row.place_of_residence,
      diagnosis: row.diagnosis,
      procedure: row.procedure,
      doctor: row.doctor,
      specialty: row.specialty,
      date: row.date,
      time: row.time,
      fastingTime: row.fasting_time,
      contactDetails: row.contact_details,
      isReferral: row.is_referral,
      referralDetails: row.referral_details,
      patientType: row.patient_type,
      wardNumber: row.ward_number,
      admissionSource: row.admission_source,
      priority: row.priority,
      status: row.status,
      confirmedOnOTList: row.confirmed_on_ot_list,
      cancellationReason: row.cancellation_reason,
      cancellationHistory: row.cancellation_history || [],
      deferralReason: row.deferral_reason,
      deferralHistory: deferralHistory,
      originalDate: row.original_date,
      rebookCount: row.rebook_count,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      caseType: row.case_type || 'elective'
    };
  };

  // Convert SurgicalCase to database row format
  const convertCaseToDbRow = (case_: Omit<SurgicalCase, 'id' | 'createdAt' | 'updatedAt'>) => {
    return {
      patient_name: case_.patientName,
      age: case_.age,
      sex: case_.sex,
      origin: case_.origin,
      place_of_residence: case_.placeOfResidence,
      diagnosis: case_.diagnosis,
      procedure: case_.procedure,
      doctor: case_.doctor,
      specialty: case_.specialty,
      date: case_.date,
      time: case_.time,
      fasting_time: case_.fastingTime,
      contact_details: case_.contactDetails,
      is_referral: case_.isReferral,
      referral_details: case_.referralDetails,
      patient_type: case_.patientType,
      ward_number: case_.wardNumber,
      admission_source: case_.admissionSource,
      priority: case_.priority,
      status: case_.status,
      confirmed_on_ot_list: case_.confirmedOnOTList,
      cancellation_reason: case_.cancellationReason,
      cancellation_history: case_.cancellationHistory,
      deferral_reason: case_.deferralReason,
      original_date: case_.originalDate,
      rebook_count: case_.rebookCount,
      notes: case_.notes,
      case_type: case_.caseType
    };
  };

  const fetchCases = async () => {
    try {
      setLoading(true);

      // Fetch cases and deferral history in parallel
      const [casesResult, deferralResult] = await Promise.all([
        supabase
          .from('surgical_cases')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('deferral_history')
          .select('*')
          .order('deferred_at', { ascending: false })
      ]);

      if (casesResult.error) {
        console.error('Error fetching cases:', casesResult.error);
        return;
      }

      // Build a map of case_id -> deferral history array
      const deferralHistoryMap = new Map<string, any[]>();
      if (deferralResult.data) {
        deferralResult.data.forEach(dh => {
          if (!deferralHistoryMap.has(dh.case_id)) {
            deferralHistoryMap.set(dh.case_id, []);
          }
          deferralHistoryMap.get(dh.case_id)!.push(dh);
        });
      }

      const convertedCases = casesResult.data?.map(row =>
        convertDbRowToCase(row, deferralHistoryMap)
      ) || [];

      setCases(convertedCases);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setCases([]);
      setLoading(false);
      return;
    }

    fetchCases();

    // Subscribe to realtime updates for surgical_cases
    const casesSubscription = supabase
      .channel('surgical_cases_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'surgical_cases' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch deferral history for the new case
            const { data: deferralData } = await supabase
              .from('deferral_history')
              .select('*')
              .eq('case_id', payload.new.id)
              .order('deferred_at', { ascending: false });

            const deferralHistoryMap = new Map<string, any[]>();
            if (deferralData) {
              deferralHistoryMap.set(payload.new.id, deferralData);
            }

            const newCase = convertDbRowToCase(payload.new, deferralHistoryMap);
            setCases(prev => [newCase, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Fetch updated deferral history
            const { data: deferralData } = await supabase
              .from('deferral_history')
              .select('*')
              .eq('case_id', payload.new.id)
              .order('deferred_at', { ascending: false });

            const deferralHistoryMap = new Map<string, any[]>();
            if (deferralData) {
              deferralHistoryMap.set(payload.new.id, deferralData);
            }

            const updatedCase = convertDbRowToCase(payload.new, deferralHistoryMap);
            setCases(prev => prev.map(c => c.id === payload.new.id ? updatedCase : c));
          } else if (payload.eventType === 'DELETE') {
            setCases(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to realtime updates for deferral_history
    const deferralSubscription = supabase
      .channel('deferral_history_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'deferral_history' },
        async (payload) => {
          // Refresh the affected case's deferral history
          const { data: deferralData } = await supabase
            .from('deferral_history')
            .select('*')
            .eq('case_id', payload.new.case_id)
            .order('deferred_at', { ascending: false });

          setCases(prev => prev.map(c => {
            if (c.id === payload.new.case_id) {
              return {
                ...c,
                deferralHistory: deferralData?.map(dh => ({
                  reason: dh.reason,
                  originalDate: dh.original_date,
                  deferredAt: dh.deferred_at
                })) || []
              };
            }
            return c;
          }));
        }
      )
      .subscribe();

    return () => {
      casesSubscription.unsubscribe();
      deferralSubscription.unsubscribe();
    };
  }, [isAuthenticated]);

  const addCase = async (newCase: Omit<SurgicalCase, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const dbRow = convertCaseToDbRow(newCase);
      
      const { data, error } = await supabase
        .from('surgical_cases')
        .insert([dbRow])
        .select()
        .single();

      if (error) {
        console.error('Error adding case:', error);
        return;
      }

      const deferralHistoryMap = new Map<string, any[]>();
      const newCaseWithId = convertDbRowToCase(data, deferralHistoryMap);
      setCases(prev => [newCaseWithId, ...prev]);

      // Log the activity
      logActivity({
        action: 'created',
        patientName: newCaseWithId.patientName,
        changes: 'New case created',
        timestamp: new Date().toISOString(),
        user: currentUserUsername
      });
    } catch (error) {
      console.error('Error adding case:', error);
    }
  };

  // Generate a human-readable description of changes
  const generateChangesDescription = (original: SurgicalCase, updates: Partial<SurgicalCase>): string => {
    const changes: string[] = [];
    
    if (updates.patientName && updates.patientName !== original.patientName) {
      changes.push(`Name: ${original.patientName} → ${updates.patientName}`);
    }
    if (updates.status && updates.status !== original.status) {
      changes.push(`Status: ${original.status} → ${updates.status}`);
    }
    if (updates.date && updates.date !== original.date) {
      changes.push(`Date: ${original.date} → ${updates.date}`);
    }
    if (updates.time && updates.time !== original.time) {
      changes.push(`Time: ${original.time || 'none'} → ${updates.time}`);
    }
    if (updates.doctor && updates.doctor !== original.doctor) {
      changes.push(`Doctor: ${original.doctor} → ${updates.doctor}`);
    }
    if (updates.specialty && updates.specialty !== original.specialty) {
      changes.push(`Specialty: ${original.specialty} → ${updates.specialty}`);
    }
    if (updates.priority !== undefined && updates.priority !== original.priority) {
      changes.push(`Priority: ${original.priority ? 'Yes' : 'No'} → ${updates.priority ? 'Yes' : 'No'}`);
    }
    if (updates.confirmedOnOTList !== undefined && updates.confirmedOnOTList !== original.confirmedOnOTList) {
      changes.push(`OT List: ${original.confirmedOnOTList ? 'Confirmed' : 'Not confirmed'} → ${updates.confirmedOnOTList ? 'Confirmed' : 'Not confirmed'}`);
    }
    if (updates.cancellationReason && updates.cancellationReason !== original.cancellationReason) {
      changes.push(`Cancellation reason: ${updates.cancellationReason}`);
    }
    if (updates.deferralReason && updates.deferralReason !== original.deferralReason) {
      changes.push(`Deferral reason: ${updates.deferralReason}`);
    }
    
    return changes.length > 0 ? changes.join(', ') : 'Minor updates';
  };

  const updateCase = async (id: string, updates: Partial<SurgicalCase>) => {
    try {
      const originalCase = cases.find(c => c.id === id);
      if (!originalCase) {
        console.error('Original case not found');
        return;
      }

      console.log('Updating case:', id, 'with updates:', updates);
      console.log('Original case status:', originalCase.status);

      // Handle deferral history - add to separate table if status is being changed to deferred
      if (updates.status === 'deferred' && updates.deferralReason) {
        console.log('Adding deferral history entry');
        console.log('Original case status:', originalCase.status);
        console.log('New status:', updates.status);
        console.log('Deferral reason:', updates.deferralReason);
        console.log('Original date:', originalCase.date);
        
        try {
          const { error: deferralError } = await supabase
            .from('deferral_history')
            .insert([{
              case_id: id,
              reason: updates.deferralReason,
              original_date: originalCase.date,
              deferred_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }]);

          if (deferralError) {
            console.error('Error adding deferral history:', deferralError);
            console.error('Deferral error details:', deferralError.message, deferralError.details);
          } else {
            console.log('Deferral history added successfully');
          }
        } catch (error) {
          console.error('Error adding deferral history:', error);
        }
      }

      // Convert updates to database format
      const dbUpdates: any = {};
      
      if (updates.patientName !== undefined) dbUpdates.patient_name = updates.patientName;
      if (updates.age !== undefined) dbUpdates.age = updates.age;
      if (updates.sex !== undefined) dbUpdates.sex = updates.sex;
      if (updates.origin !== undefined) dbUpdates.origin = updates.origin;
      if (updates.placeOfResidence !== undefined) dbUpdates.place_of_residence = updates.placeOfResidence;
      if (updates.diagnosis !== undefined) dbUpdates.diagnosis = updates.diagnosis;
      if (updates.procedure !== undefined) dbUpdates.procedure = updates.procedure;
      if (updates.doctor !== undefined) dbUpdates.doctor = updates.doctor;
      if (updates.specialty !== undefined) dbUpdates.specialty = updates.specialty;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.time !== undefined) dbUpdates.time = updates.time;
      if (updates.fastingTime !== undefined) dbUpdates.fasting_time = updates.fastingTime;
      if (updates.contactDetails !== undefined) dbUpdates.contact_details = updates.contactDetails;
      if (updates.isReferral !== undefined) dbUpdates.is_referral = updates.isReferral;
      if (updates.referralDetails !== undefined) dbUpdates.referral_details = updates.referralDetails;
      if (updates.patientType !== undefined) dbUpdates.patient_type = updates.patientType;
      if (updates.wardNumber !== undefined) dbUpdates.ward_number = updates.wardNumber;
      if (updates.admissionSource !== undefined) dbUpdates.admission_source = updates.admissionSource;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.confirmedOnOTList !== undefined) dbUpdates.confirmed_on_ot_list = updates.confirmedOnOTList;
      if (updates.cancellationReason !== undefined) dbUpdates.cancellation_reason = updates.cancellationReason;
      if (updates.cancellationHistory !== undefined) dbUpdates.cancellation_history = updates.cancellationHistory;
      if (updates.deferralReason !== undefined) dbUpdates.deferral_reason = updates.deferralReason;
      if (updates.originalDate !== undefined) dbUpdates.original_date = updates.originalDate;
      if (updates.rebookCount !== undefined) dbUpdates.rebook_count = updates.rebookCount;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.caseType !== undefined) dbUpdates.case_type = updates.caseType;

      // Always update the updated_at timestamp
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('surgical_cases')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating case:', error);
        return;
      }

      // Fetch updated deferral history
      const { data: deferralData } = await supabase
        .from('deferral_history')
        .select('*')
        .eq('case_id', id)
        .order('deferred_at', { ascending: false });

      const deferralHistoryMap = new Map<string, any[]>();
      if (deferralData) {
        deferralHistoryMap.set(id, deferralData);
      }

      const updatedCase = convertDbRowToCase(data, deferralHistoryMap);
      setCases(prev => prev.map(case_ => case_.id === id ? updatedCase : case_));

      // Log the activity
      if (originalCase) {
        const changesDescription = generateChangesDescription(originalCase, updates);
        logActivity({
          action: 'updated',
          patientName: updatedCase.patientName,
          changes: changesDescription,
          timestamp: new Date().toISOString(),
          user: currentUserUsername
        });
      }
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const deleteCase = async (id: string) => {
    try {
      const caseToDelete = cases.find(c => c.id === id);
      
      const { error } = await supabase
        .from('surgical_cases')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting case:', error);
        return;
      }

      setCases(prev => prev.filter(case_ => case_.id !== id));

      // Log the activity
      if (caseToDelete) {
        logActivity({
          action: 'deleted',
          patientName: caseToDelete.patientName,
          changes: 'Case deleted',
          timestamp: new Date().toISOString(),
          user: currentUserUsername
        });
      }
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  return {
    cases,
    loading,
    addCase,
    updateCase,
    deleteCase,
    fetchCases
  };
}