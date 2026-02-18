// src/pages/rm/RMDashboard.tsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReports } from '@/hooks/useReports'
import { useAuth } from '@/hooks/useAuth'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ProgressTrail } from '@/components/dashboard/ProgressTrail'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { ReportsTable } from '@/components/reports/ReportsTable'
import { reportsApi } from '@/services/api/reportsApi'
import { SiteVisitReport } from '@/types/report.types'

// Dummy data for demonstration when no real reports exist
const dummyReports: SiteVisitReport[] = [
  {
    id: '1',
    title: 'Oakwood Heights Construction',
    clientName: 'Oakwood Developers Ltd',
    status: 'site_visit',
    createdAt: new Date('2026-02-15T10:30:00'),
    updatedAt: new Date('2026-02-18T14:20:00'),
    projectName: 'Oakwood Heights - Block A',
    clientId: 'CLT001',
    rmId: 'RM001',
    currentStep: 3,
    stepProgress: {
      1: { completed: true, completedAt: new Date('2026-02-15T11:30:00') },
      2: { completed: true, completedAt: new Date('2026-02-16T09:15:00') },
      3: { completed: false, startedAt: new Date('2026-02-18T10:00:00') }
    }
  },
  {
    id: '2',
    title: 'Riverside Mall Renovation',
    clientName: 'Riverside Properties',
    status: 'form',
    createdAt: new Date('2026-02-16T14:20:00'),
    updatedAt: new Date('2026-02-17T16:45:00'),
    projectName: 'Riverside Mall - Phase 2',
    clientId: 'CLT002',
    rmId: 'RM001',
    currentStep: 2,
    stepProgress: {
      1: { completed: true, completedAt: new Date('2026-02-16T15:30:00') },
      2: { completed: false, startedAt: new Date('2026-02-17T09:00:00') }
    }
  },
  {
    id: '3',
    title: 'Sunset Villa Extension',
    clientName: 'Sunset Homes Ltd',
    status: 'review',
    createdAt: new Date('2026-02-10T09:00:00'),
    updatedAt: new Date('2026-02-17T11:30:00'),
    projectName: 'Sunset Villa - Extension',
    clientId: 'CLT003',
    rmId: 'RM002',
    currentStep: 6,
    stepProgress: {
      1: { completed: true, completedAt: new Date('2026-02-10T10:30:00') },
      2: { completed: true, completedAt: new Date('2026-02-11T14:20:00') },
      3: { completed: true, completedAt: new Date('2026-02-12T16:00:00') },
      4: { completed: true, completedAt: new Date('2026-02-13T11:15:00') },
      5: { completed: true, completedAt: new Date('2026-02-14T09:30:00') },
      6: { completed: false, startedAt: new Date('2026-02-15T10:00:00') }
    }
  },
  {
    id: '4',
    title: 'Downtown Office Complex',
    clientName: 'CBD Developers',
    status: 'submitted',
    createdAt: new Date('2026-02-01T08:00:00'),
    updatedAt: new Date('2026-02-16T15:20:00'),
    projectName: 'Downtown Office - Tower B',
    clientId: 'CLT004',
    rmId: 'RM001',
    currentStep: 7,
    stepProgress: {
      1: { completed: true, completedAt: new Date('2026-02-01T09:30:00') },
      2: { completed: true, completedAt: new Date('2026-02-02T11:45:00') },
      3: { completed: true, completedAt: new Date('2026-02-03T14:20:00') },
      4: { completed: true, completedAt: new Date('2026-02-04T10:15:00') },
      5: { completed: true, completedAt: new Date('2026-02-05T13:30:00') },
      6: { completed: true, completedAt: new Date('2026-02-06T16:00:00') },
      7: { completed: true, completedAt: new Date('2026-02-16T15:20:00') }
    }
  },
  {
    id: '5',
    title: 'Harbor View Apartments',
    clientName: 'Harbor Living Ltd',
    status: 'photos',
    createdAt: new Date('2026-02-17T13:15:00'),
    updatedAt: new Date('2026-02-18T09:45:00'),
    projectName: 'Harbor View - Phase 1',
    clientId: 'CLT005',
    rmId: 'RM003',
    currentStep: 4,
    stepProgress: {
      1: { completed: true, completedAt: new Date('2026-02-17T14:30:00') },
      2: { completed: true, completedAt: new Date('2026-02-17T16:15:00') },
      3: { completed: true, completedAt: new Date('2026-02-18T09:00:00') },
      4: { completed: false, startedAt: new Date('2026-02-18T09:45:00') }
    }
  }
]

export const RMDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { reports: realReports, isLoading } = useReports()
  const [pendingReports, setPendingReports] = useState<SiteVisitReport[]>([])
  const [isLoadingPending, setIsLoadingPending] = useState(false)
  const [showDummyData, setShowDummyData] = useState(true) // Toggle this based on your needs
  const statsScrollRef = useRef<HTMLDivElement>(null)

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

  // Use real reports if available, otherwise use dummy data
  const displayReports = showDummyData ? dummyReports : realReports

  // Calculate stats
  const stats = {
    totalReports: displayReports.length,
    pendingReviews: displayReports.filter(r => 
      r.status?.toLowerCase() === 'pendingqsreview' || 
      r.status?.toLowerCase() === 'pending_qs_review' ||
      r.status?.toLowerCase() === 'underreview'
    ).length,
    approved: displayReports.filter(r => 
      r.status?.toLowerCase() === 'approved'
    ).length,
    revisions: displayReports.filter(r => 
      r.status?.toLowerCase() === 'revisionrequested' || 
      r.status?.toLowerCase() === 'revision_requested' ||
      r.status?.toLowerCase() === 'returned'
    ).length,
  }

  const recentReports = displayReports.slice(0, 5)

  // Handle horizontal scroll with mouse wheel
  useEffect(() => {
    const scrollContainer = statsScrollRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) {
        e.preventDefault()
        scrollContainer.scrollLeft += e.deltaY
      }
    }

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
    return () => scrollContainer.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1A3636] truncate">
                Welcome back, {user?.firstName || 'User'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#677D6A]">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Development toggle - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-[#677D6A]">Data source:</span>
              <button
                onClick={() => setShowDummyData(!showDummyData)}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  showDummyData 
                    ? 'bg-[#D6BD98] text-[#1A3636]' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {showDummyData ? 'Using Dummy Data' : 'Using Real Data'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="relative -mx-4 sm:mx-0 mb-6 sm:mb-8">
          <div 
            ref={statsScrollRef}
            className="overflow-x-auto scrollbar-hide px-4 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-max sm:min-w-0">
              <StatsCards stats={stats} />
            </div>
          </div>
        </div>

        {/* Pending QS Reviews Section */}
        {pendingReports.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-[#1A3636]">
                Pending QS Reviews
              </h2>
              <span className="px-2 py-0.5 bg-[#D6BD98] text-[#1A3636] text-xs font-medium rounded-full">
                {pendingReports.length}
              </span>
            </div>
            
            <Card className="overflow-hidden border border-neutral-200">
              <div className="overflow-x-auto">
                <ReportsTable 
                  reports={pendingReports}
                />
              </div>
            </Card>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Progress Trail - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <ProgressTrail 
              reports={recentReports}
            />
          </div>

          {/* Activity Feed - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <Card className="h-full border border-neutral-200">
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-[#1A3636] mb-4">
                  Recent Activity
                </h2>
                <ActivityFeed />
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-[#1A3636]">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <QuickActions />
          </div>
        </section>
      </div>
    </div>
  )
}

export default RMDashboard