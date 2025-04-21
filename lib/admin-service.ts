"use client"

import { getVerificationsList, getVerification } from "./client-utils"

export interface AdminSubmission {
  id: string
  name: string
  documentType: string
  submittedAt: string
  status: "pending" | "approved" | "rejected" | "flagged"
  score: number
  personalInfo: any
  hasIdFront: boolean
  hasIdBack: boolean
  hasFacialImage: boolean
  verificationResult?: any
}

export interface DashboardStats {
  total: number
  pending: number
  approved: number
  rejected: number
  flagged: number
  todaySubmissions: number
  averageScore: number
}

// Get all submissions from localStorage
export function getAllSubmissions(): AdminSubmission[] {
  try {
    const verificationIds = getVerificationsList()

    // Create a Set to track unique submissions and avoid duplicates
    const uniqueSubmissions = new Map<string, AdminSubmission>()

    verificationIds.forEach((id) => {
      const data = getVerification(id)
      if (!data) return

      // Use the verification ID as the key to ensure uniqueness
      uniqueSubmissions.set(id, {
        id,
        name: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
        documentType: data.personalInfo.documentType,
        submittedAt: data.timestamp || new Date().toISOString(),
        status: data.status || "pending",
        score: data.verificationResult?.score || 0,
        personalInfo: data.personalInfo,
        hasIdFront: data.hasIdFront,
        hasIdBack: data.hasIdBack,
        hasFacialImage: data.hasFacialImage,
        verificationResult: data.verificationResult,
      })
    })

    // Convert the Map values to an array
    return Array.from(uniqueSubmissions.values())
  } catch (error) {
    console.error("Error getting submissions:", error)
    return []
  }
}

// Get a single submission by ID
export function getSubmission(id: string): AdminSubmission | null {
  try {
    const data = getVerification(id)

    if (!data) return null

    return {
      id,
      name: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
      documentType: data.personalInfo.documentType,
      submittedAt: data.timestamp || new Date().toISOString(),
      status: data.status || "pending",
      score: data.verificationResult?.score || 0,
      personalInfo: data.personalInfo,
      hasIdFront: data.hasIdFront,
      hasIdBack: data.hasIdBack,
      hasFacialImage: data.hasFacialImage,
      verificationResult: data.verificationResult,
    }
  } catch (error) {
    console.error("Error getting submission:", error)
    return null
  }
}

// Update submission status
export function updateSubmissionStatus(id: string, status: "pending" | "approved" | "rejected" | "flagged"): boolean {
  try {
    const data = getVerification(id)

    if (!data) return false

    // Update the status
    data.status = status

    // Save back to localStorage
    localStorage.setItem(id, JSON.stringify(data))

    return true
  } catch (error) {
    console.error("Error updating submission status:", error)
    return false
  }
}

// Get dashboard statistics
export function getDashboardStats(): DashboardStats {
  try {
    const submissions = getAllSubmissions()

    const total = submissions.length
    const pending = submissions.filter((s) => s.status === "pending").length
    const approved = submissions.filter((s) => s.status === "approved").length
    const rejected = submissions.filter((s) => s.status === "rejected").length
    const flagged = submissions.filter((s) => s.status === "flagged").length

    // Calculate today's submissions
    const today = new Date().toISOString().split("T")[0]
    const todaySubmissions = submissions.filter((s) => s.submittedAt.split("T")[0] === today).length

    // Calculate average score
    const scores = submissions.map((s) => s.score).filter(Boolean)
    const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0

    return {
      total,
      pending,
      approved,
      rejected,
      flagged,
      todaySubmissions,
      averageScore,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      flagged: 0,
      todaySubmissions: 0,
      averageScore: 0,
    }
  }
}
