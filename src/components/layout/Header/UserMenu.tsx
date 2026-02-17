// src/components/layout/Header/UserMenu.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export const UserMenu: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    {
      label: 'Profile',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Settings',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      onClick: () => navigate('/settings'),
    },
    {
      label: 'Help & Support',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      onClick: () => navigate('/help'),
    },
  ]

  return (
    <div className="w-56 py-2 bg-white rounded-lg shadow-lg border border-[#D6BD98]/20">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-[#D6BD98]/20">
        <p className="text-sm font-semibold text-[#1A3636]">
          {user ? `${user.firstName} ${user.lastName}` : 'User'}
        </p>
        <p className="text-xs text-[#677D6A] mt-0.5">{user?.email}</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#677D6A]/10 text-[#40534C] capitalize">
            {user?.role?.toLowerCase() || 'RM'}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full text-left px-4 py-2.5 text-sm text-[#40534C] hover:text-[#1A3636] hover:bg-[#D6BD98]/10 flex items-center space-x-3 transition-colors duration-150"
          >
            <span className="text-[#677D6A] group-hover:text-[#40534C]">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-[#D6BD98]/20 mt-1 pt-1">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2.5 text-sm text-[#1A3636] hover:text-[#1A3636] hover:bg-[#D6BD98]/10 flex items-center space-x-3 transition-colors duration-150"
        >
          <svg className="h-5 w-5 text-[#677D6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}