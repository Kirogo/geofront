// src/components/reports/ReportForm/ReportForm.tsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { IBPSLookup } from '../IBPSLookup'   // Changed from './IBPSLookup' to '../IBPSLookup'
import { ClientSearch } from './ClientSearch'  // This one is in the same folder - correct
import { PhotoUpload } from '../PhotoUpload'  // Changed from './PhotoUpload' to '../PhotoUpload'
import { DocumentAccordion } from './DocumentAccordion'  // In same folder
import { WorkProgressSection } from './WorkProgressSection'  // In same folder
import { IssuesSection } from './IssuesSection'  // In same folder
import { SiteDetailsSection } from './SiteDetailsSection'  // In same folder
import { GeoLocationMap } from './GeoLocationMap'  // In same folder
import { CreateReportDto, WorkProgress, Issue } from '@/types/report.types'
import { GeotagData } from '@/types/geotag.types'
import { Client } from '@/types/client.types'
import { 
  ChevronRight, 
  ChevronLeft,
  AlertCircle 
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ReportFormProps {
  id?: string
  onSubmit: (
    data: Omit<CreateReportDto, 'workProgress' | 'issues' | 'photos' | 'attachments'>,
    workProgress: Omit<WorkProgress, 'id'>[],
    issues: Omit<Issue, 'id'>[],
    photos: File[],
    attachments: File[],
    isDraft?: boolean
  ) => Promise<void>
  onCancel: () => void
  onStepChange?: (step: number) => void
}

export const ReportForm: React.FC<ReportFormProps> = ({
  id,
  onSubmit,
  onCancel,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [attachments, setAttachments] = useState<File[]>([])
  const [workProgress, setWorkProgress] = useState<Omit<WorkProgress, 'id'>[]>([])
  const [issues, setIssues] = useState<Omit<Issue, 'id'>[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [facilityData, setFacilityData] = useState<any>(null)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Omit<CreateReportDto, 'workProgress' | 'issues' | 'photos' | 'attachments'>>({
    defaultValues: {
      documents: []
    }
  })

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStep)
  }, [currentStep, onStepChange])

const handleFacilityLookup = (data: any) => {
  setFacilityData(data)
  // Auto-populate form fields with the facility data
  setValue('clientId', data.clientId)
  setValue('projectName', data.projectName)
  setValue('siteAddress', data.siteAddress)
  setValue('loanType', data.loanType)
  
  // You can also store the full facility data if needed
  console.log('Facility data loaded:', data)
}

  const handleClientSelect = (client: Client) => {
    setValue('clientId', client.id)
    setValue('projectName', client.projectName || '')
    if (client.address) {
      setValue('siteAddress', client.address)
    }
  }

  const handleLocationCapture = (geotag: GeotagData) => {
    setValue('siteCoordinates', geotag)
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const onFormSubmit = async (data: Omit<CreateReportDto, 'workProgress' | 'issues' | 'photos' | 'attachments'>, event?: React.BaseSyntheticEvent) => {
    setIsSubmitting(true)
    try {
      const submitter = (event?.nativeEvent as any)?.submitter
      const isDraft = submitter?.value === 'draft'
      
      // Validate required fields based on step
      if (!isDraft) {
        if (!data.clientId) {
          toast.error('Please select a client')
          setCurrentStep(1)
          return
        }
        if (!data.siteAddress) {
          toast.error('Please enter site address')
          setCurrentStep(2)
          return
        }
      }
      
      await onSubmit(data, workProgress, issues, photos, attachments, isDraft)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#677D6A] text-white flex items-center justify-center font-semibold">
                1
              </div>
              <h3 className="text-lg font-semibold text-[#1A3636]">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <IBPSLookup onLookup={handleFacilityLookup} />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D6BD98]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#40534C]">OR</span>
                </div>
              </div>

              <ClientSearch onClientSelect={handleClientSelect} />

              <div>
                <label className="block text-sm font-medium text-[#40534C] mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent"
                  placeholder="Enter report title"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#40534C] mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent"
                  placeholder="Brief description of the site visit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#40534C] mb-1">
                  Project Name
                </label>
                <input
                  {...register('projectName')}
                  className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#40534C] mb-1">
                  Loan Type
                </label>
                <select
                  {...register('loanType')}
                  className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent"
                >
                  <option value="">Select loan type</option>
                  <option value="construction">Construction Loan</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="development">Property Development</option>
                  <option value="renovation">Renovation Loan</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#677D6A] text-white flex items-center justify-center font-semibold">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#1A3636]">Site Visit Details</h3>
            </div>

            <SiteDetailsSection
              register={register}
              errors={errors}
            />
            
            <GeoLocationMap onLocationCapture={handleLocationCapture} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#40534C] mb-1">
                  Weather Conditions
                </label>
                <select
                  {...register('weather')}
                  className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent"
                >
                  <option value="">Select weather</option>
                  <option value="sunny">Sunny</option>
                  <option value="cloudy">Cloudy</option>
                  <option value="rainy">Rainy</option>
                  <option value="windy">Windy</option>
                  <option value="foggy">Foggy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#40534C] mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  {...register('temperature', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent"
                  placeholder="e.g., 25"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#677D6A] text-white flex items-center justify-center font-semibold">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#1A3636]">Work Progress</h3>
            </div>

            <WorkProgressSection
              workProgress={workProgress}
              onChange={setWorkProgress}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#677D6A] text-white flex items-center justify-center font-semibold">
                4
              </div>
              <h3 className="text-lg font-semibold text-[#1A3636]">Issues & Concerns</h3>
            </div>

            <IssuesSection
              issues={issues}
              onChange={setIssues}
            />
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#677D6A] text-white flex items-center justify-center font-semibold">
                5
              </div>
              <h3 className="text-lg font-semibold text-[#1A3636]">Photos & Documents</h3>
            </div>

            <PhotoGallery 
              photos={photos} 
              onPhotosChange={setPhotos}
            />
            
            <PhotoUpload 
              photos={photos} 
              onPhotosChange={setPhotos}
            />
            
            <DocumentAccordion 
              documents={attachments} 
              onDocumentsChange={setAttachments} 
            />
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#677D6A] text-white flex items-center justify-center font-semibold">
                6
              </div>
              <h3 className="text-lg font-semibold text-[#1A3636]">Review & Submit</h3>
            </div>

            <div className="bg-[#D6BD98]/10 p-6 rounded-lg space-y-4">
              <h4 className="font-medium text-[#1A3636]">Please review your information before submitting</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-[#D6BD98]/30">
                  <span className="text-[#40534C]">Client:</span>
                  <span className="font-medium text-[#1A3636]">{watch('clientId') || 'Not selected'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D6BD98]/30">
                  <span className="text-[#40534C]">Project:</span>
                  <span className="font-medium text-[#1A3636]">{watch('projectName') || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D6BD98]/30">
                  <span className="text-[#40534C]">Visit Date:</span>
                  <span className="font-medium text-[#1A3636]">
                    {watch('visitDate') ? new Date(watch('visitDate')).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D6BD98]/30">
                  <span className="text-[#40534C]">Work Progress Items:</span>
                  <span className="font-medium text-[#1A3636]">{workProgress.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D6BD98]/30">
                  <span className="text-[#40534C]">Issues Logged:</span>
                  <span className="font-medium text-[#1A3636]">{issues.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D6BD98]/30">
                  <span className="text-[#40534C]">Photos:</span>
                  <span className="font-medium text-[#1A3636]">{photos.length} uploaded</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D6BD98]/30">
                  <span className="text-[#40534C]">Documents:</span>
                  <span className="font-medium text-[#1A3636]">{attachments.length} uploaded</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  By submitting, you confirm that all information provided is accurate and photos are geo-tagged.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form id={id} onSubmit={handleSubmit((data, event) => onFormSubmit(data, event))}>
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-[#D6BD98]/30">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            currentStep === 1
              ? 'text-[#677D6A] cursor-not-allowed'
              : 'text-[#40534C] hover:bg-[#D6BD98]/20'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-[#40534C] text-white rounded-lg hover:bg-[#1A3636] transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="submit"
              name="action"
              value="draft"
              disabled={isSubmitting}
              className="px-6 py-2 border border-[#677D6A] text-[#40534C] rounded-lg hover:bg-[#D6BD98]/10 transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              name="action"
              value="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1A3636] text-white rounded-lg hover:bg-[#40534C] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Report'
              )}
            </button>
          </div>
        )}
      </div>
    </form>
  )
}