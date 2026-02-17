// src/components/layout/Sidebar/SidebarItem.tsx
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { NavItem } from './NavItems'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/slices/uiSlice'

interface SidebarItemProps {
  item: NavItem
  depth?: number
  onItemClick?: () => void
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  depth = 0,
  onItemClick 
}) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  // Check if current item or any child is active
  const isActive = item.path ? location.pathname === item.path : false
  const isChildActive = hasChildren && item.children?.some(child => 
    location.pathname === child.path || 
    (child.path && location.pathname.startsWith(child.path.replace(/\/\d+$/, '')))
  )

  // Auto-expand if item or child is active
  useEffect(() => {
    if (isActive || isChildActive) {
      setIsOpen(true)
    }
  }, [isActive, isChildActive])

  const paddingLeft = depth === 0 ? 'pl-3' : `pl-${depth * 4 + 8}`

  // Parent item with children
  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
            transition-all duration-200
            ${isChildActive
              ? 'bg-[#D6BD98]/30 text-[#1A3636]' // 30% opacity for parent with active child
              : isOpen
                ? 'bg-[#D6BD98]/20 text-[#1A3636]' // 20% opacity for open parent
                : 'text-[#40534C] hover:bg-[#D6BD98]/10 hover:text-[#1A3636]'
            }
          `}
        >
          <div className={`flex items-center space-x-3 ${paddingLeft}`}>
            <span className="w-5">{item.icon}</span>
            <span>{item.label}</span>
          </div>
          
          <svg
            className={`
              h-4 w-4 transition-transform duration-200
              ${isOpen ? 'rotate-180' : ''}
              ${isChildActive || isOpen ? 'text-[#1A3636]' : 'text-[#677D6A]'}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="pl-4 space-y-1 mt-1 border-l-2 border-[#D6BD98]/30 ml-6">
            {item.children?.map((child) => (
              <SidebarItem 
                key={child.path || child.label} 
                item={child} 
                depth={depth + 1}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Modal trigger item
  if (item.id && !item.path) {
    return (
      <button
        onClick={() => {
          dispatch(openModal(item.id!))
          onItemClick?.()
        }}
        className={`
          w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg
          transition-all duration-200
          text-[#40534C] hover:bg-[#D6BD98]/10 hover:text-[#1A3636]
        `}
      >
        <span className="w-5 text-[#677D6A] group-hover:text-[#40534C]">{item.icon}</span>
        <span className={paddingLeft}>{item.label}</span>
      </button>
    )
  }

  // Regular link item - WITH PROPER ACTIVE STATE
  return (
    <NavLink
      to={item.path || '#'}
      onClick={onItemClick}
      className={({ isActive }) => `
        flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
        transition-all duration-200
        ${isActive
          ? 'bg-[#D6BD98] text-[#1A3636] font-semibold' // LIGHTER GREEN for active item
          : 'text-[#40534C] hover:bg-[#D6BD98]/10 hover:text-[#1A3636]'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`flex items-center space-x-3 ${paddingLeft}`}>
            <span className={`w-5 ${isActive ? 'text-[#1A3636]' : 'text-[#677D6A]'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
          
          {/* Active indicator dot */}
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A3636] mr-2"></span>
          )}
        </>
      )}
    </NavLink>
  )
}