import React from 'react'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
  id: string
  type: 'report_created' | 'report_submitted' | 'report_approved' | 'report_rejected' | 'comment_added'
  user: string
  target: string
  timestamp: Date
}

// Mock data - replace with real data from API
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'report_created',
    user: 'John Doe',
    target: 'Site Visit - Project Alpha',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    type: 'report_submitted',
    user: 'Jane Smith',
    target: 'Foundation Inspection',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    type: 'report_approved',
    user: 'Mike Johnson',
    target: 'Structural Assessment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: '4',
    type: 'comment_added',
    user: 'Sarah Wilson',
    target: 'Electrical Works Review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
]

const activityIcons = {
  report_created: (
    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
      <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </div>
  ),
  report_submitted: (
    <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
      <svg className="h-4 w-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  report_approved: (
    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
      <svg className="h-4 w-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  ),
  report_rejected: (
    <div className="h-8 w-8 rounded-full bg-error/10 flex items-center justify-center">
      <svg className="h-4 w-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  ),
  comment_added: (
    <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center">
      <svg className="h-4 w-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </div>
  ),
}

const activityText = {
  report_created: 'created a new report',
  report_submitted: 'submitted a report for review',
  report_approved: 'approved a report',
  report_rejected: 'requested revisions for',
  comment_added: 'commented on',
}

export const ActivityFeed: React.FC = () => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {mockActivities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {index < mockActivities.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-secondary-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div className="flex-shrink-0">
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div>
                    <p className="text-sm text-secondary-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activityText[activity.type]}{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-secondary-500">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}