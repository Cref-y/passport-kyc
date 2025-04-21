// lib/actions.ts
"use server"

import type { KycData, VerificationResult, OcrData } from "./types"
import { generateAiComparison } from "./gemini-ai"
import { extractTextFromImage } from "./ocr-utils"

export async function verifyIdentity(data: KycData): Promise<VerificationResult> {
  try {
    // 1. Validate that all required data is present
    if (!data.personalInfo || !data.idFrontImage || !data.idBackImage || !data.facialImage) {
      throw new Error("Missing required verification data")
    }

    // 2. Extract text from ID using OCR
    const ocrResult = await extractTextFromImage(data.idFrontImage, data.personalInfo.documentType)

    const ocrData: OcrData = {
      extractedName: ocrResult.extractedText.name,
      extractedDob: ocrResult.extractedText.dob,
      extractedIdNumber:
        ocrResult.extractedText.idNumber ||
        ocrResult.extractedText.passportNumber ||
        ocrResult.extractedText.licenseNumber,
      extractedAddress: ocrResult.extractedText.address,
      extractedExpiry: ocrResult.extractedText.expiry,
      confidence: ocrResult.confidence,
    }

    // 3. Use Gemini AI to compare the ID photo with the facial scan
    const comparisonResult = await generateAiComparison(data.idFrontImage, data.facialImage)

    // 4. Create verification result
    const verificationResult: VerificationResult = {
      isVerified: comparisonResult.score > 0.45,
      score: comparisonResult.score,
      message: comparisonResult.message,
      timestamp: new Date().toISOString(),
      ocrData,
    }

    return verificationResult
  } catch (error) {
    console.error("Verification error:", error)
    throw new Error(error instanceof Error ? error.message : "An error occurred during verification")
  }
}

// Removed getVerificationsList and getVerification functions
// These functions were causing naming conflicts with client-side functions