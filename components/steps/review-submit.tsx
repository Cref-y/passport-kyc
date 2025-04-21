"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { KycData } from "@/lib/types"
// Import the client-side wrapper instead of the server action directly
import { verifyIdentity } from "@/lib/client-utils"

// Update the ReviewSubmitProps interface
interface ReviewSubmitProps {
  data: KycData
  onUpdate: (data: Partial<KycData>) => void
  onNext: () => void
  onPrevious: () => void
  onRestart: () => void
}

export function ReviewSubmit({ data, onNext, onPrevious, onUpdate, onRestart }: ReviewSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lowScoreAlert, setLowScoreAlert] = useState<boolean>(false)

  // Update the handleSubmit function to store the verification result
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    setLowScoreAlert(false)

    try {
      // Use the client-side wrapper for the server action
      const verificationResult = await verifyIdentity(data);

      // Update the KYC data with the verification result
      onUpdate({ verificationResult })

      // Check if the score is too low
      if (verificationResult.score < 0.45) {
        setLowScoreAlert(true)
      } else {
        onNext()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during verification")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Review and Submit</h2>
        <p className="text-gray-500">Please review your information before submitting</p>
      </div>

      {lowScoreAlert && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>
            <p>
              The facial comparison score is too low ({data.verificationResult?.score.toFixed(2)}). Please retake your
              photos and try again.
            </p>
            <Button variant="outline" className="mt-2" onClick={onRestart}>
              Restart Verification
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Name:</span> {data.personalInfo.firstName} {data.personalInfo.middleName}{" "}
              {data.personalInfo.lastName}
            </div>
            <div>
              <span className="text-gray-500">Document Type:</span>{" "}
              {data.personalInfo.documentType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
            <div>
              <span className="text-gray-500">Date of Birth:</span> {data.personalInfo.dateOfBirth}
            </div>
            <div>
              <span className="text-gray-500">Address:</span> {data.personalInfo.address}
            </div>
            <div>
              <span className="text-gray-500">City:</span> {data.personalInfo.city}
            </div>
            <div>
              <span className="text-gray-500">State/Province:</span> {data.personalInfo.state}
            </div>
            <div>
              <span className="text-gray-500">Zip/Postal Code:</span> {data.personalInfo.zipCode}
            </div>
            <div>
              <span className="text-gray-500">Country:</span> {data.personalInfo.country}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">ID Front</h3>
            <div className="aspect-[3/2] w-full overflow-hidden rounded-lg border">
              <img src={data.idFrontImage || ""} alt="ID Front" className="h-full w-full object-contain" />
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">ID Back</h3>
            <div className="aspect-[3/2] w-full overflow-hidden rounded-lg border">
              <img src={data.idBackImage || ""} alt="ID Back" className="h-full w-full object-contain" />
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">Facial Scan</h3>
            <div className="aspect-[3/2] w-full overflow-hidden rounded-lg border">
              <img src={data.facialImage || ""} alt="Facial Scan" className="h-full w-full object-contain" />
            </div>
          </Card>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || lowScoreAlert} className="flex items-center space-x-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Submit</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
