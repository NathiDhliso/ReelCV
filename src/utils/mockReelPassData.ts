import { ReelPassScore, ProjectSkillDemo, PersonalityTraits, Credential, LearningActivity } from '../types/reelpass';

export function generateMockReelPassScore(): ReelPassScore {
  const mockProjects: ProjectSkillDemo[] = [
    {
      id: 'proj-1',
      title: 'E-commerce Platform Modernization',
      skillsDemonstrated: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      vettingMethod: 'professional',
      vettingScore: 92,
      complexity: 'enterprise',
      impact: 'significant',
      verificationBonuses: {
        externalValidation: true,
        liveDemo: true,
        clientTestimonial: true,
        communityEngagement: false
      },
      points: 95
    },
    {
      id: 'proj-2',
      title: 'AI-Powered Analytics Dashboard',
      skillsDemonstrated: ['Python', 'Machine Learning', 'React', 'PostgreSQL'],
      vettingMethod: 'ai',
      vettingScore: 88,
      complexity: 'large',
      impact: 'high',
      verificationBonuses: {
        externalValidation: true,
        liveDemo: false,
        clientTestimonial: false,
        communityEngagement: true
      },
      points: 75
    },
    {
      id: 'proj-3',
      title: 'Mobile Banking Security Module',
      skillsDemonstrated: ['React Native', 'Cybersecurity', 'Encryption', 'API Design'],
      vettingMethod: 'professional',
      vettingScore: 95,
      complexity: 'large',
      impact: 'significant',
      verificationBonuses: {
        externalValidation: true,
        liveDemo: true,
        clientTestimonial: true,
        communityEngagement: false
      },
      points: 90
    }
  ];

  const mockPersonalityTraits: PersonalityTraits = {
    bigFiveScores: {
      openness: 78,
      conscientiousness: 85,
      extraversion: 72,
      agreeableness: 81,
      neuroticism: 35
    },
    workRelevantTraits: {
      communication: 88,
      problemSolving: 92,
      collaboration: 85,
      adaptability: 89,
      leadership: 78
    },
    aiAnalysis: {
      communicationPatterns: 'Clear, structured communication with strong technical articulation. Effective at explaining complex concepts to diverse audiences.',
      workStyle: 'Detail-oriented and systematic approach with strong analytical thinking. Thrives in collaborative environments while maintaining independent decision-making.',
      strengthsIdentified: ['Technical Problem Solving', 'Cross-functional Collaboration', 'Adaptive Learning', 'Project Leadership'],
      developmentAreas: ['Public Speaking Confidence', 'Delegation Skills', 'Strategic Planning']
    }
  };

  const mockCredentials: Credential[] = [
    {
      type: 'certification',
      name: 'AWS Solutions Architect Professional',
      institution: 'Amazon Web Services',
      dateObtained: '2023-08-15',
      expiryDate: '2026-08-15',
      verificationStatus: 'verified',
      points: 25
    },
    {
      type: 'degree',
      name: 'Bachelor of Science in Computer Science',
      institution: 'University of Cape Town',
      dateObtained: '2020-12-10',
      verificationStatus: 'verified',
      points: 25
    },
    {
      type: 'certification',
      name: 'Certified Scrum Master',
      institution: 'Scrum Alliance',
      dateObtained: '2022-03-20',
      expiryDate: '2024-03-20',
      verificationStatus: 'verified',
      points: 15
    }
  ];

  const mockLearningActivities: LearningActivity[] = [
    {
      type: 'course',
      title: 'Advanced Machine Learning Specialization',
      provider: 'Coursera - Stanford University',
      completionDate: '2023-11-20',
      verificationStatus: 'verified',
      points: 10
    },
    {
      type: 'workshop',
      title: 'Modern DevOps Practices',
      provider: 'Linux Foundation',
      completionDate: '2023-09-15',
      verificationStatus: 'verified',
      points: 8
    },
    {
      type: 'conference',
      title: 'ReactConf 2023',
      provider: 'React Community',
      completionDate: '2023-05-10',
      verificationStatus: 'verified',
      points: 5
    }
  ];

  const reelProjectsScore = mockProjects.reduce((sum, p) => sum + p.points, 0);
  const personalityScore = 150; // Based on assessment completion and peer feedback
  const foundationalScore = mockCredentials.reduce((sum, c) => sum + c.points, 0);
  const experienceScore = 85; // 8+ years experience across multiple domains
  const learningScore = mockLearningActivities.reduce((sum, a) => sum + a.points, 0);

  const totalScore = reelProjectsScore + personalityScore + foundationalScore + experienceScore + learningScore;

  return {
    totalScore,
    level: totalScore >= 800 ? 'expert' : totalScore >= 600 ? 'skilled' : totalScore >= 400 ? 'competent' : totalScore >= 200 ? 'emerging' : 'aspiring',
    levelDescription: '',
    breakdown: {
      reelProjectsScore,
      reelPersonaScore: personalityScore,
      foundationalScore,
      experienceScore,
      continuousLearningScore: learningScore
    },
    details: {
      reelProjects: {
        projectBasedSkills: 240,
        projectImpactComplexity: 80,
        verificationBonus: 40,
        projects: mockProjects
      },
      reelPersona: {
        behavioralAssessment: 85,
        peerManagerialFeedback: 65,
        personalityTraits: mockPersonalityTraits
      },
      foundational: {
        certifications: 40,
        academicDegrees: 25,
        credentials: mockCredentials
      },
      experience: {
        relevantYears: 45, // 9 years
        skillCategoryDiversity: 40, // 8 different skill categories
        experienceAreas: ['Frontend Development', 'Backend Development', 'Cloud Architecture', 'Mobile Development', 'DevOps', 'Machine Learning', 'Cybersecurity', 'Project Management']
      },
      continuousLearning: {
        learningActivity: 18,
        platformEngagement: 5,
        recentActivities: mockLearningActivities
      }
    }
  };
} 