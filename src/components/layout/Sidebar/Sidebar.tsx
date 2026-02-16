import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { useAuth } from '@/hooks/useAuth'
import { SidebarItem } from './SidebarItem'
import { NavItems, NavItem } from './NavItems'

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { hasRole, hasPermission } = useAuth()

  const filterNavItems = (items: NavItem[]): NavItem[] => {
    return items.filter(item => {
      // Check role requirements
      if (item.roles && !item.roles.some(role => hasRole(role))) {
        return false
      }
      
      // Check permission requirements
      if (item.permissions && !item.permissions.every(perm => hasPermission(perm))) {
        return false
      }
      
      // Filter children recursively
      if (item.children) {
        item.children = filterNavItems(item.children)
        return item.children.length > 0
      }
      
      return true
    })
  }

  const filteredNavItems = filterNavItems(NavItems)

  if (!sidebarOpen) {
    return null
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-secondary-200 pt-16 lg:pt-0">
      <div className="h-full flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <SidebarItem key={item.path || item.label} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xs font-medium text-primary-700">v1.0</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-secondary-900 truncate">
                GeoBuild v1.0.0
              </p>
              <p className="text-xs text-secondary-500 truncate">
                © 2024 All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}