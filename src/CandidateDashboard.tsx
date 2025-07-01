import React, { useState, useEffect } from 'react';
import { useAuthStore } from './hooks/useAuth';
import { usePortfolioStats } from './hooks/usePortfolioStats';
import { Card, Button } from './components/ui';
import { 
  Share2,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Settings,
  Sparkles,
  Zap,
  BarChart3,
  TrendingUp,
  Award,
  Shield,
  CheckCircle,
  Users
} from 'lucide-react';
import { getSupabaseClient } from './hooks/useAuth';
import { 
  ReelAppsMainLink, 
  ReelSkillsLink, 
  ReelProjectsLink, 
  ReelHunterLink,
  ReelAppsSolutionsLink,
  ReelAppsBlogLink,
  SkillVerificationCTA,
  ProjectShowcaseCTA,
  ReelCVDirectLink
} from './components/ui';
import styles from './CandidateDashboard.module.css';
import RecruiterScorecard from './components/scorecards/RecruiterScorecard';
import ReelPassDashboard from './components/reelpass/ReelPassDashboard';

interface PublicLink {
  url: string;
  slug: string;
  expires_at: string;
  views: number;
  created_at: string;
}

interface PortfolioSettings {
  linkExpiration: string;
  trackAnalytics: boolean;
  allowPublicIndexing: boolean;
  includeReelSkills: boolean;
  includeReelProjects: boolean;
  showVerificationBadges: boolean;
}

const CandidateDashboard: React.FC = () => {
  const { user, profile, logout } = useAuthStore();
  const { stats, loading: statsLoading, refreshStats } = usePortfolioStats(user?.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'reelpass' | 'scorecards' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [publicLink, setPublicLink] = useState<PublicLink | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const [portfolioSettings, setPortfolioSettings] = useState<PortfolioSettings>({
    linkExpiration: '1-year',
    trackAnalytics: true,
    allowPublicIndexing: false,
    includeReelSkills: true,
    includeReelProjects: true,
    showVerificationBadges: true
  });

  // Load dashboard data
  useEffect(() => {
    if (!user) return;
    
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load public link
        await fetchPublicLink();
        
        // Load portfolio settings
        await loadPortfolioSettings();
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const loadPortfolioSettings = async () => {
    if (!user) return;
    
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('portfolio_settings')
        .select('*')
        .eq('candidate_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setPortfolioSettings({
          linkExpiration: data.link_expiration || '1-year',
          trackAnalytics: data.track_analytics ?? true,
          allowPublicIndexing: data.allow_public_indexing ?? false,
          includeReelSkills: data.include_reel_skills ?? true,
          includeReelProjects: data.include_reel_projects ?? true,
          showVerificationBadges: data.show_verification_badges ?? true
        });
      }
    } catch (error) {
      console.error('Failed to load portfolio settings:', error);
    }
  };

  const savePortfolioSettings = async (newSettings: Partial<PortfolioSettings>) => {
    if (!user) return;
    
    setSettingsLoading(true);
    try {
      const updatedSettings = { ...portfolioSettings, ...newSettings };
      
      // Optimistically update the UI
      setPortfolioSettings(updatedSettings);

      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('portfolio_settings')
        .upsert({
          candidate_id: user.id,
          link_expiration: updatedSettings.linkExpiration,
          track_analytics: updatedSettings.trackAnalytics,
          allow_public_indexing: updatedSettings.allowPublicIndexing,
          include_reel_skills: updatedSettings.includeReelSkills,
          include_reel_projects: updatedSettings.includeReelProjects,
          show_verification_badges: updatedSettings.showVerificationBadges,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to save settings:', error);
        // Revert on error
        setPortfolioSettings(portfolioSettings);
      }
    } catch (error) {
      console.error('Failed to save portfolio settings:', error);
      // Revert on error
      setPortfolioSettings(portfolioSettings);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchPublicLink = async () => {
    if (!user) return;
    
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('public_cv_links')
        .select('*')
        .eq('candidate_id', user.id)
        .eq('revoked', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const base = window.location.origin.includes('localhost')
          ? 'http://localhost:5174/public'
          : `${window.location.origin}/public`;
        
        setPublicLink({
          url: `${base}/${data.slug}`,
          slug: data.slug,
          expires_at: data.expires_at,
          views: data.view_count || 0,
          created_at: data.created_at
        });
      }
    } catch (error) {
      console.error('Failed to fetch public link:', error);
    }
  };

  const generateLink = async () => {
    if (!user) return;
    
    setLinkLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // Calculate expiration based on settings
      const expirationDays = portfolioSettings.linkExpiration === '1-year' ? 365 :
                           portfolioSettings.linkExpiration === '6-months' ? 180 :
                           portfolioSettings.linkExpiration === '3-months' ? 90 : 
                           null; // Never expire
      
      const { data, error } = await supabase.functions.invoke('generate-cv-link', {
        body: { 
          expiresInDays: expirationDays,
          settings: portfolioSettings
        },
      });
      
      if (!error && data) {
        const base = window.location.origin.includes('localhost')
          ? 'http://localhost:5174/public'
          : `${window.location.origin}/public`;
        
        setPublicLink({
          url: `${base}/${data.slug}`,
          slug: data.slug,
          expires_at: data.expires_at,
          views: 0,
          created_at: new Date().toISOString()
        });
        
        // Refresh stats after generating new link
        await refreshStats();
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
    }
    setLinkLoading(false);
  };

  const revokeLink = async () => {
    if (!publicLink || !user) return;
    
    setLinkLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('public_cv_links')
        .update({ revoked: true })
        .eq('slug', publicLink.slug)
        .eq('candidate_id', user.id);
        
      if (!error) {
        setPublicLink(null);
        // Refresh stats after revoking link
        await refreshStats();
      } else {
        console.error('Failed to revoke link:', error);
      }
    } catch (error) {
      console.error('Failed to revoke link:', error);
    }
    setLinkLoading(false);
  };

  const handleShareLink = async () => {
    if (!publicLink) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.first_name || 'Professional'}'s Skills Portfolio`,
          text: 'Check out my proven skills and projects portfolio',
          url: publicLink.url,
        });
      } else {
        await navigator.clipboard.writeText(publicLink.url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (error) {
      // Fallback to clipboard copy if share fails
      try {
        await navigator.clipboard.writeText(publicLink.url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

  const handleCopyLink = async () => {
    if (!publicLink) return;
    
    try {
      await navigator.clipboard.writeText(publicLink.url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Toggle component for settings
  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
  }> = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled || settingsLoading}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
        enabled ? 'bg-blue-600' : 'bg-slate-600'
      } ${disabled || settingsLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  if (isLoading || statsLoading) {
    return (
      <div className={styles.dashboard}>
        <div className="max-w-7xl mx-auto p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={styles.title}>
                ReelCV - Professional Profile Hub
              </h1>
              <p className={styles.subtitle}>
                Welcome back, {profile?.first_name || user?.email?.split('@')[0]}! 
                Manage your professional profile, verification status, and recruiter assessments.
              </p>
              <div className="mt-3 text-sm text-slate-400">
                Powered by <ReelAppsMainLink className="text-blue-400 hover:text-blue-300" /> - 
                The complete talent management ecosystem
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className="flex items-center justify-between mb-2">
                <Eye size={20} className="text-blue-400" />
                <TrendingUp size={16} className="text-green-400" />
              </div>
              <div className={styles.statValue}>{stats.totalViews.toLocaleString()}</div>
              <div className={styles.statLabel}>Profile Views</div>
            </div>

            <div className={styles.statCard}>
              <div className="flex items-center justify-between mb-2">
                <Shield size={20} className="text-green-400" />
                <CheckCircle size={16} className="text-green-400" />
              </div>
              <div className={styles.statValue}>85%</div>
              <div className={styles.statLabel}>Verification Score</div>
            </div>

            <div className={styles.statCard}>
              <div className="flex items-center justify-between mb-2">
                <Users size={20} className="text-purple-400" />
                <Award size={16} className="text-purple-400" />
              </div>
              <div className={styles.statValue}>12</div>
              <div className={styles.statLabel}>Recruiter Reviews</div>
            </div>

            <div className={styles.statCard}>
              <div className="flex items-center justify-between mb-2">
                <BarChart3 size={20} className="text-blue-400" />
                <Zap size={16} className="text-green-400" />
              </div>
              <div className={styles.statValue}>{stats.profileCompleteness}%</div>
              <div className={styles.statLabel}>Profile Completeness</div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { key: 'overview', label: 'Portfolio Overview', icon: Globe, description: 'Public profile and sharing' },
            { key: 'reelpass', label: 'ReelPass Verification', icon: Shield, description: 'ID and credential verification' },
            { key: 'scorecards', label: 'Recruiter Scorecards', icon: Award, description: 'Professional assessments' },
            { key: 'settings', label: 'Privacy & Settings', icon: Settings, description: 'Link and privacy controls' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl whitespace-nowrap transition-all min-w-[140px] ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                <Icon size={20} />
                <div className="text-center">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Public CV Link - Main Feature */}
            <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30">
              <div className="text-center py-8">
                <Globe size={48} className="mx-auto text-blue-400 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Your Public Professional Profile</h2>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Share your verified credentials and professional achievements with employers. 
                  Powered by ReelPass verification and integrated with your ReelSkills and ReelProjects portfolios.
                </p>
                
                {publicLink ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 max-w-2xl mx-auto">
                      <input
                        value={publicLink.url}
                        readOnly
                        className="flex-1 bg-transparent text-slate-300 truncate focus:outline-none text-center"
                      />
                      <Button 
                        variant="outline" 
                        size="small" 
                        onClick={handleCopyLink}
                        className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                      >
                        <Copy size={14} className="mr-1" />
                        {shareSuccess ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    
                    <div className="flex gap-3 justify-center flex-wrap">
                      <Button 
                        onClick={handleShareLink} 
                        className="bg-gradient-to-r from-green-600 to-blue-600"
                        disabled={linkLoading}
                      >
                        <Share2 size={16} className="mr-2" />
                        {shareSuccess ? 'Shared!' : 'Share Profile'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(publicLink.url, '_blank')}
                        className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                        disabled={linkLoading}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={revokeLink} 
                        disabled={linkLoading} 
                        className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                      >
                        {linkLoading ? 'Revoking...' : 'Revoke'}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>Views: {publicLink.views} | Created: {new Date(publicLink.created_at).toLocaleDateString()}</p>
                      <p>Expires: {new Date(publicLink.expires_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={generateLink} 
                    disabled={linkLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg"
                  >
                    {linkLoading ? 'Generating...' : 'Generate Public Profile Link'}
                  </Button>
                )}
              </div>
            </Card>

            {/* Integration CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillVerificationCTA />
              <ProjectShowcaseCTA />
            </div>

            {/* ReelApps Ecosystem */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Expand Your Professional Presence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                    <ReelSkillsLink className="text-lg font-semibold mb-2 block text-blue-400" />
                    <p className="text-sm text-slate-400">
                      Verify and showcase your technical skills with video demonstrations.
                    </p>
                  </div>
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                    <ReelProjectsLink className="text-lg font-semibold mb-2 block text-purple-400" />
                    <p className="text-sm text-slate-400">
                      Build and share your professional project portfolio.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'reelpass' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Shield size={48} className="mx-auto text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">ReelPass Verification</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Verify your identity, qualifications, and credentials to build trust with employers. 
                South African government integration for seamless verification.
              </p>
            </div>
            <ReelPassDashboard />
          </div>
        )}

        {activeTab === 'scorecards' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Award size={48} className="mx-auto text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Recruiter Scorecards</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Professional assessments and evaluations from recruiters and hiring managers. 
                Build your reputation through verified feedback and skill assessments.
              </p>
            </div>
            <RecruiterScorecard />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Portfolio Link Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className={styles.settingsCard}>
                <h3 className="text-lg font-bold text-white mb-4">Link Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Link Expiration</label>
                    <select 
                      value={portfolioSettings.linkExpiration}
                      onChange={(e) => savePortfolioSettings({ linkExpiration: e.target.value })}
                      disabled={settingsLoading}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white disabled:opacity-50"
                    >
                      <option value="1-year">1 Year (Recommended)</option>
                      <option value="6-months">6 Months</option>
                      <option value="3-months">3 Months</option>
                      <option value="never">Never Expire</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Track link analytics</span>
                    <ToggleSwitch
                      enabled={portfolioSettings.trackAnalytics}
                      onChange={(enabled) => savePortfolioSettings({ trackAnalytics: enabled })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Allow public indexing</span>
                    <ToggleSwitch
                      enabled={portfolioSettings.allowPublicIndexing}
                      onChange={(enabled) => savePortfolioSettings({ allowPublicIndexing: enabled })}
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-300 mb-2">
                    <strong>Maximize your portfolio impact:</strong>
                  </p>
                  <div className="space-y-1 text-sm">
                    <ReelSkillsLink className="block" />
                    <ReelProjectsLink className="block" />
                  </div>
                </div>
              </Card>

              <Card className={styles.settingsCard}>
                <h3 className="text-lg font-bold text-white mb-4">Data Sources</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Include ReelSkills data</span>
                    <ToggleSwitch
                      enabled={portfolioSettings.includeReelSkills}
                      onChange={(enabled) => savePortfolioSettings({ includeReelSkills: enabled })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Include ReelProjects data</span>
                    <ToggleSwitch
                      enabled={portfolioSettings.includeReelProjects}
                      onChange={(enabled) => savePortfolioSettings({ includeReelProjects: enabled })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Show skill verification badges</span>
                    <ToggleSwitch
                      enabled={portfolioSettings.showVerificationBadges}
                      onChange={(enabled) => savePortfolioSettings({ showVerificationBadges: enabled })}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Settings Info */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <div className="p-6">
                <h3 className="text-lg font-bold text-blue-300 mb-3">Settings Information</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><strong>Link Analytics:</strong> Track views, shares, and engagement metrics for your portfolio</p>
                  <p><strong>Public Indexing:</strong> Allow search engines to discover your portfolio (improves visibility)</p>
                  <p><strong>Data Sources:</strong> Control which platforms contribute to your portfolio showcase</p>
                  <p><strong>Verification Badges:</strong> Display skill verification status from ReelSkills assessments</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-500/20">
                  <p className="text-sm text-blue-300 mb-2">
                    <strong>Need help optimizing your portfolio?</strong>
                  </p>
                  <div className="flex gap-4">
                    <ReelAppsBlogLink className="text-sm" />
                    <ReelAppsMainLink className="text-sm" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Current Link Management */}
            {publicLink && (
              <Card className={styles.settingsCard}>
                <h3 className="text-lg font-bold text-white mb-4">Current Portfolio Link</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <input
                      value={publicLink.url}
                      readOnly
                      className="flex-1 bg-transparent text-slate-300 truncate focus:outline-none"
                    />
                    <Button 
                      variant="outline" 
                      size="small" 
                      onClick={handleCopyLink}
                      className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Copy size={14} className="mr-1" />
                      {shareSuccess ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <div className="text-white">{new Date(publicLink.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Expires:</span>
                      <div className="text-white">{new Date(publicLink.expires_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Views:</span>
                      <div className="text-white">{publicLink.views}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Status:</span>
                      <div className="text-green-400">Active</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => window.open(publicLink.url, '_blank')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      disabled={linkLoading}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Preview Portfolio
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleShareLink}
                      className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                      disabled={linkLoading}
                    >
                      <Share2 size={16} className="mr-2" />
                      {shareSuccess ? 'Shared!' : 'Share Link'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;