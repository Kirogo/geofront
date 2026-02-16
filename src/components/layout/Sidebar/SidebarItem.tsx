import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { NavItem } from './NavItems'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/slices/uiSlice'

interface SidebarItemProps {
  item: NavItem
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-secondary-700 hover:bg-secondary-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {item.icon && <span className="text-secondary-400">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
          <svg
            className={`h-4 w-4 text-secondary-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="pl-11 space-y-1">
            {item.children?.map((child) => (
              <SidebarItem key={child.path || child.label} item={child} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (item.id && !item.path) {
    return (
      <button
        onClick={() => dispatch(openModal(item.id!))}
        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg text-secondary-700 hover:bg-secondary-100 transition-colors"
      >
        {item.icon && <span className="text-secondary-400">{item.icon}</span>}
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <NavLink
      to={item.path || '#'}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-secondary-700 hover:bg-secondary-100'
        }`
      }
    >
      {item.icon && <span className="text-secondary-400">{item.icon}</span>}
      <span>{item.label}</span>
    </NavLink>
  )
}
