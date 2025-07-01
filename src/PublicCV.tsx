import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import ReelCVTemplate from './components/public/ReelCVTemplate';
import { generateMockReelPassScore } from './utils/mockReelPassData';
import { Card, Button } from './components/ui';
import { Globe } from 'lucide-react';
import { 
  ReelAppsMainLink, 
  ReelCVDirectLink
} from './components/ui';

interface PublicLinkRow {
  candidate_id: string;
  view_count: number;
}

interface CandidateProfile {
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const PublicCV: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!slug) return;
      
      try {
        // Get candidate ID from public link
        const { data: linkData, error: linkError } = await supabase
          .from('public_cv_links')
          .select('candidate_id, view_count')
          .eq('slug', slug)
          .eq('revoked', false)
          .maybeSingle<PublicLinkRow>();

        if (linkError || !linkData) {
          setError('This portfolio link is invalid or has expired.');
          setLoading(false);
          return;
        }

        setCandidateId(linkData.candidate_id);

        // Increment view count
        await supabase
          .from('public_cv_links')
          .update({ view_count: (linkData.view_count || 0) + 1 })
          .eq('slug', slug);

        // Fetch candidate profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', linkData.candidate_id)
          .maybeSingle();

        if (!profileError && profileData) {
          setProfile(profileData);
        }

      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setError('Failed to load portfolio data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !candidateId || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-center p-4">
        <Card className="max-w-md bg-slate-800/50 border-slate-700/50">
          <div className="p-8">
            <Globe size={48} className="mx-auto text-slate-400 mb-4" />
            <h1 className="text-xl font-bold mb-3 text-white">Portfolio Not Found</h1>
            <p className="mb-6 text-slate-400">{error || 'This portfolio link is invalid or has expired.'}</p>
            <div className="space-y-3">
              <Button as="a" href="https://reelcv.reelapps.co.za" variant="primary">
                Create Your ReelCV
              </Button>
              <div className="text-sm text-slate-500">
                <ReelAppsMainLink className="text-blue-400 hover:text-blue-300" /> - 
                The future of talent management
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Generate ReelPass score data for the candidate
  const reelPassScore = generateMockReelPassScore();
  
  // Use the new ReelCV template with ReelPass scoring
  return (
    <ReelCVTemplate 
      profile={profile}
      reelPassScore={reelPassScore}
      slug={slug || ''}
    />
  );
};

export default PublicCV;