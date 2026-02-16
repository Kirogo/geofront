import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="mb-6 flex flex-col items-center">
            <img
              className="h-12 w-auto"
              src="/assets/images/logo.svg"
              alt="GeoBuild"
            />
            <h2 className="mt-4 text-center text-3xl font-extrabold text-secondary-900">
              GeoBuild
            </h2>
            <p className="mt-2 text-center text-sm text-secondary-600">
              Site Visit Management System
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout