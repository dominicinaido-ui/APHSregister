/*
  # Add place_of_residence column to surgical_cases table

  1. Changes
    - Add `place_of_residence` column to `surgical_cases` table
    - Column is optional (nullable) to allow for backward compatibility with existing records
    - Represents the current place of residence of the patient

  2. Notes
    - This column was referenced in the frontend code but missing from the database schema
    - Existing records will have NULL values for this column, which is acceptable
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'place_of_residence'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN place_of_residence text;
  END IF;
END $$;