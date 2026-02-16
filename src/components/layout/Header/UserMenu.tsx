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
  ]

  return (
    <div className="py-1">
      {/* User Info */}
      <div className="px-4 py-2 border-b border-secondary-200">
        <p className="text-sm font-medium text-secondary-900">
          {user ? `${user.firstName} ${user.lastName}` : 'User'}
        </p>
        <p className="text-xs text-secondary-500">{user?.email}</p>
      </div>

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 flex items-center space-x-3"
        >
          <span className="text-secondary-400">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}

      {/* Logout */}
      <div className="border-t border-secondary-200 mt-2 pt-2">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center space-x-3"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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