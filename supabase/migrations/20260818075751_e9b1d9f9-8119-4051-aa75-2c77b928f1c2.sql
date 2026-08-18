
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILE (singleton)
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  avatar_url text,
  stat_projects text NOT NULL DEFAULT '3+',
  stat_internships text NOT NULL DEFAULT '1',
  stat_cgpa text NOT NULL DEFAULT '8.2',
  stat_certifications text NOT NULL DEFAULT '6',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  proficiency int NOT NULL DEFAULT 80,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL DEFAULT '',
  period text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT '{}',
  tech text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  location text NOT NULL DEFAULT '',
  period text NOT NULL DEFAULT '',
  score text NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL DEFAULT '',
  issued_on text NOT NULL DEFAULT '',
  credential_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT '',
  period text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  problem text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  implementation text NOT NULL DEFAULT '',
  outcome text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  tech_stack text[] NOT NULL DEFAULT '{}',
  cover_url text,
  demo_url text,
  github_url text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  media_type text NOT NULL DEFAULT 'image',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'Resume',
  file_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text NOT NULL DEFAULT 'Pavithra K — AI & Data Science Portfolio',
  meta_description text NOT NULL DEFAULT '',
  default_theme text NOT NULL DEFAULT 'dark',
  contact_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTS + RLS
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profile','social_links','skill_categories','skills','experiences','education','certifications','achievements','projects','project_media','resumes','messages','site_settings']
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "admin manages %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', t);
    EXECUTE format('CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t);
  END LOOP;
END $$;

REVOKE SELECT ON public.messages FROM anon;

-- Public read policies (published content only)
CREATE POLICY "public reads profile" ON public.profile FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public reads resumes" ON public.resumes FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "public reads social" ON public.social_links FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads skill_categories" ON public.skill_categories FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads skills" ON public.skills FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads experiences" ON public.experiences FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads education" ON public.education FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads certifications" ON public.certifications FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads projects" ON public.projects FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "public reads project_media" ON public.project_media FOR SELECT TO anon, authenticated USING (is_published);

-- Anyone may send a contact message
GRANT INSERT ON public.messages TO anon;
CREATE POLICY "anyone can send a message" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- SEED
INSERT INTO public.profile (full_name, headline, tagline, about, email, phone, location, stat_projects, stat_internships, stat_cgpa, stat_certifications)
VALUES (
 'Pavithra K',
 'Aspiring Data Scientist & AI Engineer',
 'Turning complex data into meaningful insights and intelligent systems that create measurable impact.',
 'I am a final-year B.Tech student in Artificial Intelligence and Data Science at Velammal Engineering College, with a strong foundation in machine learning, data analytics and full-stack engineering. I build end-to-end systems — from data pipelines and model training to production dashboards and web applications — with a focus on real-world outcomes such as safety, revenue insight and operational speed.',
 'pavithrakumar2605@gmail.com','9360992523','Chennai, Tamil Nadu','3','1','8.2','6');

INSERT INTO public.site_settings (meta_description) VALUES ('AI & Data Science portfolio of Pavithra K — machine learning projects, analytics case studies, experience and resume.');

INSERT INTO public.social_links (platform, url, sort_order) VALUES
 ('LinkedIn','https://linkedin.com/in/pavithra-k-189104300',1),
 ('GitHub','https://github.com/pavithrakumar2625',2),
 ('Email','mailto:pavithrakumar2605@gmail.com',3);

INSERT INTO public.skill_categories (id, name, description, sort_order) VALUES
 ('11111111-1111-4111-8111-111111111111','Programming','Languages used day to day for modelling, analysis and product work.',1),
 ('22222222-2222-4222-8222-222222222222','Machine Learning & AI','Model development, evaluation and deep learning frameworks.',2),
 ('33333333-3333-4333-8333-333333333333','Data & Analytics','Databases, querying, BI and reporting.',3),
 ('44444444-4444-4444-8444-444444444444','Engineering & Tools','Web, version control and developer tooling.',4);

INSERT INTO public.skills (category_id, name, proficiency, sort_order) VALUES
 ('11111111-1111-4111-8111-111111111111','Python',92,1),
 ('11111111-1111-4111-8111-111111111111','SQL',88,2),
 ('11111111-1111-4111-8111-111111111111','R',72,3),
 ('11111111-1111-4111-8111-111111111111','JavaScript / TypeScript',75,4),
 ('11111111-1111-4111-8111-111111111111','Java (basics)',60,5),
 ('22222222-2222-4222-8222-222222222222','Scikit-learn',88,1),
 ('22222222-2222-4222-8222-222222222222','TensorFlow / Keras',80,2),
 ('22222222-2222-4222-8222-222222222222','LSTM & Time Series',78,3),
 ('22222222-2222-4222-8222-222222222222','Decision Trees & Ensembles',82,4),
 ('33333333-3333-4333-8333-333333333333','Pandas / NumPy',90,1),
 ('33333333-3333-4333-8333-333333333333','PostgreSQL / MySQL',85,2),
 ('33333333-3333-4333-8333-333333333333','Power BI',84,3),
 ('33333333-3333-4333-8333-333333333333','Matplotlib',80,4),
 ('33333333-3333-4333-8333-333333333333','Excel (Pivot, VLOOKUP)',82,5),
 ('44444444-4444-4444-8444-444444444444','Flask',80,1),
 ('44444444-4444-4444-8444-444444444444','React / Next.js',74,2),
 ('44444444-4444-4444-8444-444444444444','Node.js (Express)',70,3),
 ('44444444-4444-4444-8444-444444444444','Git & GitHub',86,4),
 ('44444444-4444-4444-8444-444444444444','Docker',65,5),
 ('44444444-4444-4444-8444-444444444444','Jupyter / VS Code',90,6);

INSERT INTO public.experiences (role_title, company, location, period, summary, highlights, tech, sort_order) VALUES
 ('Machine Learning & Data Science Intern','Virtual Tech Services','Remote','11/2024 – 12/2024',
  'Worked with real-world healthcare datasets to build and evaluate classification models for tumour detection.',
  ARRAY['Performed data preprocessing, feature scaling and exploratory data analysis.','Built and evaluated Random Forest, Logistic Regression and Linear Regression models to classify tumours.','Extracted actionable insights through data visualisation and rigorous performance evaluation.'],
  ARRAY['Python','Scikit-learn','Pandas','Matplotlib'],1);

INSERT INTO public.education (degree, institution, location, period, score, details, sort_order) VALUES
 ('B.Tech — Artificial Intelligence and Data Science','Velammal Engineering College','Chennai, Tamil Nadu','2022 – 2026','CGPA 8.2/10','Coursework across machine learning, database management, data analytics and AI/ML implementation.',1),
 ('HSC','Govt. Hr. Sec. School, Balapuram (West)','Chennai, Tamil Nadu','2021 – 2022','79.5%','Secured second position in school in the Class 12 Board Examinations.',2);

INSERT INTO public.certifications (title, issuer, issued_on, sort_order) VALUES
 ('Database Management','Coursework','2024',1),
 ('Python 101','Coursework','2023',2),
 ('Python for Data Science','Coursework','2024',3),
 ('AIML Implementation','Coursework','2025',4),
 ('SQL','Coursework','2024',5),
 ('Java Prodigy','Coursework','2023',6);

INSERT INTO public.achievements (title, description, year, sort_order) VALUES
 ('1st place (x3) — District-level speech competitions','Won first place three times, demonstrating strong verbal communication and presentation skills.','2019–2022',1),
 ('School second position — Class 12 Boards','Ranked second in school in the Class 12 Board Examinations.','2022',2),
 ('CODETHON 2023 — Preliminary round','Participated in the preliminary round of CODETHON 2023.','2023',3),
 ('Symposium participant','Participated in the symposium conducted by Saveetha Engineering College.','2023',4);

INSERT INTO public.projects (title, slug, category, period, short_description, full_description, problem, solution, implementation, outcome, features, tech_stack, is_featured, sort_order, demo_url, github_url) VALUES
 ('CoastalGuard — Maritime Surveillance & Predictive Alert System','coastalguard','Deep Learning · Full-Stack','11/2025 – 03/2026',
  'An AI-driven maritime surveillance system that predicts potential maritime border breaches using LSTM models and alerts fishermen in real time.',
  'CoastalGuard combines vessel trajectory modelling, GPS tracking and live weather data into a single operational surveillance platform for coastal safety authorities and fishermen.',
  'Fishermen frequently cross maritime boundaries unintentionally due to poor situational awareness, leading to detentions and loss of livelihood. Authorities lack a predictive early-warning system.',
  'An LSTM-based sequence model learns normal vessel movement patterns and flags trajectories likely to breach the boundary, fused with GPS position and weather risk into a single alert score.',
  'Data pipelines in Pandas/NumPy prepare trajectory sequences; TensorFlow/Keras LSTM models are trained and served through a Flask API backed by MySQL. A responsive dashboard renders live vessel positions, weather overlays and alert history.',
  'Delivered a full-stack ML solution with real-time monitoring and analytics, giving authorities proactive warnings instead of after-the-fact reports.',
  ARRAY['LSTM models detect suspicious vessel movement patterns','GPS tracking fused with live weather data','Real-time alerting for fishermen safety','Scalable Flask backend with analytics dashboard'],
  ARRAY['Python','TensorFlow','Keras','Scikit-learn','Pandas','NumPy','Flask','MySQL','HTML','CSS','JavaScript','Bootstrap'], true, 1, null, 'https://github.com/pavithrakumar2625'),
 ('Retail Customer Behavior Analytics System','retail-customer-analytics','Data Analytics · Business Intelligence','10/2025 – 01/2026',
  'End-to-end analytics on 3,900+ retail transactions to uncover purchasing patterns, segment customers and drive data-informed decisions.',
  'A complete analytics workflow spanning data cleaning, feature engineering, advanced SQL analysis and executive Power BI dashboards.',
  'Retail teams held large volumes of transactional data but no reliable view of customer segments, revenue drivers or product performance.',
  'A reproducible analytics pipeline that cleans and engineers features in Python, models behaviour segments, and surfaces insights through interactive dashboards.',
  'Preprocessing and feature engineering in Pandas; advanced PostgreSQL queries for revenue trends, cohort behaviour and product performance; Power BI dashboards for stakeholders.',
  'Improved customer segmentation across 3,900+ transactions and enabled data-driven decisions on pricing, promotion and inventory.',
  ARRAY['Analysis of 3,900+ customer transactions','Customer segmentation and behaviour modelling','Advanced SQL revenue and product analysis','Interactive Power BI executive dashboards'],
  ARRAY['Python','Scikit-learn','Pandas','NumPy','MySQL','PostgreSQL','Power BI'], true, 2, null, 'https://github.com/pavithrakumar2625'),
 ('Qelp — AI-Powered Feedback & Bug Triage Platform','qelp','Applied AI · Product Engineering','01/2026 – 03/2026',
  'An AI feedback platform that captures, classifies and triages client bug reports using asynchronous LLM analysis and automated priority scoring.',
  'Qelp shortens agency response time by turning noisy client feedback into structured, prioritised, routable tickets.',
  'Agencies receive bug reports across scattered channels with inconsistent detail, making triage slow and priorities subjective.',
  'A structured intake layer with screenshot capture and voice notes, paired with async LLM classification that assigns category, severity and priority automatically.',
  'TypeScript/Node.js (Express) services with PostgreSQL storage, a Next.js/React client, OpenAI and Groq models for classification, containerised with Docker and shipped through GitHub Actions.',
  'Faster, consistent triage with automated priority scoring and richer bug context captured at the point of report.',
  ARRAY['Real-time intake with screenshot capture and voice notes','Async LLM-based classification and triage','Automated priority scoring','Dockerised delivery with GitHub Actions CI'],
  ARRAY['TypeScript','Node.js','Express','PostgreSQL','Next.js','React','Docker','GitHub Actions','OpenAI','Groq'], true, 3, null, 'https://github.com/pavithrakumar2625');
