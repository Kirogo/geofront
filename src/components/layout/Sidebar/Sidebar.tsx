// src/components/layout/Sidebar/Sidebar.tsx
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { useAuth } from '@/hooks/useAuth'

// Define menu items structure
interface MenuItem {
  id: string
  label: string
  path?: string
  icon: React.ReactNode
  roles?: string[]
  children?: MenuItem[]
}

interface SidebarProps {
  isDesktop: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isDesktop }) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const [activeItem, setActiveItem] = useState<string>('')
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // Set active item based on current path
  useEffect(() => {
    const path = location.pathname
    setActiveItem(path)
    
    // Auto-expand parent menus if child is active
    if (path.includes('/rm/reports') || path === '/rm') {
      setExpandedMenus(prev => [...new Set([...prev, 'reports'])])
    } else if (path.includes('/qs') || path === '/qs') {
      setExpandedMenus(prev => [...new Set([...prev, 'qs-workspace'])])
    } else if (path.includes('/admin') || path === '/admin') {
      setExpandedMenus(prev => [...new Set([...prev, 'administration'])])
    }
  }, [location.pathname])

  // Close sidebar on mobile after navigation
  const handleMobileClose = () => {
    if (!isDesktop) {
      dispatch(toggleSidebar())
    }
  }

  // Toggle expand/collapse
  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  // Handle item click
  const handleItemClick = (path?: string) => {
    if (path) {
      navigate(path)
      handleMobileClose()
    }
  }

  // Define all menu items (same as before)
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      roles: ['rm'],
      children: [
        {
          id: 'new-report',
          label: 'New Report',
          path: '/rm/reports/create',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
              <path d="M12 8v8M8 12h8" strokeWidth={1.8} />
            </svg>
          )
        },
        {
          id: 'my-reports',
          label: 'My Reports',
          path: '/rm/reports',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          )
        },
        {
          id: 'my-drafts',
          label: 'My Drafts',
          path: '/rm/reports?status=draft',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 2h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" strokeWidth={1.8} />
              <path d="M9 11h6M9 15h6" strokeWidth={1.8} />
            </svg>
          )
        },
        {
          id: 'submitted-to-qs',
          label: 'Submitted to QS',
          path: '/rm/reports?status=pending_qs_review',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        }
      ]
    },
    {
      id: 'qs-workspace',
      label: 'QS Workspace',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      roles: ['qs'],
      children: [
        {
          id: 'pending-reviews',
          label: 'Pending Reviews',
          path: '/qs/reviews',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M22 2L11 13" strokeWidth={1.8} />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth={1.5} />
            </svg>
          )
        },
        {
          id: 'site-visits',
          label: 'Site Visits',
          path: '/qs/site-visits',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        }
      ]
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      roles: ['admin'],
      children: [
        {
          id: 'manage-users',
          label: 'Manage Users',
          path: '/admin/users',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        },
        {
          id: 'manage-clients',
          label: 'Manage Clients',
          path: '/admin/clients',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        },
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          path: '/admin/audit-logs',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        },
        {
          id: 'system-settings',
          label: 'System Settings',
          path: '/admin/settings',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          )
        }
      ]
    }
  ]

  // Filter menu items based on user role
  const getVisibleMenuItems = () => {
    if (!user) return []
    
    return menuItems.filter(item => {
      if (!item.roles) return true
      return item.roles.some(role => hasRole(role))
    })
  }

  // Check if a menu item or its children is active
  const isItemActive = (item: MenuItem): boolean => {
    // For Dashboard - check if current path is role-specific dashboard
    if (item.id === 'dashboard') {
      return activeItem === '/rm' || activeItem === '/qs' || activeItem === '/admin' || activeItem === '/dashboard'
    }
    
    if (item.path === activeItem) return true
    if (item.children) {
      return item.children.some(child => child.path === activeItem)
    }
    return false
  }

  // Render menu item
  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedMenus.includes(item.id)
    const active = isItemActive(item)
    const isChildActive = item.children?.some(child => child.path === activeItem)
    const paddingLeft = depth === 0 ? 'pl-3' : `pl-${depth * 4 + 8}`

    // If item has children (dropdown)
    if (hasChildren) {
      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.id)}
            className={`
              w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
              transition-all duration-200
              ${isChildActive || active
                ? 'bg-[#D6BD98]/30 text-[#1A3636]'
                : isExpanded
                  ? 'bg-[#D6BD98]/20 text-[#1A3636]'
                  : 'text-[#40534C] hover:bg-[#D6BD98]/10 hover:text-[#1A3636]'
              }
            `}
          >
            <div className={`flex items-center space-x-3 ${paddingLeft}`}>
              <span className={`w-5 ${isChildActive || active || isExpanded ? 'text-[#1A3636]' : 'text-[#677D6A]'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
            
            <svg
              className={`
                h-4 w-4 transition-transform duration-200
                ${isExpanded ? 'rotate-180' : ''}
                ${isChildActive || active || isExpanded ? 'text-[#1A3636]' : 'text-[#677D6A]'}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div className="pl-4 space-y-1 mt-1 border-l-2 border-[#D6BD98]/30 ml-6">
              {item.children?.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    // Regular menu item (link)
    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item.path)}
        className={`
          w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
          transition-all duration-200
          ${active
            ? 'bg-[#D6BD98] text-[#1A3636] font-semibold'
            : 'text-[#40534C] hover:bg-[#D6BD98]/10 hover:text-[#1A3636]'
          }
        `}
      >
        <div className={`flex items-center space-x-3 ${paddingLeft}`}>
          <span className={`w-5 ${active ? 'text-[#1A3636]' : 'text-[#677D6A]'}`}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </div>
        
        {active && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A3636] mr-2"></span>
        )}
      </button>
    )
  }

  const visibleMenuItems = getVisibleMenuItems()

  // Determine sidebar classes based on screen size
  const getSidebarClasses = () => {
    if (isDesktop) {
      // On desktop: always visible, no transform
      return 'translate-x-0 lg:translate-x-0'
    }
    // On mobile: slide based on sidebarOpen state
    return sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  }

  return (
    <>
      {/* Mobile Overlay - Only shows when sidebar is open on mobile */}
      {!isDesktop && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#D6BD98]/20
        transition-transform duration-300 ease-in-out
        ${getSidebarClasses()}
        flex flex-col h-screen
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#D6BD98]/20">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-[#1A3636] to-[#40534C] rounded-lg flex items-center justify-center">
              <span className="text-[#D6BD98] font-bold text-lg">G</span>
            </div>
            <span className="text-lg font-semibold text-[#1A3636]">GeoBuild</span>
          </div>
          
          {/* Close button for mobile */}
          {!isDesktop && (
            <button
              onClick={handleMobileClose}
              className="p-1 rounded-md text-[#40534C] hover:bg-[#D6BD98]/10"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto" style={{ height: 'calc(100vh - 130px)' }}>
          <div className="space-y-1">
            {visibleMenuItems.map(item => renderMenuItem(item))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[#D6BD98]/20 bg-white">
          <div className="text-xs text-[#677D6A]">
            <p className="font-medium text-[#1A3636]">GeoBuild v1.0.0</p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </div>
      </aside>
    </>
  )
}