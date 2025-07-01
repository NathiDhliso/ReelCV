import React from 'react';
import { Card, Button } from '../ui';
import { 
  Award, 
  Star, 
  Target, 
  Briefcase, 
  Brain, 
  BookOpen, 
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Calendar,
  MapPin,
  Mail,
  Linkedin,
  Github,
  Users,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import { ReelPassScore, ProjectSkillDemo, getScoreLevel } from '../../types/reelpass';
import { 
  ReelAppsMainLink, 
  ReelSkillsLink, 
  ReelProjectsLink, 
  ReelHunterLink,
  ReelCVDirectLink
} from '../ui';

interface ReelCVTemplateProps {
  profile: {
    first_name: string;
    last_name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
  };
  reelPassScore: ReelPassScore;
  slug: string;
}

const ReelCVTemplate: React.FC<ReelCVTemplateProps> = ({ 
  profile, 
  reelPassScore, 
  slug 
}) => {
  const scoreLevel = getScoreLevel(reelPassScore.totalScore);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'enterprise': return 'text-purple-400 bg-purple-500/20';
      case 'large': return 'text-blue-400 bg-blue-500/20';
      case 'medium': return 'text-green-400 bg-green-500/20';
      case 'small': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'significant': return 'text-purple-400';
      case 'high': return 'text-blue-400';
      case 'medium': return 'text-green-400';
      case 'low': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-4">
            <Shield size={16} />
            ReelPass Verified Professional Profile
          </div>
          <div className="text-xs text-slate-500">
            Powered by <ReelAppsMainLink className="text-blue-400 hover:text-blue-300" /> | 
            Create yours at <ReelCVDirectLink className="text-blue-400 hover:text-blue-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Header */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    <p className="text-xl text-blue-300 mb-3">{profile.title}</p>
                    <p className="text-slate-300 mb-4 max-w-2xl">{profile.bio}</p>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-slate-400">
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {profile.location}
                        </div>
                      )}
                      {profile.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          {profile.email}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {profile.linkedin_url && (
                      <Button 
                        as="a" 
                        href={profile.linkedin_url} 
                        target="_blank"
                        variant="outline"
                        size="small"
                        className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                      >
                        <Linkedin size={16} />
                      </Button>
                    )}
                    {profile.github_url && (
                      <Button 
                        as="a" 
                        href={profile.github_url} 
                        target="_blank"
                        variant="outline"
                        size="small"
                        className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                      >
                        <Github size={16} />
                      </Button>
                    )}
                    {profile.portfolio_url && (
                      <Button 
                        as="a" 
                        href={profile.portfolio_url} 
                        target="_blank"
                        variant="outline"
                        size="small"
                        className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* ReelPass Score Card */}
            <Card className={`border-2 ${scoreLevel.bgColor.replace('bg-', 'border-').replace('/20', '/50')}`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${scoreLevel.bgColor} rounded-xl flex items-center justify-center`}>
                      <Award className={`w-8 h-8 ${scoreLevel.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">ReelPass Score</h2>
                      <p className={`text-sm ${scoreLevel.color} font-medium`}>
                        {scoreLevel.level.charAt(0).toUpperCase() + scoreLevel.level.slice(1)} Professional
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${scoreLevel.color}`}>
                      {reelPassScore.totalScore}
                    </div>
                    <div className="text-slate-400 text-sm">out of 1000</div>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-6">{scoreLevel.description}</p>
                
                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {reelPassScore.breakdown.reelProjectsScore}
                    </div>
                    <div className="text-xs text-slate-400">ReelProjects</div>
                    <div className="text-xs text-slate-500">50% weight</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {reelPassScore.breakdown.reelPersonaScore}
                    </div>
                    <div className="text-xs text-slate-400">ReelPersona</div>
                    <div className="text-xs text-slate-500">20% weight</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {reelPassScore.breakdown.foundationalScore}
                    </div>
                    <div className="text-xs text-slate-400">Credentials</div>
                    <div className="text-xs text-slate-500">15% weight</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {reelPassScore.breakdown.experienceScore}
                    </div>
                    <div className="text-xs text-slate-400">Experience</div>
                    <div className="text-xs text-slate-500">10% weight</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">
                      {reelPassScore.breakdown.continuousLearningScore}
                    </div>
                    <div className="text-xs text-slate-400">Learning</div>
                    <div className="text-xs text-slate-500">5% weight</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* ReelProjects Section */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target size={24} className="text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Proven Project Skills</h2>
                  <div className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                    {reelPassScore.breakdown.reelProjectsScore}/500 points
                  </div>
                </div>
                
                {reelPassScore.details.reelProjects.projects.length > 0 ? (
                  <div className="space-y-6">
                    {reelPassScore.details.reelProjects.projects.map((project, index) => (
                      <div key={project.id} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              {project.skillsDemonstrated.map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex}
                                  className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-400">+{project.points}</div>
                            <div className="text-xs text-slate-400">points</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded text-xs ${getComplexityColor(project.complexity)}`}>
                              {project.complexity.charAt(0).toUpperCase() + project.complexity.slice(1)} Scale
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-4 h-4 ${getImpactColor(project.impact)}`} />
                            <span className={`text-sm ${getImpactColor(project.impact)}`}>
                              {project.impact.charAt(0).toUpperCase() + project.impact.slice(1)} Impact
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">
                              {project.vettingMethod.charAt(0).toUpperCase() + project.vettingMethod.slice(1)} Vetted
                            </span>
                          </div>
                        </div>
                        
                        {/* Verification Bonuses */}
                        <div className="flex flex-wrap gap-2">
                          {project.verificationBonuses.externalValidation && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                              ✓ External Validation
                            </span>
                          )}
                          {project.verificationBonuses.liveDemo && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                              ✓ Live Demo
                            </span>
                          )}
                          {project.verificationBonuses.clientTestimonial && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                              ✓ Client Testimonial
                            </span>
                          )}
                          {project.verificationBonuses.communityEngagement && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                              ✓ Community Engagement
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No project demonstrations available yet.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* ReelPersona Section */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Brain size={24} className="text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Work Persona Assessment</h2>
                  <div className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                    {reelPassScore.breakdown.reelPersonaScore}/200 points
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Work-Relevant Traits */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Work Style Strengths</h3>
                    <div className="space-y-3">
                      {Object.entries(reelPassScore.details.reelPersona.personalityTraits.workRelevantTraits).map(([trait, score]) => (
                        <div key={trait} className="flex items-center justify-between">
                          <span className="text-slate-300 capitalize">{trait}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full">
                              <div 
                                className="h-full bg-purple-400 rounded-full"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="text-purple-400 font-medium">{score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Analysis Insights */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">AI-Driven Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Communication Style</div>
                        <div className="text-slate-300 text-sm">
                          {reelPassScore.details.reelPersona.personalityTraits.aiAnalysis.communicationPatterns}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Work Approach</div>
                        <div className="text-slate-300 text-sm">
                          {reelPassScore.details.reelPersona.personalityTraits.aiAnalysis.workStyle}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Key Strengths</div>
                        <div className="flex flex-wrap gap-1">
                          {reelPassScore.details.reelPersona.personalityTraits.aiAnalysis.strengthsIdentified.map((strength, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Score Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Projects</span>
                    <span className="text-blue-300 font-bold">
                      {reelPassScore.details.reelProjects.projects.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Credentials</span>
                    <span className="text-green-300 font-bold">
                      {reelPassScore.details.foundational.credentials.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Experience Areas</span>
                    <span className="text-yellow-300 font-bold">
                      {reelPassScore.details.experience.experienceAreas.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Learning Activities</span>
                    <span className="text-cyan-300 font-bold">
                      {reelPassScore.details.continuousLearning.recentActivities.length}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Credentials */}
            {reelPassScore.details.foundational.credentials.length > 0 && (
              <Card className="bg-slate-800/30 border-slate-700/50">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Verified Credentials</h3>
                  <div className="space-y-3">
                    {reelPassScore.details.foundational.credentials.slice(0, 5).map((credential, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="text-slate-300 text-sm font-medium">{credential.name}</div>
                          <div className="text-slate-500 text-xs">{credential.institution}</div>
                        </div>
                        {credential.verificationStatus === 'verified' && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Contact CTA */}
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <div className="p-6 text-center">
                <Briefcase size={32} className="mx-auto text-blue-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Interested in hiring?</h3>
                <p className="text-slate-300 text-sm mb-4">
                  This ReelPass score represents verified skills and authentic work persona.
                </p>
                {profile.email && (
                  <Button 
                    as="a" 
                    href={`mailto:${profile.email}?subject=ReelCV Profile Interest&body=I found your ReelCV profile and would like to discuss potential opportunities.`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 w-full mb-3"
                  >
                    <Mail size={16} className="mr-2" />
                    Contact Candidate
                  </Button>
                )}
                <div className="text-xs text-slate-500">
                  Find similar talent through <ReelHunterLink className="text-green-400 hover:text-green-300" />
                </div>
              </div>
            </Card>

            {/* ReelApps Ecosystem */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <div className="p-6">
                <h3 className="text-lg font-bold text-green-300 mb-3">Powered by ReelApps</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-blue-400" />
                    <ReelSkillsLink className="text-blue-400 hover:text-blue-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-purple-400" />
                    <ReelProjectsLink className="text-purple-400 hover:text-purple-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-green-400" />
                    <ReelHunterLink className="text-green-400 hover:text-green-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" />
                    <ReelCVDirectLink className="text-blue-400 hover:text-blue-300" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-green-500/20">
                  <ReelAppsMainLink className="text-blue-400 hover:text-blue-300 font-medium" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-700/50">
          <div className="mb-4">
            <ReelAppsMainLink className="text-blue-400 hover:text-blue-300 font-semibold text-lg" />
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Beyond traditional resumes - Skills + Personality verification
          </p>
          <div className="flex justify-center gap-6 text-sm flex-wrap">
            <ReelCVDirectLink className="text-blue-400 hover:text-blue-300" />
            <ReelSkillsLink className="text-blue-400 hover:text-blue-300" />
            <ReelProjectsLink className="text-purple-400 hover:text-purple-300" />
            <ReelHunterLink className="text-green-400 hover:text-green-300" />
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Create your ReelPass verified profile at <ReelCVDirectLink className="text-blue-400 hover:text-blue-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCVTemplate; 