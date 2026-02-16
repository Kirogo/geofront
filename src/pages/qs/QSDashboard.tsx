import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { qsApi } from '@/services/api/qsApi'
import { SiteVisitReport } from '@/types/report.types'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { ReviewItem } from '@/components/qs/ReviewQueue/ReviewItem'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export const QSDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    pendingReviews: 0,
    inProgress: 0,
    completedToday: 0,
    scheduledVisits: 0,
    averageResponseTime: '0h',
    criticalIssues: 0,
  })
  const [pendingReports, setPendingReports] = useState<SiteVisitReport[]>([])
  const [upcomingVisits, setUpcomingVisits] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load dashboard stats
      const statsResponse = await qsApi.getDashboardStats()
      setStats(statsResponse.data)

      // Load pending reviews
      const pendingResponse = await qsApi.getPendingReviews(1, 5)
      setPendingReports(pendingResponse.data.items)

      // Load scheduled visits
      const visitsResponse = await qsApi.getScheduledVisits()
      setUpcomingVisits(visitsResponse.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignToMe = async (reportId: string) => {
    try {
      await qsApi.assignReport(reportId)
      toast.success('Report assigned to you')
      loadDashboardData() // Reload data
      navigate(`/qs/reviews/${reportId}`)
    } catch (error) {
      toast.error('Failed to assign report')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" label="Loading dashboard..." />
      </div>
    )
  }

  // Transform stats for StatsCards component
  const dashboardStats = [
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-warning',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
        </svg>
      ),
      color: 'bg-info',
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-success',
    },
    {
      title: 'Scheduled Visits',
      value: stats.scheduledVisits,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-1 text-sm text-secondary-600">
            Here's your QS dashboard overview.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color} bg-opacity-10`}>
                  <div className={`text-${stat.color.split('-')[1]}-600`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-secondary-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-semibold text-secondary-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Average Response Time</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.averageResponseTime}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Critical Issues Pending</p>
              <p className="text-2xl font-bold text-error">{stats.criticalIssues}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Reviews */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">
                Pending Reviews
              </h2>
            </div>
            <div className="space-y-4">
              {pendingReports.length === 0 ? (
                <p className="text-center text-secondary-500 py-8">
                  No pending reviews. Great job!
                </p>
              ) : (
                pendingReports.map((report) => (
                  <ReviewItem
                    key={report.id}
                    report={report}
                    onAssign={() => handleAssignToMe(report.id)}
                    onView={() => navigate(`/qs/reviews/${report.id}`)}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Site Visits */}
          <Card>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Upcoming Site Visits
            </h2>
            <div className="space-y-4">
              {upcomingVisits.length === 0 ? (
                <p className="text-center text-secondary-500 py-4">
                  No upcoming site visits
                </p>
              ) : (
                upcomingVisits.map((visit) => (
                  <div key={visit.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center">
                        <svg className="h-4 w-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">
                        {visit.report?.title || 'Site Visit'}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {formatDistanceToNow(new Date(visit.scheduledDate), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/qs/site-visits/${visit.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Recent Activity
            </h2>
            <ActivityFeed />
          </Card>
        </div>
      </div>

    </div>
  )
}

export default QSDashboard