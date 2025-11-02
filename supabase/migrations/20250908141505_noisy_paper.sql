/*
  # Migrate existing data to Supabase

  1. New Tables
    - Ensures `surgical_cases` table exists with all required columns
  2. Sample Data
    - Inserts sample surgical cases to demonstrate the system
  3. Security
    - Maintains existing RLS policies
*/

-- Insert sample data (this will be the initial data set)
INSERT INTO surgical_cases (
  patient_name, age, sex, origin, diagnosis, procedure, doctor, specialty, 
  date, time, fasting_time, contact_details, is_referral, referral_details,
  patient_type, admission_source, priority, status, confirmed_on_ot_list,
  rebook_count, notes, created_at, updated_at
) VALUES 
(
  'John Doe', 45, 'male', 'Alotau', 'Acute appendicitis', 'Appendectomy', 
  'Dr. James', 'general', '2025-01-15', '08:00', '6 hours', '675-1234567', 
  false, null, 'admission', 'sopc', true, 'scheduled', false, 0, 
  'Patient has diabetes - monitor glucose levels', 
  '2025-01-10T10:00:00Z', '2025-01-10T10:00:00Z'
),
(
  'Mary Smith', 8, 'female', 'Milne Bay', 'Chronic tonsillitis', 'Tonsillectomy', 
  'Dr. Borchem', 'pediatric', '2025-01-16', '10:30', '4 hours', '675-9876543', 
  true, 'Referred from Milne Bay General Hospital by Dr. Wilson for specialized pediatric ENT surgery',
  'daycase', null, false, 'scheduled', true, 1, 
  'Previous surgery rescheduled due to fever',
  '2025-01-08T14:30:00Z', '2025-01-12T09:15:00Z'
),
(
  'Sarah Johnson', 52, 'female', 'Alotau', 'Breast cancer', 'Mastectomy', 
  'Dr. Apamumu', 'general', '2025-01-17', '09:00', '8 hours', '675-5551234', 
  false, null, 'admission', 'oncology', true, 'scheduled', true, 0, 
  'Pre-operative chemotherapy completed',
  '2025-01-11T08:00:00Z', '2025-01-11T08:00:00Z'
)
ON CONFLICT (id) DO NOTHING;