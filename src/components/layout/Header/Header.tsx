import React from 'react'
import { Link } from 'react-router-dom'
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
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  const handleNotificationClick = () => {
    toggleNotifications()
  }

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            {/* Sidebar Toggle */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
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
                  d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="ml-4 flex items-center lg:ml-0">
              <img
                className="h-8 w-auto"
                src="/assets/images/logo.svg"
                alt="GeoBuild"
              />
              <span className="ml-2 text-xl font-semibold text-primary-600">
                GeoBuild
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-error text-white text-xs font-medium flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <Dropdown
              trigger={
                <button className="flex items-center space-x-3 focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-secondary-700">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </p>
                    <p className="text-xs text-secondary-500">{user?.role}</p>
                  </div>
                  <svg
                    className="h-5 w-5 text-secondary-400"
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