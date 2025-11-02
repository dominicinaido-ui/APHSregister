/*
  # Update surgical cases table with missing columns and features

  1. New Columns
    - `confirmed_on_ot_list` (boolean) - tracks if case is confirmed on OT list
    - `case_type` (text) - distinguishes between 'elective' and 'emergency' cases
    - `synced` (boolean) - tracks synchronization status
  
  2. Security
    - Maintain existing RLS policies
    - Add indexes for new columns for better performance
  
  3. Data Integrity
    - Add constraints for case_type values
    - Set appropriate default values
    - Ensure backward compatibility
*/

-- Add missing columns to surgical_cases table
DO $$
BEGIN
  -- Add confirmed_on_ot_list column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'confirmed_on_ot_list'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN confirmed_on_ot_list boolean DEFAULT false;
  END IF;

  -- Add case_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'case_type'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN case_type text DEFAULT 'elective';
  END IF;

  -- Add synced column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'synced'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN synced boolean DEFAULT true;
  END IF;
END $$;

-- Add constraint for case_type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'surgical_cases' AND constraint_name = 'surgical_cases_case_type_check'
  ) THEN
    ALTER TABLE surgical_cases ADD CONSTRAINT surgical_cases_case_type_check 
    CHECK (case_type IN ('elective', 'emergency'));
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surgical_cases_confirmed_on_ot_list 
ON surgical_cases (confirmed_on_ot_list);

CREATE INDEX IF NOT EXISTS idx_surgical_cases_case_type 
ON surgical_cases (case_type);

CREATE INDEX IF NOT EXISTS idx_surgical_cases_synced 
ON surgical_cases (synced);

-- Update existing records to have proper case_type values
UPDATE surgical_cases 
SET case_type = 'elective' 
WHERE case_type IS NULL;

-- Update existing records to have confirmed_on_ot_list as false
UPDATE surgical_cases 
SET confirmed_on_ot_list = false 
WHERE confirmed_on_ot_list IS NULL;

-- Update existing records to have synced as true
UPDATE surgical_cases 
SET synced = true 
WHERE synced IS NULL;