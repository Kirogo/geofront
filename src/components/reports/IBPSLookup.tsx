// src/components/reports/IBPSLookup.tsx
import React, { useState } from 'react'
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Layers,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useFacility, FacilityLookupResult } from '@/hooks/useFacility'
import toast from 'react-hot-toast'

interface IBPSLookupProps {
  onLookup: (data: FacilityLookupResult) => void
}

export const IBPSLookup: React.FC<IBPSLookupProps> = ({ onLookup }) => {
  const [ibpsNo, setIbpsNo] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    milestones: false,
    tranches: false
  })
  const { getFacilityByIBPS, validateIBPS, loading, error, facility } = useFacility()

  const handleLookup = async () => {
    if (!ibpsNo.trim()) {
      toast.error('Please enter IBPS number')
      return
    }

    try {
      const facilityData = await getFacilityByIBPS(ibpsNo)
      onLookup(facilityData)
      setShowDetails(true)
    } catch (err) {
      // Error is already handled in the hook
    }
  }

  const toggleSection = (section: 'milestones' | 'tranches') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-[#1A3636]/5 to-[#677D6A]/5 p-6 rounded-lg">
        <label className="block text-sm font-medium text-[#40534C] mb-2">
          IBPS Facility Number
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={ibpsNo}
              onChange={(e) => {
                setIbpsNo(e.target.value)
                setShowDetails(false)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLookup()
                }
              }}
              placeholder="Enter IBPS number..."
              className="w-full px-4 py-3 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent pl-10"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-[#677D6A]" />
          </div>
          <button
            type="button"
            onClick={handleLookup}
            disabled={loading}
            className="px-6 py-3 bg-[#40534C] text-white rounded-lg hover:bg-[#1A3636] transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Lookup'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Facility Details */}
      {showDetails && facility && (
        <div className="border border-[#D6BD98] rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A3636] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#D6BD98]" />
                <h4 className="font-semibold">Facility Details</h4>
              </div>
              <span className="text-xs bg-[#D6BD98] text-[#1A3636] px-2 py-1 rounded-full font-mono">
                {facility.ibpsNumber}
              </span>
            </div>
          </div>

          {/* Main Details */}
          <div className="p-4 space-y-4">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#40534C]">Customer Name</p>
                <p className="font-medium text-[#1A3636]">{facility.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-[#40534C]">Project</p>
                <p className="font-medium text-[#1A3636]">{facility.projectDescription || 'N/A'}</p>
              </div>
            </div>

            {/* Amount and Location */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-[#677D6A] bg-[#D6BD98]/10 px-3 py-1.5 rounded-lg">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">{formatCurrency(facility.totalApprovedAmount)}</span>
              </div>
              {facility.siteLatitude && facility.siteLongitude && (
                <div className="flex items-center gap-1 text-[#677D6A] bg-[#D6BD98]/10 px-3 py-1.5 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <span>Geo-tagged location available</span>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-4 bg-[#D6BD98]/10 p-3 rounded-lg">
              <div>
                <p className="text-xs text-[#40534C]">Total Disbursed</p>
                <p className="font-medium text-[#1A3636]">
                  {formatCurrency(facility.tranches
                    .filter(t => t.status.toLowerCase() === 'disbursed')
                    .reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#40534C]">Remaining</p>
                <p className="font-medium text-[#1A3636]">
                  {formatCurrency(facility.totalApprovedAmount - facility.tranches
                    .filter(t => t.status.toLowerCase() === 'disbursed')
                    .reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
            </div>

            {/* Milestones Section */}
            {facility.milestones.length > 0 && (
              <div className="border border-[#D6BD98] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('milestones')}
                  className="w-full flex items-center justify-between p-3 bg-[#D6BD98]/10 hover:bg-[#D6BD98]/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#677D6A]" />
                    <span className="font-medium text-[#1A3636]">Milestones</span>
                    <span className="text-xs bg-[#677D6A] text-white px-2 py-0.5 rounded-full">
                      {facility.milestones.length}
                    </span>
                  </div>
                  {expandedSections.milestones ? (
                    <ChevronUp className="w-4 h-4 text-[#677D6A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#677D6A]" />
                  )}
                </button>
                
                {expandedSections.milestones && (
                  <div className="p-3 space-y-2">
                    {facility.milestones
                      .sort((a, b) => a.milestoneOrder - b.milestoneOrder)
                      .map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between text-sm py-2 border-b border-[#D6BD98]/30 last:border-0">
                          <div className="flex-1">
                            <p className="text-[#1A3636]">{milestone.description}</p>
                            <p className="text-xs text-[#40534C]">Order: {milestone.milestoneOrder}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[#677D6A] font-medium">
                              {formatCurrency(milestone.allocatedAmount)}
                            </span>
                            {milestone.isAchieved ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                                ✓ Achieved
                                {milestone.achievedDate && ` ${formatDate(milestone.achievedDate)}`}
                              </span>
                            ) : (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full whitespace-nowrap">
                                ⏳ Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Tranches Section */}
            {facility.tranches.length > 0 && (
              <div className="border border-[#D6BD98] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('tranches')}
                  className="w-full flex items-center justify-between p-3 bg-[#D6BD98]/10 hover:bg-[#D6BD98]/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#677D6A]" />
                    <span className="font-medium text-[#1A3636]">Drawdown Tranches</span>
                    <span className="text-xs bg-[#677D6A] text-white px-2 py-0.5 rounded-full">
                      {facility.tranches.length}
                    </span>
                  </div>
                  {expandedSections.tranches ? (
                    <ChevronUp className="w-4 h-4 text-[#677D6A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#677D6A]" />
                  )}
                </button>
                
                {expandedSections.tranches && (
                  <div className="p-3 space-y-2">
                    {facility.tranches
                      .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime())
                      .map((tranche) => (
                        <div key={tranche.id} className="flex items-center justify-between text-sm py-2 border-b border-[#D6BD98]/30 last:border-0">
                          <div className="flex-1">
                            <p className="text-[#1A3636] font-medium">{tranche.trancheNumber}</p>
                            <p className="text-xs text-[#40534C]">
                              Requested: {formatDate(tranche.requestDate)}
                              {tranche.disbursementDate && ` • Disbursed: ${formatDate(tranche.disbursementDate)}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[#677D6A] font-medium">
                              {formatCurrency(tranche.amount)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                              tranche.status.toLowerCase() === 'disbursed' 
                                ? 'bg-green-100 text-green-700'
                                : tranche.status.toLowerCase() === 'approved'
                                ? 'bg-blue-100 text-blue-700'
                                : tranche.status.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tranche.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Auto-populate indicator */}
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Facility details will auto-populate the form</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}