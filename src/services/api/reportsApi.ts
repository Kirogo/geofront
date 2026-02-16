import axiosInstance from './axiosConfig'
import {
  SiteVisitReport,
  CreateReportDto,
  UpdateReportDto,
  SubmitReportDto,
  ReviewDecision,
  Comment
} from '@/types/report.types'
import { GeotaggedPhoto } from '@/types/geotag.types'
import { PaginatedResponse } from '@/types/common.types'

export const reportsApi = {
  // Helper: normalize various status string formats to backend enum names
  _mapStatusToServer: (status?: string) => {
    if (!status) return status
    const s = status.toString().toLowerCase()
    switch (s) {
      case 'draft':
        return 'Draft'
      case 'pending_qs_review':
      case 'pendingqsreview':
      case 'pendingqs_review':
      case 'pending_qsreview':
        return 'PendingQsReview'
      case 'under_review':
      case 'underreview':
        return 'UnderReview'
      case 'revision_requested':
      case 'revisionrequested':
        return 'RevisionRequested'
      case 'site_visit_scheduled':
      case 'sitevisitscheduled':
        return 'SiteVisitScheduled'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'archived':
        return 'Archived'
      default:
        return status
    }
  },
  // Get all reports with pagination and filters
  getReports: async (params: any) => {
    const response = await axiosInstance.get<PaginatedResponse<SiteVisitReport>>('/reports', { params })
    return response
  },

  // Get single report by ID
  getReportById: async (id: string) => {
    const response = await axiosInstance.get<SiteVisitReport>(`/reports/${id}`)
    return response
  },

  // Create new report
  createReport: async (data: CreateReportDto) => {
    // Remove files from the main report creation payload to send as JSON
    const { photos, attachments, ...reportData } = data
    // normalize status to what the backend expects
    if ((reportData as any).status) {
      ;(reportData as any).status = (reportsApi as any)._mapStatusToServer((reportData as any).status)
    }
    try {
      console.log('Creating report payload:', reportData)
      console.log('Creating report payload (json):', JSON.stringify(reportData))
    } catch (e) {
      console.log('Creating report payload (stringify failed)')
    }
    const response = await axiosInstance.post<SiteVisitReport>('/reports', reportData)
    return response
  },

  // Update report
  updateReport: async (id: string, data: UpdateReportDto) => {
    // normalize status if present
    const payload = { ...data }
    if ((payload as any).status) {
      ;(payload as any).status = (reportsApi as any)._mapStatusToServer((payload as any).status)
    }
    const response = await axiosInstance.put<SiteVisitReport>(`/reports/${id}`, payload)
    return response
  },

  // Delete report
  deleteReport: async (id: string) => {
    const response = await axiosInstance.delete(`/reports/${id}`)
    return response
  },

  // Submit report for review
  submitReport: async (id: string, data: SubmitReportDto) => {
    const response = await axiosInstance.post<SiteVisitReport>(`/reports/${id}/submit`, data)
    return response
  },

  // Upload photo to report
  uploadPhoto: async (reportId: string, photo: GeotaggedPhoto, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append('photo', photo.file)
    formData.append('geotag', JSON.stringify(photo.geotag))
    formData.append('metadata', JSON.stringify(photo.metadata))

    const response = await axiosInstance.post(`/reports/${reportId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
    return response
  },

  // Delete photo from report
  deletePhoto: async (reportId: string, photoId: string) => {
    const response = await axiosInstance.delete(`/reports/${reportId}/photos/${photoId}`)
    return response
  },

  // Add comment to report
  addComment: async (reportId: string, comment: Partial<Comment>) => {
    const response = await axiosInstance.post<Comment>(`/reports/${reportId}/comments`, comment)
    return response
  },

  // Get report comments
  getComments: async (reportId: string) => {
    const response = await axiosInstance.get<Comment[]>(`/reports/${reportId}/comments`)
    return response
  },

  // Make decision on report (QS only)
  makeDecision: async (reportId: string, decision: Partial<ReviewDecision>) => {
    const response = await axiosInstance.post<SiteVisitReport>(`/reports/${reportId}/decisions`, decision)
    return response
  },

  // Get report history/audit trail
  getReportHistory: async (reportId: string) => {
    const response = await axiosInstance.get(`/reports/${reportId}/history`)
    return response
  },

  // Export report as PDF
  exportReportPDF: async (reportId: string) => {
    const response = await axiosInstance.get(`/reports/${reportId}/export`, {
      responseType: 'blob',
    })
    return response
  },

  // Get reports by status
  getReportsByStatus: async (status: string, page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<SiteVisitReport>>(
      `/reports/status/${status}`,
      { params: { page, pageSize } }
    )
    return response
  },

  // Get reports assigned to current user
  getMyReports: async (page = 1, pageSize = 10, filters = {}) => {
    const response = await axiosInstance.get<PaginatedResponse<SiteVisitReport>>(
      '/reports/my-reports',
      { params: { page, pageSize, ...filters } }
    )
    return response
  },

  // Get reports pending review (for QS)
  getPendingReviews: async (page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<SiteVisitReport>>(
      '/reports/pending-review',
      { params: { page, pageSize } }
    )
    return response
  },

  // Schedule site visit (QS)
  scheduleSiteVisit: async (reportId: string, scheduledDate: Date, notes?: string) => {
    const response = await axiosInstance.post(`/reports/${reportId}/schedule-visit`, {
      scheduledDate,
      notes,
    })
    return response
  },

  // Get my pending reports (for "Created Site Visits For Review" section)
  getMyPendingReports: async () => {
    const response = await axiosInstance.get<SiteVisitReport[]>('/reports/my-pending-reports')
    return response
  },
}