/*
  # Setup Authentication for Surgical Case Register

  1. Authentication Setup
    - Enable email/password authentication
    - Create surgeon user account
    - Setup user roles and permissions

  2. Security
    - Update RLS policies to require authentication
    - Ensure only authenticated users can access surgical cases
*/

-- Enable email/password authentication (this is typically enabled by default in Supabase)
-- The user creation will be done through the Supabase dashboard or auth API

-- Update RLS policies to require authentication
DROP POLICY IF EXISTS "Anonymous users can manage surgical cases" ON surgical_cases;
DROP POLICY IF EXISTS "Authenticated users can manage surgical cases" ON surgical_cases;

-- Create new policies that require authentication
CREATE POLICY "Authenticated users can view all surgical cases"
  ON surgical_cases
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert surgical cases"
  ON surgical_cases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update surgical cases"
  ON surgical_cases
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete surgical cases"
  ON surgical_cases
  FOR DELETE
  TO authenticated
  USING (true);

-- Create a function to check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;