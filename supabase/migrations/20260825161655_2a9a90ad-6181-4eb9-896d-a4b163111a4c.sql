ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS contact_heading text NOT NULL DEFAULT 'Let''s build something with data',
  ADD COLUMN IF NOT EXISTS contact_description text NOT NULL DEFAULT 'Open to data science, machine learning and analytics roles, internships and collaborations.',
  ADD COLUMN IF NOT EXISTS contact_note text NOT NULL DEFAULT '';