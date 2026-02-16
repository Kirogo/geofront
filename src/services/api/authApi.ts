import axiosInstance from './axiosConfig'
import { LoginCredentials, AuthResponse, RegisterDto, ForgotPasswordDto, ResetPasswordDto, User } from '@/types/auth.types'

export const authApi = {
    // Login
    login: async (credentials: LoginCredentials) => {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials)
        return response
    },

    // Logout
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout')
        return response
    },

    // Refresh token
    refreshToken: async (refreshToken: string) => {
        const response = await axiosInstance.post<AuthResponse>('/auth/refresh', { refreshToken })
        return response
    },

    // Register
    register: async (data: RegisterDto) => {
        const response = await axiosInstance.post<AuthResponse>('/auth/register', data)
        return response
    },

    // Forgot password
    forgotPassword: async (data: ForgotPasswordDto) => {
        const response = await axiosInstance.post('/auth/forgot-password', data)
        return response
    },

    // Reset password
    resetPassword: async (data: ResetPasswordDto) => {
        const response = await axiosInstance.post('/auth/reset-password', data)
        return response
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me')
        return response
    },

    // Verify email
    verifyEmail: async (token: string) => {
        const response = await axiosInstance.post('/auth/verify-email', { token })
        return response
    },

    // Update profile
    updateProfile: async (data: Partial<User>) => {
        const response = await axiosInstance.patch<User>('/auth/profile', data)
        return response
    },

    // Change password
    changePassword: async (oldPassword: string, newPassword: string) => {
        const response = await axiosInstance.post('/auth/change-password', { oldPassword, newPassword })
        return response
    },
}
