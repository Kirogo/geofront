import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/common/Card'

export const QuickActions: React.FC = () => {
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const actions = [
    // 'New Report' action removed from QuickActions per UI preference
    {
      title: 'Review Reports',
      description: 'Review pending reports',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: () => navigate('/qs/reviews'),
      roles: ['qs'],
    },
    {
      title: 'Schedule Visit',
      description: 'Schedule a site visit',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => navigate('/qs/site-visits'),
      roles: ['qs'],
    },
    {
      title: 'Manage Clients',
      description: 'Add or update client information',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      onClick: () => navigate('/admin/clients'),
      roles: ['admin'],
    },
  ]

  const filteredActions = actions.filter(action => 
    !action.roles || action.roles.some(role => hasRole(role))
  )

  return (
    <>
      {filteredActions.map((action, index) => (
        <Card
          key={index}
          hoverable
          onClick={action.onClick}
          className="cursor-pointer hover:border-primary-300"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                {action.icon}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary-900">
                {action.title}
              </h3>
              <p className="mt-1 text-sm text-secondary-500">
                {action.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}