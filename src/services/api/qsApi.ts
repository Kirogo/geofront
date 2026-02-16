import axiosInstance from './axiosConfig'
import { SiteVisitReport, ReviewDecision } from '@/types/report.types'
import { PaginatedResponse } from '@/types/common.types'

export const qsApi = {
  // Get QS dashboard stats
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/qs/dashboard')
    return response
  },

  // Get pending reviews
  getPendingReviews: async (page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<SiteVisitReport>>(
      '/qs/pending-reviews',
      { params: { page, pageSize } }
    )
    return response
  },

  // Get reviews in progress
  getInProgressReviews: async (page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<SiteVisitReport>>(
      '/qs/in-progress',
      { params: { page, pageSize } }
    )
    return response
  },

  // Get completed reviews
  getCompletedReviews: async (page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<SiteVisitReport>>(
      '/qs/completed',
      { params: { page, pageSize } }
    )
    return response
  },

  // Get scheduled site visits
  getScheduledVisits: async (date?: Date) => {
    const response = await axiosInstance.get('/qs/scheduled-visits', {
      params: { date },
    })
    return response
  },

  // Review report
  reviewReport: async (reportId: string, decision: Partial<ReviewDecision>) => {
    const response = await axiosInstance.post(`/qs/reviews/${reportId}`, decision)
    return response
  },

  // Assign report to self
  assignReport: async (reportId: string) => {
    const response = await axiosInstance.post(`/qs/reviews/${reportId}/assign`)
    return response
  },

  // Get review history
  getReviewHistory: async (page = 1, pageSize = 10) => {
    const response = await axiosInstance.get('/qs/review-history', {
      params: { page, pageSize },
    })
    return response
  },

  // Add comment to review
  addReviewComment: async (reportId: string, comment: string, isInternal = true) => {
    const response = await axiosInstance.post(`/qs/reviews/${reportId}/comments`, {
      comment,
      isInternal,
    })
    return response
  },

  // Request revision
  requestRevision: async (reportId: string, comments: string, requiredChanges: string[]) => {
    const response = await axiosInstance.post(`/qs/reviews/${reportId}/revision`, {
      comments,
      requiredChanges,
    })
    return response
  },

  // Approve report
  approveReport: async (reportId: string, notes?: string) => {
    const response = await axiosInstance.post(`/qs/reviews/${reportId}/approve`, { notes })
    return response
  },

  // Reject report
  rejectReport: async (reportId: string, reason: string) => {
    const response = await axiosInstance.post(`/qs/reviews/${reportId}/reject`, { reason })
    return response
  },
}