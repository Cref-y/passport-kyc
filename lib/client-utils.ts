// lib/client-utils.ts
"use client"

// This is a client-side wrapper for server actions
// This approach helps prevent webpack issues when importing server actions

import { verifyIdentity as serverVerifyIdentity } from "./actions"
import type { KycData, VerificationResult } from "./types"

export async function verifyIdentity(data: KycData): Promise<VerificationResult> {
  try {
    return await serverVerifyIdentity(data)
  } catch (error) {
    console.error("Verification error in client wrapper:", error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "An error occurred during verification. Please try again."
    )
  }
}

// Client-side localStorage functions
export function saveVerification(data: KycData, result: VerificationResult): string {
  const id = `verification-${Date.now()}`
  const storageData = {
    id,
    personalInfo: data.personalInfo,
    hasIdFront: !!data.idFrontImage,
    hasIdBack: !!data.idBackImage,
    hasFacialImage: !!data.facialImage,
    verificationResult: result,
    timestamp: new Date().toISOString(),
    status: "pending"
  }
  
  // Save to localStorage
  localStorage.setItem(id, JSON.stringify(storageData))
  
  // Update list of verifications
  const list = getVerificationsList()
  list.push(id)
  localStorage.setItem('verifications-list', JSON.stringify(list))
  
  return id
}

export function getVerificationsList(): string[] {
  if (typeof window === 'undefined') return []
  const listJson = localStorage.getItem('verifications-list')
  return listJson ? JSON.parse(listJson) : []
}

export function getVerification(id: string): any {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(id)
  return data ? JSON.parse(data) : null
}

// Function to download verification data
export function downloadVerificationData(data: KycData): void {
  try {
    // Create a JSON representation of the data
    const jsonData = JSON.stringify(data, null, 2)

    // Create a blob from the JSON data
    const blob = new Blob([jsonData], { type: "application/json" })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a link element
    const link = document.createElement("a")
    link.href = url
    link.download = `kyc-verification-${Date.now()}.json`

    // Append the link to the body
    document.body.appendChild(link)

    // Click the link to trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Download error:", error)
    throw new Error("Failed to download verification data")
  }
}