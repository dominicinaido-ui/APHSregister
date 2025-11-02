/*
  # Fix spelling of Exploratory laparotomy

  1. Updates
    - Fix spelling from "Eploratory laparotomy" to "Exploratory laparotomy" in procedures table
    - Update any existing surgical cases that use the misspelled procedure name

  2. Security
    - No changes to RLS policies needed
*/

-- Update the procedure name in the procedures table
UPDATE procedures 
SET name = 'Exploratory laparotomy'
WHERE name = 'Eploratory laparotomy';

-- Update any existing surgical cases that reference the misspelled procedure
UPDATE surgical_cases 
SET procedure = REPLACE(procedure, 'Eploratory laparotomy', 'Exploratory laparotomy')
WHERE procedure LIKE '%Eploratory laparotomy%';