"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Camera, RefreshCw } from "lucide-react"
import Webcam from "react-webcam"

interface FacialScanProps {
  onUpdate: (image: string | null) => void
  onNext: () => void
  onPrevious: () => void
}

export function FacialScan({ onUpdate, onNext, onPrevious }: FacialScanProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  const activateCamera = () => {
    setIsCameraActive(true)
  }

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setImage(imageSrc)
      onUpdate(imageSrc)
      setIsCameraActive(false)
    }
  }, [webcamRef, onUpdate])

  const retakeImage = () => {
    setImage(null)
    onUpdate(null)
    setIsCameraActive(true)
  }

  const handleContinue = () => {
    if (image) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Facial Scan</h2>
        <p className="text-gray-500">Please take a clear photo of your face for verification</p>
      </div>

      {!isCameraActive && !image ? (
        <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center space-y-4">
          <Button onClick={activateCamera} className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Start Camera</span>
          </Button>
          <p className="text-sm text-gray-500">Make sure you are in a well-lit area and your face is clearly visible</p>
        </Card>
      ) : isCameraActive && !image ? (
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 720,
                height: 960,
                facingMode: "user",
              }}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 border-4 border-dashed border-gray-300 opacity-50 pointer-events-none rounded-lg"></div>
          </div>
          <div className="flex justify-center">
            <Button onClick={captureImage}>Capture Photo</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
            <img src={image || ""} alt="Facial Scan" className="h-full w-full object-cover" />
          </div>
          <div className="flex justify-center">
            <Button variant="outline" onClick={retakeImage} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Retake Photo</span>
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button onClick={handleContinue} disabled={!image} className="flex items-center space-x-2">
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
