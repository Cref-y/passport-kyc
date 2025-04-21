// VerificationComponent.tsx
"use client"

import { useState } from "react"
// Fix imports with relative paths instead of alias paths
import { verifyIdentity, saveVerification, downloadVerificationData } from "./client-utils"
import type { KycData, VerificationResult } from "./types"

export default function VerificationComponent() {
  const [data, setData] = useState<KycData | null>(null)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!data) {
      setError("No data to verify")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Wrap in try/catch to handle potential errors from the server action
      const verificationResult = await verifyIdentity(data)
      setResult(verificationResult)
      
      // Only attempt to save if we have a successful result
      if (verificationResult) {
        // Save the result to localStorage on the client side
        const id = saveVerification(data, verificationResult)
        console.log("Verification saved with ID:", id)
      }
    } catch (err) {
      console.error("Verification error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!data) {
      setError("No data to download")
      return
    }

    try {
      downloadVerificationData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed")
    }
  }

  // Your form and display logic here...

  return (
    <div>
      {/* Form to collect KYC data would go here */}
      {isLoading && <p>Verifying identity...</p>}
      {error && <p className="error">{error}</p>}
      
      {result && (
        <div className="result">
          <h2>Verification Result</h2>
          <p>Status: {result.isVerified ? "Verified" : "Failed"}</p>
          <p>Score: {result.score.toFixed(2)}</p>
          <p>Message: {result.message}</p>
          {/* Display more verification details here */}
        </div>
      )}
      
      <div className="actions">
        <button onClick={handleVerify} disabled={!data || isLoading}>
          Verify Identity
        </button>
        <button onClick={handleDownload} disabled={!data}>
          Download Data
        </button>
      </div>
    </div>
  )
}