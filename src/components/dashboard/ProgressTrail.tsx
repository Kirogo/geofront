// src/components/dashboard/ProgressTrail.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { SiteVisitReport } from '@/types/report.types'
import { 
  Users, 
  FormInput, 
  MapPin, 
  Image, 
  FileUp, 
  Eye, 
  Send,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Building2,
  Calendar,
  User
} from 'lucide-react'

interface ProgressTrailProps {
  reports: SiteVisitReport[]
  isLoading?: boolean
}

const stepIcons = {
  1: Users,
  2: FormInput,
  3: MapPin,
  4: Image,
  5: FileUp,
  6: Eye,
  7: Send
}

const stepNames = {
  1: 'Customer Details',
  2: 'Form',
  3: 'Site Visit',
  4: 'Photos',
  5: 'Documents',
  6: 'Review',
  7: 'Submit'
}

const stepColors = {
  1: 'from-primary-400 to-primary-900',
  2: 'from-primary-400 to-primary-900',
  3: 'from-primary-400 to-primary-900',
  4: 'from-primary-400 to-primary-900',
  5: 'from-primary-400 to-primary-900',
  6: 'from-primary-400 to-primary-900',
  7: 'from-primary-400 to-primary-900'
}

export const ProgressTrail: React.FC<ProgressTrailProps> = ({ 
  reports, 
  isLoading = false 
}) => {
  const navigate = useNavigate()

  // Get status color and label
  const getStatusInfo = (report: SiteVisitReport) => {
    const step = report.currentStep || 1
    const statusMap: Record<number, { label: string; color: string }> = {
      1: { label: 'Customer Details', color: 'bg-blue-100 text-blue-700' },
      2: { label: 'Form', color: 'bg-purple-100 text-purple-700' },
      3: { label: 'Site Visit', color: 'bg-amber-100 text-amber-700' },
      4: { label: 'Photos', color: 'bg-emerald-100 text-emerald-700' },
      5: { label: 'Documents', color: 'bg-rose-100 text-rose-700' },
      6: { label: 'Review', color: 'bg-indigo-100 text-indigo-700' },
      7: { label: 'Submitted', color: 'bg-[#D6BD98]/30 text-[#1A3636]' }
    }
    return statusMap[step] || { label: 'Draft', color: 'bg-gray-100 text-gray-700' }
  }

  // Calculate days ago
  const getDaysAgo = (date: Date) => {
    const diff = new Date().getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  if (isLoading) {
    return (
      <Card className="border border-[#D6BD98]/20 h-full">
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-[#1A3636] mb-4">Progress Trail</h2>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-[#F5F7F4] rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-[#D6BD98]/20 h-full overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#1A3636] to-[#40534C] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D6BD98]" />
            <h2 className="text-base sm:text-lg font-semibold text-white">Progress Trail</h2>
          </div>
          <button
            onClick={() => navigate('/rm/reports')}
            className="text-xs sm:text-sm text-[#D6BD98] hover:text-white transition-colors flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
        <p className="text-xs text-[#D6BD98]/80 mt-1">
          Track your active reports • {reports.length} in progress
        </p>
      </div>

      {/* Scrollable Reports List */}
      <div 
        className="overflow-y-auto max-h-[500px] p-4 sm:p-6 space-y-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#D6BD98 #F5F7F4' }}
      >
        {reports.length > 0 ? (
          reports.map((report) => {
            const statusInfo = getStatusInfo(report)
            const currentStep = report.currentStep || 1
            const progress = (currentStep / 7) * 100
            const daysAgo = getDaysAgo(report.updatedAt || report.createdAt)
            const StepIcon = stepIcons[currentStep as keyof typeof stepIcons]

            return (
              <button
                key={report.id}
                onClick={() => navigate(`/rm/reports/${report.id}`)}
                className="w-full group"
              >
                <div className="relative bg-white rounded-xl border border-[#D6BD98]/20 hover:border-[#677D6A]/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                  {/* Progress bar at top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5F7F4]">
                    <div 
                      className={`h-full bg-gradient-to-r ${stepColors[currentStep as keyof typeof stepColors]}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    {/* Header with client and status */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#677D6A] flex-shrink-0" />
                          <p className="text-xs sm:text-sm font-medium text-[#40534C] truncate">
                            {report.clientName || 'Client Name'}
                          </p>
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-[#1A3636] truncate mt-0.5 text-left">
                          {report.title}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Current Step Indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${stepColors[currentStep as keyof typeof stepColors]} flex items-center justify-center`}>
                        <StepIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-[#1A3636]">
                        Step {currentStep}: {stepNames[currentStep as keyof typeof stepNames]}
                      </span>
                    </div>

                    {/* Timeline Icons - Hidden on mobile, visible on tablet/desktop */}
                    <div className="hidden sm:flex items-center justify-between mb-3">
                      {[1, 2, 3, 4, 5, 6, 7].map((step) => {
                        const Icon = stepIcons[step as keyof typeof stepIcons]
                        const isCompleted = step < currentStep
                        const isCurrent = step === currentStep
                        const stepProgress = report.stepProgress?.[step as keyof typeof report.stepProgress]
                        
                        return (
                          <div key={step} className="flex flex-col items-center flex-1">
                            <div className="relative">
                              <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center transition-all
                                ${isCompleted 
                                  ? 'bg-[#677D6A] text-white' 
                                  : isCurrent
                                  ? 'bg-[#1A3636] text-white ring-2 ring-[#D6BD98] ring-offset-1'
                                  : 'bg-[#D6BD98]/30 text-[#40534C]'
                                }
                              `}>
                                <Icon className="w-3 h-3" />
                              </div>
                              {stepProgress?.completedAt && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
                              )}
                            </div>
                            <span className="text-[8px] mt-1 text-[#40534C]">
                              {step}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Mobile-friendly progress view */}
                    <div className="sm:hidden mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#40534C]">Progress</span>
                        <span className="font-medium text-[#1A3636]">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 bg-[#D6BD98]/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${stepColors[currentStep as keyof typeof stepColors]}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer with metadata */}
                    <div className="flex items-center justify-between mt-2 text-xs text-[#677D6A]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Updated {daysAgo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>RM-{report.rmId?.slice(-3) || '001'}</span>
                      </div>
                    </div>

                    {/* Completion indicators for completed steps */}
                    {currentStep === 7 && (
                      <div className="mt-2 flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-xs">Completed on {new Date(report.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D6BD98]/20 mb-3">
              <AlertCircle className="w-6 h-6 text-[#677D6A]" />
            </div>
            <p className="text-sm text-[#40534C]">No reports in progress</p>
            <button
              onClick={() => navigate('/rm/reports/create')}
              className="mt-4 text-sm text-[#1A3636] font-medium hover:text-[#677D6A] transition-colors"
            >
              Create your first report →
            </button>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {reports.length > 0 && (
        <div className="border-t border-[#D6BD98]/20 bg-[#F5F7F4] px-4 sm:px-6 py-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-[#1A3636]">
                {reports.filter(r => (r.currentStep || 1) < 7).length}
              </p>
              <p className="text-xs text-[#677D6A]">In Progress</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#1A3636]">
                {reports.filter(r => r.currentStep === 7).length}
              </p>
              <p className="text-xs text-[#677D6A]">Submitted</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#1A3636]">
                {Math.round(reports.reduce((acc, r) => acc + ((r.currentStep || 1) / 7 * 100), 0) / reports.length)}%
              </p>
              <p className="text-xs text-[#677D6A]">Avg Progress</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}