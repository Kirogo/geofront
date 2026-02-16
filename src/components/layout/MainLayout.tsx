import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header/Header'
import { Sidebar } from './Sidebar/Sidebar'
import { useAppSelector } from '@/store/hooks'
import { ReportCreateModal } from '../reports/ReportCreateModal'

export const MainLayout: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      <Sidebar />
      <ReportCreateModal />

      <main
        className={`
          pt-16 transition-all duration-300
          ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout