/*
  # Fix Missing Database Schema Issues

  This migration ensures all required tables and columns exist for the ReelCV application.
  
  1. Tables to Create/Fix
    - Ensure `public_cv_links` table exists with all required columns including `view_count`
    - Ensure `candidate_skills` table exists
    - Ensure `candidate_projects` table exists
    - Ensure `portfolio_analytics` table exists
    - Ensure `skill_endorsements` table exists
    - Ensure `portfolio_settings` table exists

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create public_cv_links table if it doesn't exist
CREATE TABLE IF NOT EXISTS public_cv_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  view_count integer DEFAULT 0,
  revoked boolean DEFAULT false,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add view_count column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'public_cv_links' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE public_cv_links ADD COLUMN view_count integer DEFAULT 0;
  END IF;
END $$;

-- Ensure all existing records have view_count = 0 if they were null
UPDATE public_cv_links SET view_count = 0 WHERE view_count IS NULL;

-- Create portfolio_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS portfolio_settings (
  candidate_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  track_analytics boolean DEFAULT true,
  allow_public_indexing boolean DEFAULT false,
  include_reel_skills boolean DEFAULT true,
  include_reel_projects boolean DEFAULT true,
  show_verification_badges boolean DEFAULT true,
  link_expiration text DEFAULT '1-year' CHECK (link_expiration IN ('3-months', '6-months', '1-year', 'never')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidate_skills table if it doesn't exist
CREATE TABLE IF NOT EXISTS candidate_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  skill_category text NOT NULL,
  proficiency_level text NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified boolean DEFAULT false,
  verification_date timestamptz,
  endorsement_count integer DEFAULT 0,
  assessment_score integer CHECK (assessment_score >= 0 AND assessment_score <= 100),
  source text DEFAULT 'reelskills',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, skill_name)
);

-- Create candidate_projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS candidate_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_title text NOT NULL,
  project_description text,
  technologies jsonb DEFAULT '[]'::jsonb,
  project_status text DEFAULT 'completed' CHECK (project_status IN ('planning', 'in-progress', 'completed', 'archived')),
  impact_metrics text,
  project_url text,
  repository_url text,
  start_date date,
  completion_date date,
  source text DEFAULT 'reelprojects',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create portfolio_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS portfolio_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  metric_value integer DEFAULT 0,
  date_recorded date DEFAULT CURRENT_DATE,
  additional_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, metric_type, date_recorded)
);

-- Create skill_endorsements table if it doesn't exist
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES candidate_skills(id) ON DELETE CASCADE,
  endorser_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  endorsement_type text DEFAULT 'peer' CHECK (endorsement_type IN ('peer', 'manager', 'client', 'assessment')),
  endorsement_note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(skill_id, endorser_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public_cv_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can manage own public links" ON public_cv_links;
DROP POLICY IF EXISTS "Public can read active CV links" ON public_cv_links;
DROP POLICY IF EXISTS "Users can manage own portfolio settings" ON portfolio_settings;
DROP POLICY IF EXISTS "Users can read own skills" ON candidate_skills;
DROP POLICY IF EXISTS "Users can manage own skills" ON candidate_skills;
DROP POLICY IF EXISTS "Users can read own projects" ON candidate_projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON candidate_projects;
DROP POLICY IF EXISTS "Users can read own analytics" ON portfolio_analytics;
DROP POLICY IF EXISTS "Users can manage own analytics" ON portfolio_analytics;
DROP POLICY IF EXISTS "Users can read endorsements for their skills" ON skill_endorsements;
DROP POLICY IF EXISTS "Users can endorse others' skills" ON skill_endorsements;

-- RLS Policies for public_cv_links
CREATE POLICY "Users can manage own public links"
  ON public_cv_links
  FOR ALL
  TO authenticated
  USING (auth.uid() = candidate_id);

CREATE POLICY "Public can read active CV links"
  ON public_cv_links
  FOR SELECT
  TO anon, authenticated
  USING (
    revoked = false 
    AND expires_at > now()
  );

-- RLS Policies for portfolio_settings
CREATE POLICY "Users can manage own portfolio settings"
  ON portfolio_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = candidate_id);

-- RLS Policies for candidate_skills
CREATE POLICY "Users can read own skills"
  ON candidate_skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = candidate_id);

CREATE POLICY "Users can manage own skills"
  ON candidate_skills
  FOR ALL
  TO authenticated
  USING (auth.uid() = candidate_id);

-- RLS Policies for candidate_projects
CREATE POLICY "Users can read own projects"
  ON candidate_projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = candidate_id);

CREATE POLICY "Users can manage own projects"
  ON candidate_projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = candidate_id);

-- RLS Policies for portfolio_analytics
CREATE POLICY "Users can read own analytics"
  ON portfolio_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = candidate_id);

CREATE POLICY "Users can manage own analytics"
  ON portfolio_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid() = candidate_id);

-- RLS Policies for skill_endorsements
CREATE POLICY "Users can read endorsements for their skills"
  ON skill_endorsements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM candidate_skills cs 
      WHERE cs.id = skill_endorsements.skill_id 
      AND cs.candidate_id = auth.uid()
    )
  );

CREATE POLICY "Users can endorse others' skills"
  ON skill_endorsements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = endorser_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_public_cv_links_candidate_id ON public_cv_links(candidate_id);
CREATE INDEX IF NOT EXISTS idx_public_cv_links_slug ON public_cv_links(slug);
CREATE INDEX IF NOT EXISTS idx_public_cv_links_active ON public_cv_links(revoked, expires_at) WHERE revoked = false;

CREATE INDEX IF NOT EXISTS idx_portfolio_settings_candidate_id ON portfolio_settings(candidate_id);

CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate_id ON candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_category ON candidate_skills(skill_category);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_verified ON candidate_skills(verified);

CREATE INDEX IF NOT EXISTS idx_candidate_projects_candidate_id ON candidate_projects(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_projects_status ON candidate_projects(project_status);

CREATE INDEX IF NOT EXISTS idx_portfolio_analytics_candidate_id ON portfolio_analytics(candidate_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analytics_type ON portfolio_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_analytics_date ON portfolio_analytics(date_recorded DESC);

CREATE INDEX IF NOT EXISTS idx_skill_endorsements_skill_id ON skill_endorsements(skill_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_portfolio_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_candidate_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_portfolio_settings_updated_at ON portfolio_settings;
DROP TRIGGER IF EXISTS update_candidate_skills_updated_at ON candidate_skills;
DROP TRIGGER IF EXISTS update_candidate_projects_updated_at ON candidate_projects;
DROP TRIGGER IF EXISTS update_endorsement_count_trigger ON skill_endorsements;

-- Create triggers for updated_at
CREATE TRIGGER update_portfolio_settings_updated_at
  BEFORE UPDATE ON portfolio_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_settings_updated_at();

CREATE TRIGGER update_candidate_skills_updated_at
  BEFORE UPDATE ON candidate_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_candidate_data_updated_at();

CREATE TRIGGER update_candidate_projects_updated_at
  BEFORE UPDATE ON candidate_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_candidate_data_updated_at();

-- Function to update endorsement counts
CREATE OR REPLACE FUNCTION update_skill_endorsement_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE candidate_skills 
    SET endorsement_count = endorsement_count + 1 
    WHERE id = NEW.skill_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE candidate_skills 
    SET endorsement_count = GREATEST(0, endorsement_count - 1) 
    WHERE id = OLD.skill_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to automatically update endorsement counts
CREATE TRIGGER update_endorsement_count_trigger
  AFTER INSERT OR DELETE ON skill_endorsements
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_endorsement_count();