import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { store } from '@/store/store'
import { refreshToken, logout } from '@/store/slices/authSlice'
import { ApiError } from '@/types/common.types'

// Use relative path for dev environment (proxied through Vite), absolute URL for production
const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        await store.dispatch(refreshToken()).unwrap()
        const token = store.getState().auth.token
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        store.dispatch(logout())
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Log full response body for debugging validation errors
    try {
      console.error('API response error:', originalRequest?.url, error.response?.status)
      console.error('API response error body:', JSON.stringify(error.response?.data))
    } catch (e) {
      console.error('API response error (stringify failed):', error.response?.data)
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || error.response?.data,
    }

    return Promise.reject(apiError)
  }
)

export default axiosInstance