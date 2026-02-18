// src/components/dashboard/StatsCards.tsx
import React from 'react'

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
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      gradient: 'from-[#1A3636] to-[#40534C]',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: 'from-[#40534C] to-[#677D6A]',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: 'from-[#677D6A] to-[#95A89B]',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Needs Revision',
      value: stats.revisions,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      gradient: 'from-[#D6BD98] to-[#E3D0B2]',
      textColor: 'text-[#1A3636]',
      iconBg: 'bg-[#1A3636]/10',
      trend: '-2%',
      trendUp: false
    },
  ]

  return (
    <>
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.gradient} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${card.title === 'Needs Revision' ? 'text-[#40534C]' : 'text-white/80'}`}>
                {card.title}
              </p>
              <p className={`text-2xl lg:text-3xl font-bold mt-1 ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.iconBg} p-3 rounded-lg backdrop-blur-sm`}>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
          </div>
          
          {/* Trend Indicator */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className={`text-xs font-medium ${card.title === 'Needs Revision' ? 'text-[#40534C]' : 'text-white/90'}`}>
              {card.trend}
            </span>
            {card.trendUp ? (
              <svg className={`w-3 h-3 ${card.title === 'Needs Revision' ? 'text-[#40534C]' : 'text-white/90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className={`w-3 h-3 ${card.title === 'Needs Revision' ? 'text-[#40534C]' : 'text-white/90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span className={`text-xs ${card.title === 'Needs Revision' ? 'text-[#40534C]' : 'text-white/90'}`}>
              vs last month
            </span>
          </div>

          {/* Subtle decorative element */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
        </div>
      ))}
    </>
  )
}