/*
  # Complete Schema Update for Surgical Case Register

  1. New Columns
    - `confirmed_on_ot_list` (boolean) - Track if case is confirmed on Operating Theatre list
    - `case_type` (text) - Distinguish between 'elective' and 'emergency' cases
    - `synced` (boolean) - Track synchronization status

  2. New Table
    - `deferral_history` - Normalized table for tracking case deferrals

  3. Data Migration
    - Migrate existing JSONB deferral_history data to new table
    - Set appropriate defaults for new columns

  4. Security
    - Enable RLS on new table
    - Add policies for authenticated users

  5. Performance
    - Add indexes for frequently queried columns
*/

-- Add missing columns to surgical_cases table
DO $$
BEGIN
  -- Add confirmed_on_ot_list column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'confirmed_on_ot_list'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN confirmed_on_ot_list boolean DEFAULT false;
  END IF;

  -- Add case_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'case_type'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN case_type text DEFAULT 'elective';
  END IF;

  -- Add synced column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'synced'
  ) THEN
    ALTER TABLE surgical_cases ADD COLUMN synced boolean DEFAULT true;
  END IF;
END $$;

-- Add constraints for new columns
DO $$
BEGIN
  -- Add case_type constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'surgical_cases' AND constraint_name = 'surgical_cases_case_type_check'
  ) THEN
    ALTER TABLE surgical_cases ADD CONSTRAINT surgical_cases_case_type_check 
    CHECK (case_type = ANY (ARRAY['elective'::text, 'emergency'::text]));
  END IF;
END $$;

-- Create deferral_history table
CREATE TABLE IF NOT EXISTS deferral_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES surgical_cases(id) ON DELETE CASCADE,
  reason text NOT NULL,
  original_date text NOT NULL,
  deferred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on deferral_history table
ALTER TABLE deferral_history ENABLE ROW LEVEL SECURITY;

-- Create policies for deferral_history table
CREATE POLICY "Authenticated users can view all deferral history"
  ON deferral_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert deferral history"
  ON deferral_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deferral history"
  ON deferral_history
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deferral history"
  ON deferral_history
  FOR DELETE
  TO authenticated
  USING (true);

-- Migrate existing deferral_history JSONB data to new table
DO $$
DECLARE
  case_record RECORD;
  deferral_record JSONB;
BEGIN
  -- Check if deferral_history column exists before migration
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'deferral_history'
  ) THEN
    -- Migrate data from JSONB column to new table
    FOR case_record IN 
      SELECT id, deferral_history 
      FROM surgical_cases 
      WHERE deferral_history IS NOT NULL AND jsonb_array_length(deferral_history) > 0
    LOOP
      FOR deferral_record IN 
        SELECT * FROM jsonb_array_elements(case_record.deferral_history)
      LOOP
        INSERT INTO deferral_history (case_id, reason, original_date, deferred_at)
        VALUES (
          case_record.id,
          deferral_record->>'reason',
          deferral_record->>'originalDate',
          (deferral_record->>'deferredAt')::timestamptz
        )
        ON CONFLICT DO NOTHING;
      END LOOP;
    END LOOP;

    -- Remove the old JSONB column after successful migration
    ALTER TABLE surgical_cases DROP COLUMN IF EXISTS deferral_history;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surgical_cases_confirmed_on_ot_list 
  ON surgical_cases (confirmed_on_ot_list);

CREATE INDEX IF NOT EXISTS idx_surgical_cases_case_type 
  ON surgical_cases (case_type);

CREATE INDEX IF NOT EXISTS idx_surgical_cases_synced 
  ON surgical_cases (synced);

CREATE INDEX IF NOT EXISTS idx_deferral_history_case_id 
  ON deferral_history (case_id);

CREATE INDEX IF NOT EXISTS idx_deferral_history_deferred_at 
  ON deferral_history (deferred_at);

-- Update existing records with appropriate defaults
UPDATE surgical_cases 
SET 
  confirmed_on_ot_list = false,
  case_type = 'elective',
  synced = true
WHERE 
  confirmed_on_ot_list IS NULL 
  OR case_type IS NULL 
  OR synced IS NULL;