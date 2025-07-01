export interface ReelPassScore {
  totalScore: number; // Out of 1000
  level: 'aspiring' | 'emerging' | 'competent' | 'skilled' | 'expert';
  levelDescription: string;
  breakdown: {
    reelProjectsScore: number; // Up to 500 points (50%)
    reelPersonaScore: number; // Up to 200 points (20%)
    foundationalScore: number; // Up to 150 points (15%)
    experienceScore: number; // Up to 100 points (10%)
    continuousLearningScore: number; // Up to 50 points (5%)
  };
  details: {
    reelProjects: {
      projectBasedSkills: number; // Up to 300 points
      projectImpactComplexity: number; // Up to 100 points
      verificationBonus: number; // Up to 100 points
      projects: ProjectSkillDemo[];
    };
    reelPersona: {
      behavioralAssessment: number; // Up to 100 points
      peerManagerialFeedback: number; // Up to 100 points
      personalityTraits: PersonalityTraits;
    };
    foundational: {
      certifications: number; // Up to 75 points
      academicDegrees: number; // Up to 75 points
      credentials: Credential[];
    };
    experience: {
      relevantYears: number; // Up to 50 points
      skillCategoryDiversity: number; // Up to 50 points
      experienceAreas: string[];
    };
    continuousLearning: {
      learningActivity: number; // Up to 25 points
      platformEngagement: number; // Up to 25 points
      recentActivities: LearningActivity[];
    };
  };
}

export interface ProjectSkillDemo {
  id: string;
  title: string;
  skillsDemonstrated: string[];
  vettingMethod: 'ai' | 'professional' | 'peer';
  vettingScore: number;
  complexity: 'small' | 'medium' | 'large' | 'enterprise';
  impact: 'low' | 'medium' | 'high' | 'significant';
  verificationBonuses: {
    externalValidation: boolean;
    liveDemo: boolean;
    clientTestimonial: boolean;
    communityEngagement: boolean;
  };
  points: number;
}

export interface PersonalityTraits {
  bigFiveScores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  workRelevantTraits: {
    communication: number;
    problemSolving: number;
    collaboration: number;
    adaptability: number;
    leadership: number;
  };
  aiAnalysis: {
    communicationPatterns: string;
    workStyle: string;
    strengthsIdentified: string[];
    developmentAreas: string[];
  };
}

export interface Credential {
  type: 'certification' | 'degree' | 'license';
  name: string;
  institution: string;
  dateObtained: string;
  expiryDate?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  points: number;
}

export interface LearningActivity {
  type: 'course' | 'workshop' | 'bootcamp' | 'certification' | 'conference';
  title: string;
  provider: string;
  completionDate: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  points: number;
}

export function getScoreLevel(score: number): {
  level: ReelPassScore['level'];
  description: string;
  color: string;
  bgColor: string;
} {
  if (score >= 800) {
    return {
      level: 'expert',
      description: 'Expert Professional - Industry-leading, comprehensively proven skills, and an exceptional work persona.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20 border-purple-500/30'
    };
  } else if (score >= 600) {
    return {
      level: 'skilled',
      description: 'Skilled Professional - Strong portfolio of vetted skills and a well-defined, effective work persona.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20 border-blue-500/30'
    };
  } else if (score >= 400) {
    return {
      level: 'competent',
      description: 'Competent Professional - Solid base of proven skills and a developing understanding of their work persona.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20 border-green-500/30'
    };
  } else if (score >= 200) {
    return {
      level: 'emerging',
      description: 'Emerging Professional - Developing demonstrable skills and gaining insights into work persona.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20 border-yellow-500/30'
    };
  } else {
    return {
      level: 'aspiring',
      description: 'Aspiring Professional - Beginning to build a portfolio of demonstrated skills and understand work persona.',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20 border-gray-500/30'
    };
  }
} 