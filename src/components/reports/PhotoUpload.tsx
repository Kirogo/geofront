// src/components/reports/PhotoUpload.tsx
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, X, MapPin, Loader2 } from 'lucide-react'

interface PhotoUploadProps {
  photos: File[]
  onPhotosChange: (photos: File[]) => void
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ photos, onPhotosChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onPhotosChange([...photos, ...acceptedFiles])
  }, [photos, onPhotosChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 10485760 // 10MB
  })

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    onPhotosChange(newPhotos)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-[#677D6A] bg-[#677D6A]/5'
            : 'border-[#D6BD98] hover:border-[#677D6A] hover:bg-[#D6BD98]/5'
        }`}
      >
        <input {...getInputProps()} />
        <Camera className="mx-auto h-12 w-12 text-[#677D6A]" />
        <p className="mt-2 text-sm text-[#40534C]">
          {isDragActive
            ? 'Drop the photos here...'
            : 'Drag & drop photos here, or click to select'}
        </p>
        <p className="text-xs text-[#677D6A] mt-1">
          Photos will be automatically geo-tagged (JPG, PNG up to 10MB)
        </p>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-[#D6BD98]"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#1A3636]/80 text-white text-xs rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Geo-tagged</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}