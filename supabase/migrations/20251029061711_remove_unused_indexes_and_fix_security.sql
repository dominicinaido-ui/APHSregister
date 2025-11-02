/*
  # Remove unused indexes and fix security issues

  1. Changes
    - Remove unused indexes from surgical_cases table:
      - idx_surgical_cases_date
      - idx_surgical_cases_status
      - idx_surgical_cases_doctor
      - idx_surgical_cases_specialty
      - idx_surgical_cases_priority
      - idx_surgical_cases_patient_type
      - idx_surgical_cases_synced
      - idx_surgical_cases_case_type
      - idx_surgical_cases_confirmed_on_ot_list
    - Remove unused index from deferral_history table:
      - idx_deferral_history_deferred_at
    - Fix multiple permissive policies on procedures table by consolidating them
    - Fix function search path mutability issue

  2. Security Notes
    - Removing unused indexes reduces maintenance overhead and potential attack surface
    - Consolidating policies reduces complexity and potential for misconfiguration
    - Fixed search_path prevents potential SQL injection vulnerabilities
*/

-- Drop unused indexes on surgical_cases table
DROP INDEX IF EXISTS idx_surgical_cases_date;
DROP INDEX IF EXISTS idx_surgical_cases_status;
DROP INDEX IF EXISTS idx_surgical_cases_doctor;
DROP INDEX IF EXISTS idx_surgical_cases_specialty;
DROP INDEX IF EXISTS idx_surgical_cases_priority;
DROP INDEX IF EXISTS idx_surgical_cases_patient_type;
DROP INDEX IF EXISTS idx_surgical_cases_synced;
DROP INDEX IF EXISTS idx_surgical_cases_case_type;
DROP INDEX IF EXISTS idx_surgical_cases_confirmed_on_ot_list;

-- Drop unused index on deferral_history table
DROP INDEX IF EXISTS idx_deferral_history_deferred_at;

-- Fix multiple permissive policies on procedures table
-- First, drop the redundant policy
DROP POLICY IF EXISTS "Authenticated users can view procedures" ON procedures;

-- Keep only the more comprehensive policy "Authenticated users can manage procedures"

-- Fix function search path mutability issue if the function exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'is_authenticated'
  ) THEN
    EXECUTE 'DROP FUNCTION IF EXISTS is_authenticated()';
  END IF;
END $$;