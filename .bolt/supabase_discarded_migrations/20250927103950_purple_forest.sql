/*
  # Add closed fracture diagnosis

  1. New Diagnosis
    - Add "Closed fracture" to the diagnoses table
    - Categorized under Orthopedic Surgery
  
  2. Security
    - Uses existing RLS policies for authenticated users
*/

INSERT INTO diagnoses (name, category) 
VALUES ('Closed fracture', 'Orthopedic Surgery')
ON CONFLICT (name) DO NOTHING;