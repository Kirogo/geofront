import { BaseEntity } from './common.types'
import { GeotagData } from './geotag.types'
import { Client } from './client.types'
import { User } from './auth.types'

export type ReportStatus =
  | 'draft'
  | 'pending_qs_review'
  | 'under_review'
  | 'revision_requested'
  | 'site_visit_scheduled'
  | 'approved'
  | 'rejected'
  | 'archived'

export type DecisionType = 'approve' | 'reject' | 'revision' | 'site_visit'

export interface ReportDocument {
  name: string
  status: 'pendingrm' | 'submitted' | 'approved' | 'rejected'
  action?: string
  comment?: string
}

export interface ReportDocumentCategory {
  category: string
  docList: ReportDocument[]
}

export interface SiteVisitReport extends BaseEntity {
  reportNumber: string
  title: string
  description?: string
  status: ReportStatus
  clientId: string
  client?: Client
  rmId: string
  rm?: User
  qsId?: string
  qs?: User
  visitDate: Date
  siteAddress: string
  siteCoordinates?: GeotagData
  weather?: string
  temperature?: number
  workProgress: WorkProgress[]
  issues: Issue[]
  photos: ReportPhoto[]
  attachments: ReportAttachment[]
  decisions: ReviewDecision[]
  comments: Comment[]
  submittedAt?: Date
  reviewedAt?: Date
  approvedAt?: Date
  scheduledSiteVisit?: ScheduledSiteVisit
  tags?: string[]
  loanType?: string
  ibpsNo?: string
  documents?: ReportDocumentCategory[]
}

export interface WorkProgress {
  id: string
  description: string
  percentage: number
  category: string
  photos?: string[]
  notes?: string
}

export interface Issue {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved'
  photos?: string[]
  resolvedAt?: Date
  resolvedBy?: string
}

export interface ReportPhoto {
  id: string
  url: string
  thumbnailUrl: string
  caption?: string
  geotag?: GeotagData
  uploadedAt: Date
  uploadedBy: string
  isPrimary?: boolean
  category?: 'site' | 'work' | 'issue' | 'general'
}

export interface ReportAttachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: Date
  uploadedBy: string
}

export interface ReviewDecision {
  id: string
  reportId: string
  decision: DecisionType
  comment: string
  madeBy: string
  madeAt: Date
  attachments?: string[]
  nextReviewerId?: string
}

export interface Comment {
  id: string
  reportId: string
  content: string
  createdBy: string
  createdAt: Date
  updatedAt?: Date
  attachments?: string[]
  mentions?: string[]
  parentId?: string
  isInternal?: boolean
}

export interface ScheduledSiteVisit {
  id: string
  reportId: string
  scheduledDate: Date
  qsId: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  notes?: string
  completedAt?: Date
  visitReport?: string
}

export interface CreateReportDto {
  title: string
  description?: string
  clientId: string
  visitDate: Date
  siteAddress: string
  siteCoordinates?: GeotagData
  weather?: string
  temperature?: number
  projectName?: string
  workProgress: Omit<WorkProgress, 'id'>[]
  issues: Omit<Issue, 'id'>[]
  photos?: File[]
  attachments?: File[]
  loanType?: string
  ibpsNo?: string
  rmId?: string
  documents?: ReportDocumentCategory[]
}

export interface UpdateReportDto extends Partial<CreateReportDto> {
  id: string
  status?: ReportStatus
}

export interface SubmitReportDto {
  reportId: string
  notes?: string
}

export interface ReportFilter {
  status?: ReportStatus[]
  clientId?: string
  rmId?: string
  qsId?: string
  startDate?: Date
  endDate?: Date
  search?: string
  tags?: string[]
}