import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface PortfolioStats {
  totalViews: number;
  profileScore: number;
  skillsFromReelSkills: number;
  projectsFromReelProjects: number;
  linkShares: number;
  profileCompleteness: number;
  skillsData: SkillData[];
  projectsData: ProjectData[];
}

interface SkillData {
  name: string;
  level: string;
  verified: boolean;
  category: string;
  endorsements: number;
  assessmentScore?: number;
}

interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  status: string;
  impact: string;
  link?: string;
  repositoryUrl?: string;
}

export const usePortfolioStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<PortfolioStats>({
    totalViews: 0,
    profileScore: 0,
    skillsFromReelSkills: 0,
    projectsFromReelProjects: 0,
    linkShares: 0,
    profileCompleteness: 0,
    skillsData: [],
    projectsData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadPortfolioStats = async () => {
      try {
        setLoading(true);
        // Using imported supabase client

        // Get total views from all public links
        const { data: linksData } = await supabase
          .from('public_cv_links')
          .select('view_count')
          .eq('candidate_id', userId);

        const totalViews = linksData?.reduce((sum: number, link: any) => sum + (link.view_count || 0), 0) || 0;

        // Get count of active links
        const { data: activeLinksData } = await supabase
          .from('public_cv_links')
          .select('id')
          .eq('candidate_id', userId)
          .eq('revoked', false);

        const linkShares = activeLinksData?.length || 0;

        // Get skills data from candidate_skills table (if it exists)
        let formattedSkills: SkillData[] = [];
        try {
          const { data: skillsData } = await supabase
            .from('candidate_skills')
            .select('*')
            .eq('candidate_id', userId)
            .order('endorsement_count', { ascending: false });

          formattedSkills = skillsData?.map((skill: any) => ({
            name: skill.skill_name,
            level: skill.proficiency_level,
            verified: skill.verified,
            category: skill.skill_category,
            endorsements: skill.endorsement_count || 0,
            assessmentScore: skill.assessment_score
          })) || [];
        } catch (error) {
          console.log('candidate_skills table not found, using empty skills data');
        }

        // Get projects data from candidate_projects table (if it exists)
        let formattedProjects: ProjectData[] = [];
        try {
          const { data: projectsData } = await supabase
            .from('candidate_projects')
            .select('*')
            .eq('candidate_id', userId)
            .eq('project_status', 'completed')
            .order('completion_date', { ascending: false });

          formattedProjects = projectsData?.map((project: any) => ({
            title: project.project_title,
            description: project.project_description || '',
            technologies: Array.isArray(project.technologies) ? project.technologies : [],
            status: project.project_status,
            impact: project.impact_metrics || '',
            link: project.project_url,
            repositoryUrl: project.repository_url
          })) || [];
        } catch (error) {
          console.log('candidate_projects table not found, using empty projects data');
        }

        // Get profile data for completeness calculation - use maybeSingle() to handle missing profiles
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        // Calculate profile completeness
        let completenessScore = 0;
        if (profileData) {
          if (profileData.first_name) completenessScore += 15;
          if (profileData.last_name) completenessScore += 15;
          if (profileData.title) completenessScore += 15;
          if (profileData.bio) completenessScore += 15;
          if (profileData.location) completenessScore += 10;
          if (profileData.email) completenessScore += 10;
          if (profileData.linkedin_url) completenessScore += 5;
          if (profileData.github_url) completenessScore += 5;
          if (profileData.portfolio_url) completenessScore += 5;
          if (formattedSkills.length > 0) completenessScore += 5; // Has skills
        }

        // Calculate portfolio score based on various factors
        const skillsScore = Math.min(30, formattedSkills.length * 2);
        const projectsScore = Math.min(25, formattedProjects.length * 5);
        const viewsScore = Math.min(20, totalViews / 10);
        const endorsementsScore = Math.min(15, formattedSkills.reduce((sum, skill) => sum + skill.endorsements, 0) / 5);
        const verificationScore = Math.min(10, formattedSkills.filter(skill => skill.verified).length * 2);

        const portfolioScore = Math.round(skillsScore + projectsScore + viewsScore + endorsementsScore + verificationScore);

        setStats({
          totalViews,
          profileScore: portfolioScore,
          skillsFromReelSkills: formattedSkills.length,
          projectsFromReelProjects: formattedProjects.length,
          linkShares,
          profileCompleteness: completenessScore,
          skillsData: formattedSkills,
          projectsData: formattedProjects
        });

      } catch (err) {
        console.error('Failed to load portfolio stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioStats();
  }, [userId]);

  const refreshStats = async () => {
    if (userId) {
      setLoading(true);
      // Re-run the effect
      const event = new CustomEvent('refreshStats');
      window.dispatchEvent(event);
    }
  };

  return { stats, loading, error, refreshStats };
};