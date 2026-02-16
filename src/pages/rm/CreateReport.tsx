import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ReportForm } from '@/components/reports/ReportForm'
import { Card } from '@/components/common/Card'
import { useReports } from '@/hooks/useReports'
import { useAuth } from '@/hooks/useAuth'
import { CreateReportDto } from '@/types/report.types'
import toast from 'react-hot-toast'

export const CreateReport: React.FC = () => {
  const navigate = useNavigate()
  const { saveReport, uploadPhotos } = useReports()
  const { user } = useAuth()

  const handleSubmit = async (data: CreateReportDto, photos: File[], isDraft?: boolean) => {
    try {
      // First create the report
      const reportData = {
        ...data,
        title: data.title || `Report - ${data.ibpsNo || 'New'}`,
        visitDate: data.visitDate || new Date(),
        siteAddress: data.siteAddress || 'Site Location',
        rmId: user?.id,
        status: isDraft ? 'Draft' : 'PendingQsReview',
        workProgress: [],
        issues: [],
      }
      const report = await saveReport(reportData as any)

      // Then upload photos if any
      if (photos.length > 0 && report.id) {
        // Convert files to geotagged photos
        const geotaggedPhotos = await Promise.all(
          photos.map(async (file) => {
            // This would use your geotag extraction service
            return {
              id: Math.random().toString(),
              file,
              url: URL.createObjectURL(file),
              geotag: {
                latitude: 0,
                longitude: 0,
                timestamp: new Date(),
              },
              uploadedAt: new Date(),
            }
          })
        )

        await uploadPhotos(report.id, geotaggedPhotos)
      }

      toast.success('Report created successfully!')
      navigate(`/rm/reports/${report.id}`)
    } catch (error) {
      console.error('Create report error:', error)
      const msg = (error as any)?.message || 'Failed to create report'
      toast.error(msg)
    }
  }

  const handleCancel = () => {
    navigate('/rm/reports')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Create New Report</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Fill in the details below to create a new site visit report.
        </p>
      </div>

      <Card>
        <ReportForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

export default CreateReport
