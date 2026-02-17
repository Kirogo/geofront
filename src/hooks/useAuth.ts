//src/hooks/useAuth.ts
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login, logout, refreshToken, clearError } from '@/store/slices/authSlice'
import { LoginCredentials, RegisterDto, User } from '@/types/auth.types'
import { authApi } from '@/services/api/authApi'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, error, permissions } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    // Check token expiration and refresh if needed
    const token = localStorage.getItem('token')
    if (token && !isAuthenticated) {
      dispatch(refreshToken())
    }
  }, [dispatch, isAuthenticated])

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await dispatch(login(credentials)).unwrap()
        toast.success('Login successful!')

        // Redirect based on role
        const role = result.user.role.toLowerCase()
        if (role === 'admin') {
          navigate('/admin')
        } else if (role === 'qs') {
          navigate('/qs')
        } else if (role === 'rm') {
          navigate('/rm')
        } else {
          navigate('/')
        }

        return result
      } catch (error) {
        toast.error(error as string)
        throw error
      }
    },
    [dispatch, navigate]
  )

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [dispatch, navigate])

  const handleRegister = useCallback(
    async (data: RegisterDto) => {
      try {
        const response = await authApi.register(data)
        toast.success('Registration successful! Please check your email to verify your account.')
        navigate('/login')
        return response.data
      } catch (error: any) {
        toast.error(error.message || 'Registration failed')
        throw error
      }
    },
    [navigate]
  )

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      try {
        const response = await authApi.updateProfile(data)
        toast.success('Profile updated successfully')
        return response.data
      } catch (error: any) {
        toast.error(error.message || 'Failed to update profile')
        throw error
      }
    },
    []
  )

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      try {
        await authApi.changePassword(oldPassword, newPassword)
        toast.success('Password changed successfully')
      } catch (error: any) {
        toast.error(error.message || 'Failed to change password')
        throw error
      }
    },
    []
  )

  const hasPermission = useCallback(
    (permission: string | string[]) => {
      if (!permissions) return false

      const requiredPermissions = Array.isArray(permission) ? permission : [permission]
      return requiredPermissions.every(p => permissions.includes(p))
    },
    [permissions]
  )

  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!user?.role) return false

      const requiredRoles = Array.isArray(role)
        ? role.map(r => r.toLowerCase())
        : [role.toLowerCase()]
      return requiredRoles.includes(user.role.toLowerCase())
    },
    [user]
  )

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    permissions,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateProfile,
    changePassword,
    hasPermission,
    hasRole,
    clearError: () => dispatch(clearError()),
  }
}