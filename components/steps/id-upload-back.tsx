"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Camera, ArrowLeft, ArrowRight } from "lucide-react"

interface IdUploadBackProps {
  onUpdate: (image: string | null) => void
  onNext: () => void
  onPrevious: () => void
}

export function IdUploadBack({ onUpdate, onNext, onPrevious }: IdUploadBackProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string
      setImage(imageDataUrl)
      onUpdate(imageDataUrl)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = () => {
    // In a real implementation, this would open the device camera
    // For now, we'll just trigger the file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleContinue = () => {
    if (image) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Upload ID Back</h2>
        <p className="text-gray-500">Please upload a clear photo of the back of your ID</p>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {!image ? (
        <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleCameraCapture}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </Button>
          </div>
          <p className="text-sm text-gray-500">Supported formats: JPG, PNG. Max size: 5MB</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
            <img src={image || "/placeholder.svg"} alt="ID Back" className="h-full w-full object-contain" />
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setImage(null)
                onUpdate(null)
              }}
            >
              Remove and Upload Again
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button onClick={handleContinue} disabled={!image || isUploading} className="flex items-center space-x-2">
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
