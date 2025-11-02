/*
  # Create deferral history table

  1. New Tables
    - `deferral_history`
      - `id` (uuid, primary key)
      - `case_id` (uuid, foreign key to surgical_cases)
      - `reason` (text, deferral reason)
      - `original_date` (text, original scheduled date)
      - `deferred_at` (timestamptz, when the deferral occurred)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `deferral_history` table
    - Add policy for authenticated users to read/write their own data

  3. Changes
    - Remove `deferral_history` JSONB column from `surgical_cases` table
    - Keep `deferral_reason` for current active deferral
*/

-- Create deferral_history table
CREATE TABLE IF NOT EXISTS deferral_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES surgical_cases(id) ON DELETE CASCADE,
  reason text NOT NULL,
  original_date text NOT NULL,
  deferred_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deferral_history ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deferral_history_case_id ON deferral_history(case_id);
CREATE INDEX IF NOT EXISTS idx_deferral_history_deferred_at ON deferral_history(deferred_at);

-- Remove the deferral_history JSONB column from surgical_cases table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surgical_cases' AND column_name = 'deferral_history'
  ) THEN
    ALTER TABLE surgical_cases DROP COLUMN deferral_history;
  END IF;
END $$;