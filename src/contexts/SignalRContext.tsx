import React, { createContext, useContext, useEffect, useState } from 'react'
import notificationHub from '@/services/signalR/notificationHub'
import { useAuth } from '@/hooks/useAuth'

interface SignalRContextType {
    isConnected: boolean
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined)

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            notificationHub.startConnection().then(() => setIsConnected(true))
        } else {
            notificationHub.stopConnection().then(() => setIsConnected(false))
        }

        return () => {
            notificationHub.stopConnection()
        }
    }, [isAuthenticated])

    return (
        <SignalRContext.Provider value={{ isConnected }}>
            {children}
        </SignalRContext.Provider>
    )
}

export const useSignalR = () => {
    const context = useContext(SignalRContext)
    if (context === undefined) {
        throw new Error('useSignalR must be used within a SignalRProvider')
    }
    return context
}
