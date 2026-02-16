import React from 'react'
import { SiteVisitReport } from '@/types/report.types'
import { ReviewItem } from './ReviewItem'

interface ReviewQueueProps {
    reports: SiteVisitReport[]
    onAssign?: (reportId: string) => void
    onView: (reportId: string) => void
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({ reports, onAssign, onView }) => {
    return (
        <div className="space-y-4">
            {reports.length === 0 ? (
                <div className="text-center py-8 text-secondary-500 bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-200">
                    <p>No reports in the review queue.</p>
                </div>
            ) : (
                reports.map((report) => (
                    <ReviewItem
                        key={report.id}
                        report={report}
                        onAssign={onAssign ? () => onAssign(report.id) : undefined}
                        onView={() => onView(report.id)}
                    />
                ))
            )}
        </div>
    )
}
