/*
  # Update Supabase tables for current application requirements

  1. Table Updates
    - Ensure all required columns exist in surgical_cases table
    - Add any missing indexes for performance
    - Update constraints and defaults

  2. Deferral History Table
    - Ensure deferral_history table exists with proper structure
    - Add foreign key relationships
    - Set up proper indexes

  3. Security
    - Ensure RLS is enabled on all tables
    - Update policies for proper access control

  4. Data Integrity
    - Add proper constraints
    - Set appropriate defaults
    - Ensure data types match application expectations
*/

-- Ensure surgical_cases table has all required columns
DO $$
BEGIN
  -- Add case_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'case_type'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN case_type text DEFAULT 'elective';
    ALTER TABLE surgical_cases ADD CONSTRAINT surgical_cases_case_type_check 
      CHECK (case_type = ANY (ARRAY['elective'::text, 'emergency'::text]));
  END IF;

  -- Add synced column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'synced'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN synced boolean DEFAULT true;
  END IF;

  -- Ensure confirmed_on_ot_list has proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'confirmed_on_ot_list'
  ) THEN
    ALTER TABLE surgical_cases ALTER COLUMN confirmed_on_ot_list SET DEFAULT false;
  END IF;

  -- Ensure priority has proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'priority'
  ) THEN
    ALTER TABLE surgical_cases ALTER COLUMN priority SET DEFAULT false;
  END IF;

  -- Ensure is_referral has proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'is_referral'
  ) THEN
    ALTER TABLE surgical_cases ALTER COLUMN is_referral SET DEFAULT false;
  END IF;

  -- Ensure rebook_count has proper default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'rebook_count'
  ) THEN
    ALTER TABLE surgical_cases ALTER COLUMN rebook_count SET DEFAULT 0;
  END IF;
END $$;

-- Create deferral_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS deferral_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL,
  reason text NOT NULL,
  original_date text NOT NULL,
  deferred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'deferral_history_case_id_fkey'
  ) THEN
    ALTER TABLE deferral_history 
    ADD CONSTRAINT deferral_history_case_id_fkey 
    FOREIGN KEY (case_id) REFERENCES surgical_cases(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS on deferral_history
ALTER TABLE deferral_history ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deferral_history_case_id ON deferral_history(case_id);
CREATE INDEX IF NOT EXISTS idx_deferral_history_deferred_at ON deferral_history(deferred_at);

-- Add missing indexes on surgical_cases if they don't exist
CREATE INDEX IF NOT EXISTS idx_surgical_cases_case_type ON surgical_cases(case_type);
CREATE INDEX IF NOT EXISTS idx_surgical_cases_synced ON surgical_cases(synced);

-- Create RLS policies for deferral_history
DROP POLICY IF EXISTS "Authenticated users can view all deferral history" ON deferral_history;
CREATE POLICY "Authenticated users can view all deferral history"
  ON deferral_history
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert deferral history" ON deferral_history;
CREATE POLICY "Authenticated users can insert deferral history"
  ON deferral_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update deferral history" ON deferral_history;
CREATE POLICY "Authenticated users can update deferral history"
  ON deferral_history
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete deferral history" ON deferral_history;
CREATE POLICY "Authenticated users can delete deferral history"
  ON deferral_history
  FOR DELETE
  TO authenticated
  USING (true);

-- Update existing surgical_cases to have proper defaults for new columns
UPDATE surgical_cases 
SET case_type = 'elective' 
WHERE case_type IS NULL;

UPDATE surgical_cases 
SET synced = true 
WHERE synced IS NULL;

UPDATE surgical_cases 
SET confirmed_on_ot_list = false 
WHERE confirmed_on_ot_list IS NULL;

UPDATE surgical_cases 
SET priority = false 
WHERE priority IS NULL;

UPDATE surgical_cases 
SET is_referral = false 
WHERE is_referral IS NULL;

UPDATE surgical_cases 
SET rebook_count = 0 
WHERE rebook_count IS NULL;