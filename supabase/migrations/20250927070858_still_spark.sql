/*
  # Add procedures table and update schema

  1. New Tables
    - `procedures`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `category` (text, optional)
      - `created_at` (timestamp)

  2. Data Population
    - Insert all the new surgical procedures into the procedures table

  3. Indexes
    - Add index on procedure name for fast lookups
*/

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read procedures
CREATE POLICY "Authenticated users can view procedures"
  ON procedures
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for authenticated users to manage procedures
CREATE POLICY "Authenticated users can manage procedures"
  ON procedures
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_procedures_name ON procedures (name);

-- Insert all the surgical procedures
INSERT INTO procedures (name, category) VALUES
  ('Abbe flap', 'Plastic Surgery'),
  ('Abdominoperineal Resection', 'General Surgery'),
  ('Above knee amputation', 'Orthopedic Surgery'),
  ('Amputation', 'Orthopedic Surgery'),
  ('Anastomosis', 'General Surgery'),
  ('Anoplasty', 'Pediatric Surgery'),
  ('Appendectomy', 'General Surgery'),
  ('Arthrotomy + irrigation', 'Orthopedic Surgery'),
  ('Aspiration', 'General Surgery'),
  ('Axillary clearance', 'General Surgery'),
  ('Axillary Node Biopsy', 'General Surgery'),
  ('Backslab cast', 'Orthopedic Surgery'),
  ('Biopsy', 'General Surgery'),
  ('Bladder repair', 'Urology'),
  ('Bone drilling', 'Orthopedic Surgery'),
  ('Bone graft', 'Orthopedic Surgery'),
  ('Bone nibbling', 'Orthopedic Surgery'),
  ('Bowel resection', 'General Surgery'),
  ('Burr hole', 'Neurosurgery'),
  ('Candle dilatation', 'General Surgery'),
  ('Carpal tunnel release', 'Orthopedic Surgery'),
  ('Cesarean section', 'Obstetrics'),
  ('Change of dressing', 'General Surgery'),
  ('Cholecystectomy', 'General Surgery'),
  ('Circumcision', 'Urology'),
  ('Closed reduction', 'Orthopedic Surgery'),
  ('Colostomy', 'General Surgery'),
  ('Colostomy closure', 'General Surgery'),
  ('Colostomy revision', 'General Surgery'),
  ('Craniectomy', 'Neurosurgery'),
  ('Craniotomy', 'Neurosurgery'),
  ('Curretage', 'Gynecology'),
  ('Cut down', 'General Surgery'),
  ('Cylinder cast', 'Orthopedic Surgery'),
  ('Cystectomy', 'Urology'),
  ('Cystoscopy', 'Urology'),
  ('Cystotomy', 'Urology'),
  ('Darn repair', 'General Surgery'),
  ('Debridemtent', 'General Surgery'),
  ('Debulking', 'General Surgery'),
  ('Decortication', 'Cardiothoracic Surgery'),
  ('Desarda repair', 'General Surgery'),
  ('Dilatation', 'General Surgery'),
  ('Direct Laryngoscopy', 'ENT Surgery'),
  ('Diverting colostomy', 'General Surgery'),
  ('Elevation', 'Orthopedic Surgery'),
  ('End to end anastomosis', 'General Surgery'),
  ('Endoscopy', 'General Surgery'),
  ('Eploratory laparotomy', 'General Surgery'),
  ('Escharotomy', 'Plastic Surgery'),
  ('Excision', 'General Surgery'),
  ('External Fixation', 'Orthopedic Surgery'),
  ('Fasciotomy', 'Orthopedic Surgery'),
  ('First Feet Surgery', 'Orthopedic Surgery'),
  ('Fistulectomy', 'General Surgery'),
  ('Flap', 'Plastic Surgery'),
  ('Forehead flap', 'Plastic Surgery'),
  ('Gastroscopy', 'Gastroenterology'),
  ('Hemicoloectomy', 'General Surgery'),
  ('Hemithyroidectomy', 'General Surgery'),
  ('Hemorrhoidectomy', 'General Surgery'),
  ('Hernioplasty Inguinal', 'General Surgery'),
  ('Herniorrhaphy Inguinal', 'General Surgery'),
  ('Herniotomy Inguinal', 'General Surgery'),
  ('Hypospadias repair', 'Pediatric Surgery'),
  ('Ileostomy', 'General Surgery'),
  ('Ileostomy closure', 'General Surgery'),
  ('Internal iliac ligation', 'General Surgery'),
  ('Jaboulay procedure', 'Urology'),
  ('Janeway feeding gastrostomy', 'General Surgery'),
  ('K wire removal', 'Orthopedic Surgery'),
  ('Karapandzic flap', 'Plastic Surgery'),
  ('Kessler repair', 'Orthopedic Surgery'),
  ('Krakow technique', 'Orthopedic Surgery'),
  ('Ladds procedure', 'Pediatric Surgery'),
  ('Laminectomy', 'Neurosurgery'),
  ('Lay open', 'General Surgery'),
  ('Ligation', 'General Surgery'),
  ('lockwoods repair', 'General Surgery'),
  ('Lumpectomy', 'General Surgery'),
  ('Manipulation under anesthesia (MUA)', 'Orthopedic Surgery'),
  ('Mastectomy', 'General Surgery'),
  ('Mayo repair', 'General Surgery'),
  ('McEvedy approach', 'General Surgery'),
  ('Mesh repair', 'General Surgery'),
  ('Millard repair', 'Plastic Surgery'),
  ('Neck dissection', 'ENT Surgery'),
  ('Nephrectomy', 'Urology'),
  ('Nephrostomy', 'Urology'),
  ('Olecranon Pin Insertion', 'Orthopedic Surgery'),
  ('Open reduction and internal fixation (ORIF)', 'Orthopedic Surgery'),
  ('Open reduction and internal fixation (ORIF) +  K-wire', 'Orthopedic Surgery'),
  ('Open reduction and internal fixation (ORIF) + K-nail', 'Orthopedic Surgery'),
  ('Open reduction and internal fixation (ORIF) + Plate & Screw', 'Orthopedic Surgery'),
  ('Open reduction and internal fixation (ORIF) + Rush Pin', 'Orthopedic Surgery'),
  ('Open reduction and internal fixation (ORIF) + TBW', 'Orthopedic Surgery'),
  ('Orchidectomy', 'Urology'),
  ('Orchidoplexy', 'Urology'),
  ('Osteotomy', 'Orthopedic Surgery'),
  ('Pericardial stripping', 'Cardiothoracic Surgery'),
  ('Polypectomy', 'General Surgery'),
  ('POP Window', 'Orthopedic Surgery'),
  ('Posterior Sagittal Anorectoplasty (PSARP)', 'Pediatric Surgery'),
  ('Proctoscopy', 'General Surgery'),
  ('Prostatectomy', 'Urology'),
  ('Prostectomy', 'Urology'),
  ('Proximal Control', 'General Surgery'),
  ('Radial head resection', 'Orthopedic Surgery'),
  ('Radial nerve exploration', 'Orthopedic Surgery'),
  ('Ramstedt''s Pyloromyotomy', 'Pediatric Surgery'),
  ('Ray Amputation', 'Orthopedic Surgery'),
  ('Rectal washout', 'General Surgery'),
  ('Removal', 'General Surgery'),
  ('Rhinoplasty', 'Plastic Surgery'),
  ('Rotational flap', 'Plastic Surgery'),
  ('Seton suture', 'General Surgery'),
  ('Side to side anastomosis', 'General Surgery'),
  ('Sigmoidosopy', 'General Surgery'),
  ('Sistrunk procedure', 'General Surgery'),
  ('Skin traction', 'Orthopedic Surgery'),
  ('Skull Traction', 'Orthopedic Surgery'),
  ('Splenectomy', 'General Surgery'),
  ('SSG', 'Plastic Surgery'),
  ('Stricturoplasty', 'General Surgery'),
  ('Superficial parotidectomy', 'ENT Surgery'),
  ('Suprapubic catheter (SPC)', 'Urology'),
  ('Suturing', 'General Surgery'),
  ('Swenson''s Pullthrough', 'Pediatric Surgery'),
  ('Tendon repair', 'Orthopedic Surgery'),
  ('Tension band wire (TBW)', 'Orthopedic Surgery'),
  ('Thiersch suturing', 'General Surgery'),
  ('Thoracotomy anterolateral', 'Cardiothoracic Surgery'),
  ('Thoracotomy posterolateral', 'Cardiothoracic Surgery'),
  ('Tibial steinman pin insertion', 'Orthopedic Surgery'),
  ('Total laryngectomy', 'ENT Surgery'),
  ('Tracheostomy', 'ENT Surgery'),
  ('Transanal endorectal pullthorugh (TAERPT)', 'Pediatric Surgery'),
  ('Under water seal drain (UWSD)', 'Cardiothoracic Surgery'),
  ('Urethroplasty', 'Urology'),
  ('Urethroplasty + Glendoplasty + meatoplasty', 'Urology'),
  ('Urethrostomy', 'Urology'),
  ('Von Langerback repair', 'General Surgery'),
  ('VP shunt', 'Neurosurgery'),
  ('Wash out', 'General Surgery'),
  ('Wide excision', 'General Surgery'),
  ('Witzel tube', 'General Surgery'),
  ('Z plasty', 'Plastic Surgery')
ON CONFLICT (name) DO NOTHING;