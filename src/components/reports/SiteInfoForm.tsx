// src/components/reports/SiteInfoForm.tsx
import React, { useState } from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CreateReportDto } from '@/types/report.types'
import { GeotagData } from '@/types/geotag.types'
import { MapPin, Target, Calendar, AlertCircle } from 'lucide-react'

interface SiteInfoFormProps {
  register: UseFormRegister<Omit<CreateReportDto, 'workProgress' | 'issues' | 'photos' | 'attachments'>>
  errors: FieldErrors<Omit<CreateReportDto, 'workProgress' | 'issues' | 'photos' | 'attachments'>>
  onLocationCapture: (geotag: GeotagData) => void
}

export const SiteInfoForm: React.FC<SiteInfoFormProps> = ({
  register,
  errors,
  onLocationCapture
}) => {
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleGetCurrentLocation = () => {
    setGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geotag: GeotagData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          }
          onLocationCapture(geotag)
          setGettingLocation(false)
          toast.success('Location captured successfully')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Failed to get location. Please enable location services.')
          setGettingLocation(false)
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser')
      setGettingLocation(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#40534C] mb-1">
            Visit Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              {...register('visitDate', { required: 'Visit date is required' })}
              className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent pl-10"
            />
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#677D6A]" />
          </div>
          {errors.visitDate && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.visitDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#40534C] mb-1">
            Site Location
          </label>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={gettingLocation}
            className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg hover:bg-[#D6BD98]/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {gettingLocation ? (
              <>
                <div className="w-4 h-4 border-2 border-[#677D6A] border-t-transparent rounded-full animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 text-[#677D6A]" />
                Get Current Location
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#40534C] mb-1">
          Site Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            {...register('siteAddress', { required: 'Site address is required' })}
            rows={3}
            className="w-full px-3 py-2 border border-[#D6BD98] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#677D6A] focus:border-transparent pl-10"
            placeholder="Enter site address"
          />
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#677D6A]" />
        </div>
        {errors.siteAddress && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.siteAddress.message}
          </p>
        )}
      </div>
    </div>
  )
}