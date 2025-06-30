import { supabase } from './supabase'

export interface RecruiterRating {
  id: string
  recruiterName: string
  recruiterEmail: string
  totalReviews: number
  avgCommunication: number
  avgProfessionalism: number
  avgRoleAccuracy: number
  overallRating: number
  positiveReviews: number
  negativeReviews: number
  recentFeedback: Array<{
    candidateName: string
    jobTitle: string
    rating: number
    feedback: string
    date: string
  }>
}

export async function getRecruiterRatings(): Promise<RecruiterRating[]> {
  try {
    const { data: summaryData, error: summaryError } = await supabase
      .from('recruiter_ratings_summary')
      .select('*')
      .order('overall_rating', { ascending: false })

    if (summaryError) {
      // eslint-disable-next-line no-console
      console.error('Error fetching recruiter ratings summary:', summaryError)
      return []
    }

    if (!summaryData || summaryData.length === 0) {
      return []
    }

    const recruiterIds = summaryData.map((r: any) => r.recruiter_id)
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('recruiter_scorecards')
      .select('recruiter_id, feedback_text, job_title, overall_rating, created_at')
      .in('recruiter_id', recruiterIds)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (feedbackError) {
      // eslint-disable-next-line no-console
      console.error('Error fetching feedback data:', feedbackError)
    }

    const feedbackByRecruiter = (feedbackData || []).reduce((acc: Record<string, any[]>, feedback: any) => {
      if (!acc[feedback.recruiter_id]) {
        acc[feedback.recruiter_id] = []
      }
      acc[feedback.recruiter_id].push({
        candidateName: 'Anonymous Candidate',
        jobTitle: feedback.job_title || 'Position',
        rating: feedback.overall_rating,
        feedback: feedback.feedback_text || '',
        date: feedback.created_at
      })
      return acc
    }, {})

    return summaryData.map((summary: any /* RecruiterRatingSummary */) => ({
      id: summary.recruiter_id,
      recruiterName: `${summary.first_name || ''} ${summary.last_name || ''}`.trim() || 'Unknown Recruiter',
      recruiterEmail: summary.email,
      totalReviews: summary.total_reviews,
      avgCommunication: summary.avg_communication || 0,
      avgProfessionalism: summary.avg_professionalism || 0,
      avgRoleAccuracy: summary.avg_role_accuracy || 0,
      overallRating: summary.overall_rating || 0,
      positiveReviews: summary.positive_reviews,
      negativeReviews: summary.negative_reviews,
      recentFeedback: feedbackByRecruiter[summary.recruiter_id] || []
    }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching recruiter ratings:', error)
    return []
  }
} 