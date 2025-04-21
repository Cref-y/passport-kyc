"use client"

import { useState } from "react"
import { BasicDetailsForm } from "./steps/basic-details-form"
import { IdUploadFront } from "./steps/id-upload-front"
import { IdUploadBack } from "./steps/id-upload-back"
import { FacialScan } from "./steps/facial-scan"
import { ReviewSubmit } from "./steps/review-submit"
import { SuccessScreen } from "./steps/success-screen"
import { StepIndicator } from "./step-indicator"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import type { KycData } from "@/lib/types"
import { saveToLocalStorage } from "@/lib/storage-utils"
import { getVerificationsList, getVerification } from "@/lib/client-utils"

export function KycForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [kycData, setKycData] = useState<KycData>({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      documentType: "national-id",
    },
    idFrontImage: null,
    idBackImage: null,
    facialImage: null,
    verificationResult: null,
  })

  const steps = ["Basic Details", "ID Front", "ID Back", "Facial Scan", "Review", "Complete"]

  const updateKycData = (data: Partial<KycData>) => {
    setKycData((prev) => {
      const updated = { ...prev, ...data }
      // Save to localStorage whenever data is updated
      if (typeof window !== "undefined") {
        try {
          saveToLocalStorage(updated)
        } catch (error) {
          console.error("Error saving to localStorage:", error)
        }
      }
      return updated
    })
  }

  const handleNext = () => {
    // If we're on the last step before completion, ensure we don't create duplicate entries
    if (currentStep === steps.length - 2) {
      // Check if we already have a verification with the same name and document type
      try {
        const existingVerifications = getVerificationsList().map((id) => getVerification(id))

        const isDuplicate = existingVerifications.some((verification) => {
          if (!verification) return false

          const existingName =
            `${verification.personalInfo.firstName} ${verification.personalInfo.lastName}`.toLowerCase()
          const currentName = `${kycData.personalInfo.firstName} ${kycData.personalInfo.lastName}`.toLowerCase()

          return (
            existingName === currentName && verification.personalInfo.documentType === kycData.personalInfo.documentType
          )
        })

        if (isDuplicate) {
          // Show a warning or handle duplicate submission
          // For now, we'll just proceed, but in a real app you might want to show a warning
          console.warn("Possible duplicate submission detected")
        }
      } catch (error) {
        console.error("Error checking for duplicates:", error)
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setKycData({
      personalInfo: {
        firstName: "",
        middleName: "",
        lastName: "",
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        documentType: "national-id",
      },
      idFrontImage: null,
      idBackImage: null,
      facialImage: null,
      verificationResult: null,
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetailsForm
            data={kycData.personalInfo}
            onUpdate={(personalInfo) => updateKycData({ personalInfo })}
            onNext={handleNext}
          />
        )
      case 1:
        return (
          <IdUploadFront
            onUpdate={(idFrontImage) => updateKycData({ idFrontImage })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 2:
        return (
          <IdUploadBack
            onUpdate={(idBackImage) => updateKycData({ idBackImage })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <FacialScan
            onUpdate={(facialImage) => updateKycData({ facialImage })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <ReviewSubmit
            data={kycData}
            onUpdate={updateKycData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onRestart={handleRestart}
          />
        )
      case 5:
        return <SuccessScreen data={kycData} onRestart={handleRestart} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-yellow-50 border-yellow-200">
        <InfoIcon className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Development Notice</AlertTitle>
        <AlertDescription className="text-yellow-700">
          This KYC verification system is currently under development. Passport and driving license verification will be
          launched soon. Expect frequent upgrades and improvements.
        </AlertDescription>
      </Alert>

      {currentStep < steps.length - 1 && <StepIndicator steps={steps.slice(0, -1)} currentStep={currentStep} />}
      <Card className="p-6">{renderStep()}</Card>
    </div>
  )
}
