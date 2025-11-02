/*
  # Make contact_details column optional

  1. Changes
    - Alter `contact_details` column in `surgical_cases` table to be nullable
    - This allows cases to be created without requiring contact details

  2. Notes
    - Previously this was a required field (NOT NULL)
    - Existing records will retain their contact details
*/

DO $$
BEGIN
  ALTER TABLE surgical_cases ALTER COLUMN contact_details DROP NOT NULL;
END $$;