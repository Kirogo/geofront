import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '@/hooks/useReports'
import { useAuth } from '@/hooks/useAuth'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { ReportList } from '@/components/reports/ReportList'
import { ReportsTable } from '@/components/reports/ReportsTable'
import { reportsApi } from '@/services/api/reportsApi'
import { SiteVisitReport } from '@/types/report.types'

export const RMDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { reports, isLoading } = useReports()
  const [pendingReports, setPendingReports] = useState<SiteVisitReport[]>([])

  useEffect(() => {
    const fetchPendingReports = async () => {
      try {
        const response = await reportsApi.getMyPendingReports()
        setPendingReports(response.data)
      } catch (error) {
        console.error('Failed to fetch pending reports:', error)
      }
    }
    fetchPendingReports()
  }, [])

  const stats = {
    totalReports: reports.length,
    pendingReviews: reports.filter(r => r.status.toLowerCase() === 'pendingqsreview' || r.status.toLowerCase() === 'pending_qs_review').length,
    approved: reports.filter(r => r.status.toLowerCase() === 'approved').length,
    revisions: reports.filter(r => r.status.toLowerCase() === 'revisionrequested' || r.status.toLowerCase() === 'revision_requested').length,
  }

  const recentReports = reports.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-1 text-sm text-secondary-600">
            Here's what's happening with your reports today.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/rm/reports/create')}
          leftIcon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          New Report
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Created Site Visits For Review */}
      {pendingReports.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <div className="flex-grow border-t border-secondary-300"></div>
            <span className="px-4 text-lg font-semibold text-secondary-700">
              Created Site Visits For Review
            </span>
            <div className="flex-grow border-t border-secondary-300"></div>
          </div>
          <ReportsTable reports={pendingReports} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">
                Recent Reports
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/rm/reports')}
              >
                View All
              </Button>
            </div>
            <ReportList
              reports={recentReports}
              isLoading={isLoading}
              onReportClick={(id) => navigate(`/rm/reports/${id}`)}
            />
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Recent Activity
            </h2>
            <ActivityFeed />
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActions />
      </div>
    </div>
  )
}

export default RMDashboard