//src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'// Make sure this is the updated version
import { SignalRProvider } from './contexts/SignalRContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import RMDashboard from './pages/rm/RMDashboard'
import CreateReport from './pages/rm/CreateReport'
import EditReport from './pages/rm/EditReport'
import MyReports from './pages/rm/MyReports'
import ReportDetail from './pages/rm/ReportDetail'
import ReportPrint from './pages/rm/ReportPrint'
import QSDashboard from './pages/qs/QSDashboard'
import ReviewReports from './pages/qs/ReviewReports'
import ReportReviewDetail from './pages/qs/ReportReviewDetail'
import SiteVisitPlanner from './pages/qs/SiteVisitPlanner'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import ClientManagement from './pages/admin/ClientManagement'
import AuditLogs from './pages/admin/AuditLogs'
import SystemSettings from './pages/admin/SystemSettings'
import { DashboardRedirect } from './components/common/DashboardRedirect'
import Profile from './pages/shared/Profile'
import Notifications from './pages/shared/Notifications'
import Settings from './pages/shared/Settings'

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    > {/* Make sure ThemeProvider is updated */}
        <AuthProvider>
          <SignalRProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />

            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                {/* RM Routes */}
                <Route path="/rm" element={<RMDashboard />} />
                <Route path="/rm/reports/create" element={<CreateReport />} />
                <Route path="/rm/reports/edit/:id" element={<EditReport />} />
                <Route path="/rm/reports" element={<MyReports />} />
                <Route path="/rm/reports/:id" element={<ReportDetail />} />
                <Route path="/rm/reports/:id/print" element={<ReportPrint />} />

                {/* QS Routes */}
                <Route path="/qs" element={<QSDashboard />} />
                <Route path="/qs/reviews" element={<ReviewReports />} />
                <Route path="/qs/reviews/:id" element={<ReportReviewDetail />} />
                <Route path="/qs/site-visits" element={<SiteVisitPlanner />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/clients" element={<ClientManagement />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
                <Route path="/admin/settings" element={<SystemSettings />} />

                {/* Dashboard Redirect */}
                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Shared Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </SignalRProvider>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App