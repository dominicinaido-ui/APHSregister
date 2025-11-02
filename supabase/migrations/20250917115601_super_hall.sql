/*
  # Add confirmed_on_ot_list column to surgical_cases table

  1. Changes
    - Add `confirmed_on_ot_list` boolean column to `surgical_cases` table
    - Set default value to `false`
    - Make column nullable to allow for existing records

  2. Notes
    - This column tracks whether a case has been confirmed on the Operating Theatre list
    - Existing records will default to `false` (not confirmed)
    - The application uses this for checkbox functionality in the UI
*/

-- Add the confirmed_on_ot_list column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'confirmed_on_ot_list'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN confirmed_on_ot_list boolean DEFAULT false;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_surgical_cases_confirmed_on_ot_list 
ON surgical_cases (confirmed_on_ot_list);