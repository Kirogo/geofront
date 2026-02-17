// src/components/layout/Header/Header.tsx
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Dropdown } from '@/components/common/Dropdown'
import { UserMenu } from './UserMenu'

export const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { unreadCount, toggleNotifications } = useNotifications()
  const { currentPageTitle } = useAppSelector((state) => state.ui)

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <header className="bg-white border-b border-[#D6BD98]/20 sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Mobile menu button + Page title */}
          <div className="flex items-center">
            {/* Mobile Menu Toggle - Only visible on mobile */}
            <button
              onClick={handleToggleSidebar}
              className="lg:hidden p-2 rounded-md text-[#40534C] hover:bg-[#D6BD98]/10 hover:text-[#1A3636] focus:outline-none focus:ring-2 focus:ring-[#677D6A] mr-2"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-[#1A3636]">
              {currentPageTitle || 'Dashboard'}
            </h1>
          </div>

          {/* Right section - Notifications & User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <button
              onClick={toggleNotifications}
              className="relative p-2 rounded-full text-[#40534C] hover:text-[#1A3636] hover:bg-[#D6BD98]/10 focus:outline-none focus:ring-2 focus:ring-[#677D6A] transition-colors duration-200"
              aria-label="Notifications"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#1A3636] text-white text-xs font-medium ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <Dropdown
              trigger={
                <button className="flex items-center space-x-2 sm:space-x-3 focus:outline-none group p-1 rounded-lg hover:bg-[#D6BD98]/10 transition-colors duration-200">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-[#677D6A] to-[#40534C] flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                    <span className="text-sm sm:text-base font-medium text-white">
                      {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                      {user?.lastName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-[#1A3636]">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </p>
                    <p className="text-xs text-[#677D6A] capitalize">{user?.role?.toLowerCase() || 'RM'}</p>
                  </div>
                  
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-[#677D6A] group-hover:text-[#40534C] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              }
              placement="bottom-right"
            >
              <UserMenu />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}