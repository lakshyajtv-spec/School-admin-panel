-- ==========================================================================
-- GOVT. BOYS H. S. SCHOOL CANTT, GUNA — Supabase Database Schema
-- ==========================================================================
-- Run this SQL inside the Supabase SQL Editor (https://app.supabase.com)
-- to create all tables, storage buckets, and RLS policies.
-- ==========================================================================

-- ========================= ENUM TYPES ========================= 
CREATE TYPE entity_type AS ENUM ('teachers','gallery','notices','facilities','achievements','vocational_courses');

-- ========================= WEBSITE SETTINGS ========================= 
CREATE TABLE IF NOT EXISTS website_settings (
  id              INTEGER PRIMARY KEY CHECK (id = 1),  -- singleton row
  school_name     TEXT NOT NULL DEFAULT 'Govt. Boys H. S. School Cantt, Guna',
  school_name_caps TEXT NOT NULL DEFAULT 'GOVT. BOYS H. S. SCHOOL',
  school_place    TEXT NOT NULL DEFAULT 'Cantt, Guna',
  logo_url        TEXT NOT NULL DEFAULT '',
  favicon         TEXT NOT NULL DEFAULT '',
  address         TEXT NOT NULL DEFAULT 'Cantt Area, Guna, MP - 473001',
  phone           TEXT NOT NULL DEFAULT '',
  email           TEXT NOT NULL DEFAULT '',
  map_embed       TEXT NOT NULL DEFAULT '',
  footer_about    TEXT NOT NULL DEFAULT 'A government higher secondary school in Guna (M.P.) working under the EFA initiative.',
  footer_dev_credit TEXT NOT NULL DEFAULT 'Website Designed & Developed by Lakshya Jatav',
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- seed the singleton
INSERT INTO website_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ========================= SOCIAL LINKS ========================= 
CREATE TABLE IF NOT EXISTS social_links (
  id        SERIAL PRIMARY KEY,
  platform  TEXT NOT NULL DEFAULT '',
  url       TEXT NOT NULL DEFAULT '',
  position  INTEGER NOT NULL DEFAULT 0
);

-- ========================= TEACHERS ========================= 
CREATE TABLE IF NOT EXISTS teachers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL DEFAULT '',
  photo           TEXT NOT NULL DEFAULT '',
  subject         TEXT NOT NULL DEFAULT '',
  designation     TEXT NOT NULL DEFAULT '',
  qualification   TEXT NOT NULL DEFAULT '',
  experience      TEXT NOT NULL DEFAULT '',
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ========================= GALLERY ========================= 
CREATE TABLE IF NOT EXISTS gallery (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT 'campus',
  title       TEXT NOT NULL DEFAULT '',
  caption     TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ========================= NOTICES ========================= 
CREATE TABLE IF NOT EXISTS notices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag         TEXT NOT NULL DEFAULT '',
  notice_date TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  pinned      BOOLEAN DEFAULT false,
  important   BOOLEAN DEFAULT false,
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ========================= FACILITIES ========================= 
CREATE TABLE IF NOT EXISTS facilities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name   TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  meta_badge  TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ========================= ACHIEVEMENTS ========================= 
CREATE TABLE IF NOT EXISTS achievements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period      TEXT NOT NULL DEFAULT '',
  tag         TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ========================= VOCATIONAL SECTION ========================= 
CREATE TABLE IF NOT EXISTS vocational_section (
  id        INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow  TEXT NOT NULL DEFAULT 'NSQF Skill Education',
  title    TEXT NOT NULL DEFAULT 'Vocational',
  highlight TEXT NOT NULL DEFAULT 'Education',
  description TEXT NOT NULL DEFAULT 'Vocational education starts from Class 9.'
);
INSERT INTO vocational_section (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ========================= VOCATIONAL COURSES ========================= 
CREATE TABLE IF NOT EXISTS vocational_courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL DEFAULT '',
  tagline       TEXT NOT NULL DEFAULT '',
  intro         TEXT NOT NULL DEFAULT '',
  eligibility   TEXT NOT NULL DEFAULT '',
  duration      TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ========================= VOCATIONAL SUBJECTS ========================= 
CREATE TABLE IF NOT EXISTS vocational_subjects (
  id        SERIAL PRIMARY KEY,
  course_id UUID REFERENCES vocational_courses(id) ON DELETE CASCADE,
  subject   TEXT NOT NULL DEFAULT ''
);

-- ========================= VOCATIONAL CERTIFICATES ========================= 
CREATE TABLE IF NOT EXISTS vocational_certificates (
  id        SERIAL PRIMARY KEY,
  course_id UUID REFERENCES vocational_courses(id) ON DELETE CASCADE,
  certificate TEXT NOT NULL DEFAULT ''
);

-- ========================= VOCATIONAL SKILLS ========================= 
CREATE TABLE IF NOT EXISTS vocational_skills (
  id        SERIAL PRIMARY KEY,
  course_id UUID REFERENCES vocational_courses(id) ON DELETE CASCADE,
  skill     TEXT NOT NULL DEFAULT ''
);

-- ========================= VOCATIONAL CAREERS ========================= 
CREATE TABLE IF NOT EXISTS vocational_careers (
  id        SERIAL PRIMARY KEY,
  course_id UUID REFERENCES vocational_courses(id) ON DELETE CASCADE,
  career    TEXT NOT NULL DEFAULT ''
);

-- ========================= HERO SECTION ========================= 
CREATE TABLE IF NOT EXISTS hero_section (
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  badge_text    TEXT NOT NULL DEFAULT 'Government of Madhya Pradesh · District Guna',
  title_a       TEXT NOT NULL DEFAULT 'Welcome to',
  title_highlight TEXT NOT NULL DEFAULT 'Govt. Boys H. S. School',
  title_b       TEXT NOT NULL DEFAULT 'Cantt, Guna',
  subtitle      TEXT NOT NULL DEFAULT '',
  explore_btn   TEXT NOT NULL DEFAULT 'Explore Campus',
  card_title    TEXT NOT NULL DEFAULT '',
  card_subtitle TEXT NOT NULL DEFAULT '',
  float_label_a TEXT NOT NULL DEFAULT 'Students',
  float_label_b TEXT NOT NULL DEFAULT 'Vocational Trades',
  badge1        TEXT NOT NULL DEFAULT 'EFA Government School',
  badge2        TEXT NOT NULL DEFAULT 'MPBSE Curriculum',
  badge3        TEXT NOT NULL DEFAULT 'Class 1 – 12',
  bg_image_url  TEXT NOT NULL DEFAULT '',
  card_image_url TEXT NOT NULL DEFAULT ''
);
INSERT INTO hero_section (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ========================= MARQUEE ITEMS ========================= 
CREATE TABLE IF NOT EXISTS hero_marquee (
  id    SERIAL PRIMARY KEY,
  text  TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0
);

-- ========================= PRINCIPAL ========================= 
CREATE TABLE IF NOT EXISTS principal (
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  name          TEXT NOT NULL DEFAULT 'Principal',
  designation   TEXT NOT NULL DEFAULT '',
  quote_a       TEXT NOT NULL DEFAULT '',
  quote_b       TEXT NOT NULL DEFAULT '',
  paragraph1    TEXT NOT NULL DEFAULT '',
  paragraph2    TEXT NOT NULL DEFAULT '',
  photo_url     TEXT NOT NULL DEFAULT '',
  note          TEXT NOT NULL DEFAULT 'Name and photograph to be updated by school office'
);
INSERT INTO principal (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ========================= STORAGE BUCKET ========================= 
-- Run this separately via Supabase Dashboard → Storage
-- Create a bucket named 'school-media' with public access
-- INSERT INTO storage.buckets (id, name, public) VALUES ('school-media','school-media',true);

-- ========================= RLS POLICIES ========================= 
-- Enable RLS on all tables and allow public read + authenticated write
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocational_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocational_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocational_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocational_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocational_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocational_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_marquee ENABLE ROW LEVEL SECURITY;
ALTER TABLE principal ENABLE ROW LEVEL SECURITY;

-- ======== READ policies (anon can read everything) ========
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'website_settings','social_links','teachers','gallery','notices',
      'facilities','achievements','vocational_section','vocational_courses',
      'vocational_subjects','vocational_certificates','vocational_skills',
      'vocational_careers','hero_section','hero_marquee','principal'
    ])
  LOOP
    EXECUTE format('CREATE POLICY "anon_read_%s" ON %I FOR SELECT USING (true)', tbl, tbl);
  END LOOP;
END;
$$;

-- ======== WRITE policies (anon can insert/update/delete — adjustable later) ========
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'website_settings','social_links','teachers','gallery','notices',
      'facilities','achievements','vocational_section','vocational_courses',
      'vocational_subjects','vocational_certificates','vocational_skills',
      'vocational_careers','hero_section','hero_marquee','principal'
    ])
  LOOP
    EXECUTE format('CREATE POLICY "anon_insert_%s" ON %I FOR INSERT WITH CHECK (true)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_update_%s" ON %I FOR UPDATE USING (true)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_delete_%s" ON %I FOR DELETE USING (true)', tbl, tbl);
  END LOOP;
END;
$$;

-- ===== STORAGE POLICY =====
-- (Run separately in Storage → Policies)
-- CREATE POLICY "public_read_school_media" ON storage.objects FOR SELECT USING (bucket_id='school-media');
-- CREATE POLICY "anon_insert_school_media" ON storage.objects FOR INSERT WITH CHECK (bucket_id='school-media');
-- CREATE POLICY "anon_delete_school_media" ON storage.objects FOR DELETE USING (bucket_id='school-media');
