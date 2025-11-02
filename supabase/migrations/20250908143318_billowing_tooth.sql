/*
  # Add case type column to surgical_cases table

  1. New Columns
    - `case_type` (text) - Indicates whether the case is 'elective' or 'emergency'
      - Default value: 'elective'
      - Check constraint to ensure only valid values

  2. Data Migration
    - Set all existing cases to 'elective' as default
    - Emergency cases can be updated manually or through the application

  3. Security
    - No changes to RLS policies needed as this is just an additional column
*/

-- Add the case_type column with default value
ALTER TABLE surgical_cases 
ADD COLUMN IF NOT EXISTS case_type text DEFAULT 'elective';

-- Add check constraint to ensure only valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'surgical_cases_case_type_check' 
    AND table_name = 'surgical_cases'
  ) THEN
    ALTER TABLE surgical_cases 
    ADD CONSTRAINT surgical_cases_case_type_check 
    CHECK (case_type = ANY (ARRAY['elective'::text, 'emergency'::text]));
  END IF;
END $$;

-- Update existing records to have 'elective' as default (if any nulls exist)
UPDATE surgical_cases 
SET case_type = 'elective' 
WHERE case_type IS NULL;