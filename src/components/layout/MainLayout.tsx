// src/components/layout/MainLayout.tsx
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header/Header'
import { Sidebar } from './Sidebar/Sidebar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCurrentPageTitle } from '@/store/slices/uiSlice'
import { ReportCreateModal } from '../reports/ReportCreateModal'

// Map paths to page titles
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/rm': 'Dashboard',
  '/rm/reports/create': 'New Report',
  '/rm/reports': 'My Reports',
  '/rm/reports?status=draft': 'My Drafts',
  '/rm/reports?status=pending_qs_review': 'Submitted to QS',
  '/qs': 'Workspace',
  '/qs/reviews': 'Pending Reviews',
  '/qs/site-visits': 'Site Visits',
  '/admin': 'Admin Dashboard',
  '/admin/users': 'Manage Users',
  '/admin/clients': 'Manage Clients',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/settings': 'System Settings',
  '/profile': 'Profile',
  '/notifications': 'Notifications',
  '/settings': 'Settings'
}

export const MainLayout: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Set page title based on current route
  useEffect(() => {
    const path = location.pathname
    const title = pageTitles[path] || 'Dashboard'
    dispatch(setCurrentPageTitle(title))
  }, [location.pathname, dispatch])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Determine margin based on screen size and sidebar state
  const getContentMargin = () => {
    if (isDesktop) {
      // On desktop, sidebar is ALWAYS visible, so always have margin
      return 'lg:ml-64'
    }
    // On mobile, no margin regardless of sidebar state
    return 'ml-0'
  }

  return (
    <div className="min-h-screen bg-[#F5F7F4]">
      {/* Sidebar */}
      <Sidebar isDesktop={isDesktop} />

      {/* Main Content - Margin only on desktop, never on mobile */}
      <div className={`
        flex flex-col min-h-screen
        transition-all duration-300 ease-in-out
        ${getContentMargin()}
      `}>
        <Header />
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#D6BD98]/20 py-4 text-center text-sm text-[#677D6A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            © {new Date().getFullYear()} GeoBuild. All rights reserved.
          </div>
        </footer>
      </div>

      <ReportCreateModal />
    </div>
  )
}

export default MainLayout