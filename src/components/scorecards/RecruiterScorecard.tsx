import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Award, Target, Search } from 'lucide-react';

// --- Type Definitions ---
// Define the structure for a single piece of feedback
interface Feedback {
  feedbackId: string;
  candidateName: string;
  jobTitle: string;
  rating: number;
  feedback: string;
  date: string;
}

// Define the main structure for a recruiter's rating data
interface RecruiterRating {
  id: string;
  recruiterName: string;
  recruiterEmail: string;
  overallRating: number;
  totalReviews: number;
  avgCommunication: number;
  avgProfessionalism: number;
  avgRoleAccuracy: number;
  positiveReviews: number;
  negativeReviews: number;
  recentFeedback: Feedback[];
}


// --- Mock Data and Services ---
// This section makes the component runnable without a real backend.

// 1. Create mock data that matches the RecruiterRating type
const mockRecruiterData: RecruiterRating[] = [
  {
    id: '1',
    recruiterName: 'Alice Johnson',
    recruiterEmail: 'alice.j@examplecorp.com',
    overallRating: 4.8,
    totalReviews: 124,
    avgCommunication: 4.9,
    avgProfessionalism: 4.8,
    avgRoleAccuracy: 4.7,
    positiveReviews: 118,
    negativeReviews: 6,
    recentFeedback: [
      {
        feedbackId: 'fb1',
        candidateName: 'David Lee',
        jobTitle: 'Senior Frontend Developer',
        rating: 5,
        feedback: "Alice was fantastic! Very clear communication and supportive throughout the entire process. The role was exactly as described.",
        date: '2024-06-25T10:00:00Z',
      },
    ],
  },
  {
    id: '2',
    recruiterName: 'Bob Williams',
    recruiterEmail: 'bob.w@techsolutions.io',
    overallRating: 4.2,
    totalReviews: 88,
    avgCommunication: 4.0,
    avgProfessionalism: 4.5,
    avgRoleAccuracy: 4.1,
    positiveReviews: 75,
    negativeReviews: 13,
    recentFeedback: [
      {
        feedbackId: 'fb2',
        candidateName: 'Sophia Rodriguez',
        jobTitle: 'UX/UI Designer',
        rating: 4,
        feedback: "Good experience overall. Bob was very professional, though there was a slight delay in communication at one point.",
        date: '2024-06-22T14:30:00Z',
      },
    ],
  },
  {
    id: '3',
    recruiterName: 'Charlie Brown',
    recruiterEmail: 'charlie.b@innovate.dev',
    overallRating: 3.7,
    totalReviews: 52,
    avgCommunication: 3.5,
    avgProfessionalism: 4.0,
    avgRoleAccuracy: 3.6,
    positiveReviews: 40,
    negativeReviews: 12,
    recentFeedback: [
        {
            feedbackId: 'fb3',
            candidateName: 'Michael Chen',
            jobTitle: 'Data Scientist',
            rating: 3,
            feedback: "The process was okay, but the role wasn't described very accurately, which led to some confusion during the technical interview.",
            date: '2024-06-20T11:00:00Z',
        },
    ],
  },
  {
    id: '4',
    recruiterName: 'Diana Martinez',
    recruiterEmail: 'diana.m@globaltech.com',
    overallRating: 4.6,
    totalReviews: 97,
    avgCommunication: 4.7,
    avgProfessionalism: 4.6,
    avgRoleAccuracy: 4.5,
    positiveReviews: 89,
    negativeReviews: 8,
    recentFeedback: [
      {
        feedbackId: 'fb4',
        candidateName: 'Sarah Kim',
        jobTitle: 'Product Manager',
        rating: 5,
        feedback: "Diana was exceptional throughout the entire hiring process. Great communication, transparent about expectations, and very supportive.",
        date: '2024-06-28T09:15:00Z',
      },
    ],
  },
  {
    id: '5',
    recruiterName: 'Erik Thompson',
    recruiterEmail: 'erik.t@startupventures.io',
    overallRating: 3.9,
    totalReviews: 63,
    avgCommunication: 3.8,
    avgProfessionalism: 4.1,
    avgRoleAccuracy: 3.8,
    positiveReviews: 48,
    negativeReviews: 15,
    recentFeedback: [
      {
        feedbackId: 'fb5',
        candidateName: 'James Wilson',
        jobTitle: 'Full Stack Developer',
        rating: 4,
        feedback: "Erik was helpful and responsive. The startup environment was exactly as described, though the timeline was a bit rushed.",
        date: '2024-06-26T16:45:00Z',
      },
    ],
  },
  {
    id: '6',
    recruiterName: 'Fiona Chen',
    recruiterEmail: 'fiona.c@enterprisesolutions.com',
    overallRating: 4.4,
    totalReviews: 156,
    avgCommunication: 4.3,
    avgProfessionalism: 4.5,
    avgRoleAccuracy: 4.4,
    positiveReviews: 142,
    negativeReviews: 14,
    recentFeedback: [
      {
        feedbackId: 'fb6',
        candidateName: 'Alex Rodriguez',
        jobTitle: 'DevOps Engineer',
        rating: 4,
        feedback: "Fiona was professional and knowledgeable about the role. The interview process was well-structured and fair.",
        date: '2024-06-24T11:30:00Z',
      },
    ],
  }
];

// 2. Mock the getRecruiterRatings service function
const getRecruiterRatings = (): Promise<RecruiterRating[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecruiterData);
    }, 1000); // Simulate network delay
  });
};

// --- Recruiter Scorecard Component ---

const RecruiterScorecard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  // Explicitly type the state to be an array of RecruiterRating
  const [recruiters, setRecruiters] = useState<RecruiterRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecruiterRatings();
  }, []);

  const loadRecruiterRatings = async () => {
    try {
      setIsLoading(true);
      const ratings = await getRecruiterRatings();
      setRecruiters(ratings);
    } catch (error) {
      console.error('Failed to load recruiter ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Type the rating parameter
  const getRatingLevel = (rating: number) => {
    if (rating >= 4.5) return { text: 'Excellent', class: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (rating >= 4.0) return { text: 'Very Good', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (rating >= 3.5) return { text: 'Good', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (rating >= 3.0) return { text: 'Fair', class: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { text: 'Poor', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  // Type the rating parameter
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < Math.round(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-600'
        }`}
      />
    ));
  };

  const filteredRecruiters = recruiters
    .filter((recruiter) =>
      recruiter.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiter.recruiterEmail.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.overallRating - a.overallRating;
        case 'reviews':
          return b.totalReviews - a.totalReviews;
        case 'recent':
          // Handle cases where there might be no feedback
          const dateA = a.recentFeedback.length > 0 ? new Date(a.recentFeedback[0].date).getTime() : 0;
          const dateB = b.recentFeedback.length > 0 ? new Date(b.recentFeedback[0].date).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading recruiter scorecards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 mb-6">
          <div className="p-4 bg-blue-600/10 rounded-2xl">
            <Award className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-100">Recruiter Scorecard</h1>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Public ratings and reviews from candidates ensure recruiter accountability and transparency.
        </p>
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm text-blue-300">
            <strong>Real Feedback System:</strong> These ratings come from actual candidate experiences. 
            Help improve the hiring process by sharing your recruiter interactions.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search recruiters by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="reviews">Sort by Review Count</option>
            <option value="recent">Sort by Recent Activity</option>
          </select>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Platform Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{recruiters.length}</div>
            <div className="text-sm text-gray-400">Active Recruiters</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {recruiters.reduce((sum, r) => sum + r.totalReviews, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {(recruiters.reduce((sum, r) => sum + r.overallRating, 0) / recruiters.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.round((recruiters.reduce((sum, r) => sum + r.positiveReviews, 0) / recruiters.reduce((sum, r) => sum + r.totalReviews, 0)) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Positive Reviews</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredRecruiters.length === 0 && !isLoading && (
        <div className="max-w-4xl mx-auto text-center py-16">
          <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-100 mb-2">No Recruiters Found</h3>
          <p className="text-gray-500 mb-6">
            No recruiters match your search criteria. Try a different search term.
          </p>
        </div>
      )}

      {/* Recruiter Cards */}
      {filteredRecruiters.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRecruiters.map((recruiter) => {
            const ratingLevel = getRatingLevel(recruiter.overallRating);
            return (
              <div key={recruiter.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-700 hover:shadow-2xl hover:shadow-black/20">
                {/* Recruiter Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-2xl">
                        {recruiter.recruiterName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100">{recruiter.recruiterName}</h3>
                      <p className="text-gray-500 text-sm">{recruiter.recruiterEmail}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${ratingLevel.class}`}>
                          {ratingLevel.text}
                        </span>
                        <span className="text-gray-500 text-sm">• {recruiter.totalReviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Overall Rating */}
                  <div className="text-center flex-shrink-0">
                    <div className="text-3xl font-bold text-blue-400">
                      {recruiter.overallRating.toFixed(1)}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(recruiter.overallRating)}
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">Communication</span>
                    </div>
                    <div className="text-lg font-bold text-gray-100">
                      {recruiter.avgCommunication.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Award className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">Professionalism</span>
                    </div>
                    <div className="text-lg font-bold text-gray-100">
                      {recruiter.avgProfessionalism.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">Role Accuracy</span>
                    </div>
                    <div className="text-lg font-bold text-gray-100">
                      {recruiter.avgRoleAccuracy.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Review Summary */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{recruiter.positiveReviews}</div>
                    <div className="text-xs text-gray-400">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-400">{recruiter.negativeReviews}</div>
                    <div className="text-xs text-gray-400">Negative</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">
                      {Math.round((recruiter.positiveReviews / recruiter.totalReviews) * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </div>
                </div>

                {/* Recent Feedback */}
                {recruiter.recentFeedback.length > 0 && (
                  <div className="border-t border-gray-800 pt-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Recent Feedback</h4>
                    {recruiter.recentFeedback.slice(0, 1).map((feedback) => (
                      <div key={feedback.feedbackId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-100">{feedback.candidateName}</span>
                            <span className="text-xs text-gray-500">• {feedback.jobTitle}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {renderStars(feedback.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 italic">"{feedback.feedback}"</p>
                        <div className="text-xs text-gray-500 mt-2 text-right">
                          {new Date(feedback.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-100 mb-4">Rate Your Recruiter Experience</h3>
        <p className="text-gray-400 mb-6 text-lg leading-relaxed">
          Help other candidates by sharing your experience. Your feedback drives accountability and improves the hiring process for everyone.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-600/20">
          Submit a Review
        </button>
        <div className="mt-4 text-sm text-gray-500">
          Reviews are anonymous and help maintain recruiter quality standards
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h3 className="text-2xl font-semibold text-gray-100 mb-6 text-center">How Recruiter Scorecards Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-100 mb-2">Anonymous Reviews</h4>
            <p className="text-sm text-gray-400">
              Candidates can leave honest feedback about their recruitment experience without fear of retaliation.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="font-semibold text-gray-100 mb-2">Verified Ratings</h4>
            <p className="text-sm text-gray-400">
              All reviews are verified to ensure they come from real candidate interactions with recruiters.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="font-semibold text-gray-100 mb-2">Quality Improvement</h4>
            <p className="text-sm text-gray-400">
              Transparent feedback helps recruiters improve their practices and candidates make informed decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterScorecard;