"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Download, RefreshCw, Clock } from "lucide-react"
import type { KycData } from "@/lib/types"
import { downloadVerificationData } from "@/lib/client-utils"

interface SuccessScreenProps {
  data: KycData
  onRestart: () => void
}

export function SuccessScreen({ data, onRestart }: SuccessScreenProps) {
  const handleDownload = async () => {
    await downloadVerificationData(data)
  }

  const verificationResult = data.verificationResult || {
    isVerified: false,
    score: 0,
    message: "Verification not completed",
    timestamp: new Date().toISOString(),
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="h-24 w-24 rounded-full bg-yellow-100 flex items-center justify-center">
          <Clock className="h-12 w-12 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-semibold">Under Review</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your identity verification has been submitted and is currently under review. We will notify you once the
          verification process is complete.
        </p>
      </div>

      <Card className="p-6 bg-gray-50">
        <h3 className="font-medium mb-4">Verification Details</h3>
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Personal information submitted</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>ID document uploaded</span>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">AI Facial Comparison</h4>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium">Match Score: {verificationResult.score.toFixed(2)}</span>
              <span className="text-xs text-gray-500">(Scale: 0-1)</span>
            </div>
            <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded">{verificationResult.message}</p>
          </div>

          {data.verificationResult?.ocrData && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">OCR Data Extracted</h4>
              <div className="space-y-2 text-sm">
                {data.verificationResult.ocrData.extractedName && (
                  <div>
                    <span className="text-gray-500">Name:</span> {data.verificationResult.ocrData.extractedName}
                  </div>
                )}
                {data.verificationResult.ocrData.extractedDob && (
                  <div>
                    <span className="text-gray-500">Date of Birth:</span> {data.verificationResult.ocrData.extractedDob}
                  </div>
                )}
                {data.verificationResult.ocrData.extractedIdNumber && (
                  <div>
                    <span className="text-gray-500">ID Number:</span>{" "}
                    {data.verificationResult.ocrData.extractedIdNumber}
                  </div>
                )}
                {data.verificationResult.ocrData.extractedAddress && (
                  <div>
                    <span className="text-gray-500">Address:</span> {data.verificationResult.ocrData.extractedAddress}
                  </div>
                )}
                {data.verificationResult.ocrData.extractedExpiry && (
                  <div>
                    <span className="text-gray-500">Expiry Date:</span>{" "}
                    {data.verificationResult.ocrData.extractedExpiry}
                  </div>
                )}
                <div>
                  <span className="text-gray-500">OCR Confidence:</span>{" "}
                  {(data.verificationResult.ocrData.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Verification timestamp: {new Date(verificationResult.timestamp).toLocaleString()}
          </p>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownload} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Verification Data</span>
        </Button>

        <Button variant="outline" onClick={onRestart} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Start New Verification</span>
        </Button>
      </div>
    </div>
  )
}
