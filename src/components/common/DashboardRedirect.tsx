import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'

export const DashboardRedirect: React.FC = () => {
    const navigate = useNavigate()
    const { user, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading && user) {
            const role = user.role.toLowerCase()
            if (role === 'admin') {
                navigate('/admin')
            } else if (role === 'qs') {
                navigate('/qs')
            } else if (role === 'rm') {
                navigate('/rm')
            } else {
                navigate('/')
            }
        }
    }, [user, isLoading, navigate])

    return (
        <div className="flex h-screen items-center justify-center">
            <LoadingSpinner size="lg" label="Redirecting to your dashboard..." />
        </div>
    )
}

export default DashboardRedirect
