/*
  # Add case_type column to surgical_cases table

  1. New Columns
    - `case_type` (text, default 'elective')
      - Indicates whether the case is elective (booked) or emergency
      - Constrained to only allow 'elective' or 'emergency' values

  2. Data Migration
    - Sets all existing cases to 'elective' as default
    - Ensures no null values exist

  3. Constraints
    - Check constraint to validate only allowed values
    - Default value ensures data consistency
*/

-- Add case_type column with default value and constraint
ALTER TABLE surgical_cases 
ADD COLUMN IF NOT EXISTS case_type text DEFAULT 'elective' 
CHECK (case_type IN ('elective', 'emergency'));

-- Update any existing records that might have null values
UPDATE surgical_cases 
SET case_type = 'elective' 
WHERE case_type IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_surgical_cases_case_type 
ON surgical_cases (case_type);