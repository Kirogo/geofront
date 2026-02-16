import React from 'react'
import { useNotifications } from '@/hooks'
import { Button } from '@/components/common/Button'
import { formatDistanceToNow } from 'date-fns'

export const NotificationCenter: React.FC = () => {
    const { notifications, markAsRead, markAllAsRead, clearAll, isOpen } = useNotifications()

    if (!isOpen) return null

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-secondary-200 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-secondary-200 flex justify-between items-center bg-secondary-50">
                <h3 className="text-sm font-semibold text-secondary-900">Notifications</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Mark all read
                    </button>
                    <button
                        onClick={clearAll}
                        className="text-xs text-secondary-500 hover:text-secondary-700 font-medium"
                    >
                        Clear all
                    </button>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-secondary-500">
                        <svg className="mx-auto h-8 w-8 text-secondary-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-sm">No notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-secondary-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-secondary-50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary-50/30' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start">
                                    <div className={`flex-shrink-0 mt-1 h-2 w-2 rounded-full ${!notification.read ? 'bg-primary-600' : 'bg-transparent'}`} />
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-secondary-900">{notification.title}</p>
                                        <p className="text-xs text-secondary-600 mt-1">{notification.message}</p>
                                        <p className="text-[10px] text-secondary-400 mt-2">
                                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-3 border-t border-secondary-200 bg-secondary-50 text-center">
                <Button variant="outline" size="sm" fullWidth onClick={() => { }}>
                    View all activity
                </Button>
            </div>
        </div>
    )
}
