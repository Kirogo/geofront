// src/components/dashboard/StatsCards.tsx
import React from 'react'
import { Card } from '@/components/common/Card'

interface StatsCardsProps {
  stats: {
    totalReports: number
    pendingReviews: number
    approved: number
    revisions: number
  }
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      bgColor: 'bg-[#1A3636]',
      textColor: 'text-white',
      iconBg: 'bg-[#40534C]',
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: 'bg-[#40534C]',
      textColor: 'text-white',
      iconBg: 'bg-[#677D6A]',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: 'bg-[#677D6A]',
      textColor: 'text-white',
      iconBg: 'bg-[#40534C]',
    },
    {
      title: 'Needs Revision',
      value: stats.revisions,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
          />
        </svg>
      ),
      bgColor: 'bg-[#D6BD98]',
      textColor: 'text-[#1A3636]',
      iconBg: 'bg-[#1A3636]/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.bgColor} ${card.textColor} border-0 shadow-md hover:shadow-lg transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`${card.iconBg} p-3 rounded-lg bg-opacity-20`}>
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}