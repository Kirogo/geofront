// src/pages/rm/RMDashboard.tsx
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
import { EmptyState } from '@/components/common/EmptyState'

export const RMDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { reports, isLoading } = useReports()
  const [pendingReports, setPendingReports] = useState<SiteVisitReport[]>([])
  const [isLoadingPending, setIsLoadingPending] = useState(false)

  useEffect(() => {
    const fetchPendingReports = async () => {
      setIsLoadingPending(true)
      try {
        const response = await reportsApi.getMyPendingReports()
        setPendingReports(response.data || [])
      } catch (error) {
        console.error('Failed to fetch pending reports:', error)
        setPendingReports([])
      } finally {
        setIsLoadingPending(false)
      }
    }
    fetchPendingReports()
  }, [])

  // Calculate stats with proper status mapping
  const stats = {
    totalReports: reports.length,
    pendingReviews: reports.filter(r => 
      r.status?.toLowerCase() === 'pendingqsreview' || 
      r.status?.toLowerCase() === 'pending_qs_review' ||
      r.status?.toLowerCase() === 'underreview'
    ).length,
    approved: reports.filter(r => 
      r.status?.toLowerCase() === 'approved'
    ).length,
    revisions: reports.filter(r => 
      r.status?.toLowerCase() === 'revisionrequested' || 
      r.status?.toLowerCase() === 'revision_requested' ||
      r.status?.toLowerCase() === 'returned'
    ).length,
  }

  const recentReports = reports.slice(0, 5)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A3636]">
            Welcome back, {user?.firstName || 'User'}
          </h1>
          <p className="mt-1 text-sm text-[#677D6A]">
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
          className="w-full sm:w-auto"
        >
          New Call Report
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Created Site Visits For Review Section */}
      {pendingReports.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A3636]">
              Pending QS Reviews
            </h2>
            <span className="px-2.5 py-0.5 bg-[#D6BD98] text-[#1A3636] text-xs font-medium rounded-full">
              {pendingReports.length} pending
            </span>
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <ReportsTable 
                reports={pendingReports} 
                isLoading={isLoadingPending}
              />
            </div>
          </Card>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-[#1A3636]">
                Recent Reports
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/rm/reports')}
                className="w-full sm:w-auto"
              >
                View All Reports
              </Button>
            </div>
            
            {recentReports.length > 0 ? (
              <ReportList
                reports={recentReports}
                isLoading={isLoading}
                onReportClick={(id) => navigate(`/rm/reports/${id}`)}
              />
            ) : (
              <EmptyState
                title="No reports yet"
                description="Create your first site visit report to get started."
                actionLabel="Create Report"
                onAction={() => navigate('/rm/reports/create')}
              />
            )}
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h2 className="text-lg font-semibold text-[#1A3636] mb-4">
              Recent Activity
            </h2>
            <ActivityFeed />
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#1A3636]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActions />
        </div>
      </section>
    </div>
  )
}

export default RMDashboard