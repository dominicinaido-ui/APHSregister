/*
  # Add diagnoses table and update schema

  1. New Tables
    - `diagnoses`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `category` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `diagnoses` table
    - Add policy for authenticated users to read diagnoses
    - Add policy for authenticated users to manage diagnoses

  3. Data Population
    - Insert all common diagnoses with appropriate categories
*/

-- Create diagnoses table
CREATE TABLE IF NOT EXISTS diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view diagnoses"
  ON diagnoses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage diagnoses"
  ON diagnoses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_diagnoses_name ON diagnoses (name);

-- Insert common diagnoses
INSERT INTO diagnoses (name, category) VALUES
  ('Abscess', 'Infectious Disease'),
  ('Achilles tendon injury', 'Orthopedic'),
  ('Acute appendicitis', 'General Surgery'),
  ('Adhesive Bowel Disease', 'General Surgery'),
  ('Anorectal malformation (ARM)', 'Pediatric Surgery'),
  ('Aneurysm false', 'Vascular Surgery'),
  ('Aneurysm true', 'Vascular Surgery'),
  ('Appendiceal mass', 'General Surgery'),
  ('Arterio-Venous fistula', 'Vascular Surgery'),
  ('Backer''s Cyst', 'Orthopedic'),
  ('Balanitis', 'Urology'),
  ('Basal cell carcinoma', 'Oncology'),
  ('Basal skull fracture', 'Neurosurgery'),
  ('Bed sores', 'Plastic Surgery'),
  ('Benign Prostatic Hyperplasia (BPH)', 'Urology'),
  ('Bladder outlet obstruction (BOO)', 'Urology'),
  ('Blunt Abdominal Injury', 'Trauma Surgery'),
  ('Bowel obstruction', 'General Surgery'),
  ('Breast cancer', 'Oncology'),
  ('Burns', 'Plastic Surgery'),
  ('Burst Abdomen', 'General Surgery'),
  ('Carbuncle', 'Infectious Disease'),
  ('Cardiac Injury', 'Cardiothoracic Surgery'),
  ('Carpal Tunnel syndrome', 'Orthopedic'),
  ('Cellulitis', 'Infectious Disease'),
  ('Congenital Talipes Equinovarus (CETV)', 'Orthopedic'),
  ('Cholelithiasis', 'General Surgery'),
  ('Chronic appendicitis', 'General Surgery'),
  ('Cleft Lip', 'Plastic Surgery'),
  ('Cleft palate', 'Plastic Surgery'),
  ('Colles Fracture', 'Orthopedic'),
  ('Colorectal Cancer', 'Oncology'),
  ('Colostomy', 'General Surgery'),
  ('Compartment syndrome', 'Orthopedic'),
  ('Compound fracture', 'Orthopedic'),
  ('Congenital hydrocephalus', 'Neurosurgery'),
  ('Constrictive Pericarditis', 'Cardiothoracic Surgery'),
  ('Contracture', 'Orthopedic'),
  ('Cryptorchidism', 'Pediatric Surgery'),
  ('Cyst', 'General Surgery'),
  ('Cystolithiasis', 'Urology'),
  ('Depressed skull fracture', 'Neurosurgery'),
  ('Dermoid cyst', 'General Surgery'),
  ('Diabetic foot sepsis', 'Infectious Disease'),
  ('Dislocation', 'Orthopedic'),
  ('Diverticulum', 'General Surgery'),
  ('Downs Syndrome', 'Pediatric Surgery'),
  ('Dysphagia', 'General Surgery'),
  ('Empyema', 'Cardiothoracic Surgery'),
  ('Enterocolitis', 'General Surgery'),
  ('Enterocutaneous fistula', 'General Surgery'),
  ('Epigastric hernia', 'General Surgery'),
  ('Epistaxis', 'ENT Surgery'),
  ('Oesophageal tumour', 'Oncology'),
  ('Ewings sarcoma', 'Oncology'),
  ('Exostosis', 'Orthopedic'),
  ('Foreign body', 'General Surgery'),
  ('Fournier''s gangrene', 'Urology'),
  ('Galeazzi fracture', 'Orthopedic'),
  ('Gangrene', 'Vascular Surgery'),
  ('Gastric outlet obstruction', 'General Surgery'),
  ('Granuloma', 'General Surgery'),
  ('Gun shot wound (GSW)', 'Trauma Surgery'),
  ('Head Injury mild', 'Neurosurgery'),
  ('Head Injury moderate', 'Neurosurgery'),
  ('Head Injury severe', 'Neurosurgery'),
  ('Haemangioma', 'Plastic Surgery'),
  ('Haemorrhoids', 'General Surgery'),
  ('Hernia abdominal', 'General Surgery'),
  ('Hirschsprung''s disease (HSD)', 'Pediatric Surgery'),
  ('HSD -Post Swenson''s Pull Through', 'Pediatric Surgery'),
  ('HSD with Colostomy', 'Pediatric Surgery'),
  ('Hydrocele', 'Urology'),
  ('Hydrocephalus', 'Neurosurgery'),
  ('Hypospadias', 'Urology'),
  ('Ileal atresia', 'Pediatric Surgery'),
  ('Ileostomy', 'General Surgery'),
  ('Impending Airway Obstruction', 'ENT Surgery'),
  ('Imperforated Anus', 'Pediatric Surgery'),
  ('Infantile Hypertrophic Pyloric Stenosis', 'Pediatric Surgery'),
  ('Inguinal hernia', 'General Surgery'),
  ('Intussusception', 'Pediatric Surgery'),
  ('Keloid', 'Plastic Surgery'),
  ('K-wires insitu', 'Orthopedic'),
  ('Laceration', 'Trauma Surgery'),
  ('Lesion', 'General Surgery'),
  ('Liver Abscess', 'General Surgery'),
  ('Liver Trauma', 'Trauma Surgery'),
  ('Ludwigs''s angina', 'ENT Surgery'),
  ('Lung fibrosis', 'Cardiothoracic Surgery'),
  ('Malrotation', 'Pediatric Surgery'),
  ('Marjolin''s ulcer', 'Oncology'),
  ('Monteggia fracture', 'Orthopedic'),
  ('Neglected CTEV', 'Orthopedic'),
  ('Neurofibroma', 'Neurosurgery'),
  ('Neurogenic bladder', 'Urology'),
  ('Paraphimosis', 'Urology'),
  ('Paronychia', 'General Surgery'),
  ('Penetrating abdominal Injury', 'Trauma Surgery'),
  ('Penile CA', 'Urology'),
  ('Penile fibroma', 'Urology'),
  ('Perianal Fistula', 'General Surgery'),
  ('Pharyngitis', 'ENT Surgery'),
  ('PR bleeding', 'General Surgery'),
  ('Pregnancy', 'Obstetrics'),
  ('Pressure ulcer', 'Plastic Surgery'),
  ('Pyloric Stenosis', 'Pediatric Surgery'),
  ('Pyomyositis', 'Infectious Disease'),
  ('Rectal lesion', 'General Surgery'),
  ('Rectal polyp', 'General Surgery'),
  ('Rectovaginal fistula', 'Gynecology'),
  ('Retained IDC', 'Urology'),
  ('Spinal injury', 'Neurosurgery'),
  ('Splenic injury', 'Trauma Surgery'),
  ('Thyroglossal cyst', 'ENT Surgery'),
  ('Thyroid tumour', 'ENT Surgery'),
  ('Tracheal injury', 'ENT Surgery'),
  ('Tracheoesophageal Fistula', 'Pediatric Surgery'),
  ('Tumour', 'Oncology'),
  ('Ulcer', 'General Surgery'),
  ('Upper GIT obstruction', 'General Surgery'),
  ('Urethral Stricture', 'Urology'),
  ('Urinary retention', 'Urology'),
  ('Urosepsis', 'Urology'),
  ('Vaginal trauma', 'Gynecology'),
  ('Volvulus', 'General Surgery'),
  ('Wilms Tumour', 'Pediatric Surgery'),
  ('Wound', 'General Surgery'),
  ('Wound breakdown', 'General Surgery')
ON CONFLICT (name) DO NOTHING;