export interface PersonalInfo {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  documentType: "national-id" | "passport" | "driving-license"
}

export interface VerificationResult {
  isVerified: boolean
  score: number
  message: string
  timestamp: string
  ocrData?: OcrData
}

export interface OcrData {
  extractedName?: string
  extractedDob?: string
  extractedIdNumber?: string
  extractedAddress?: string
  extractedExpiry?: string
  confidence: number
}

export interface KycData {
  personalInfo: PersonalInfo
  idFrontImage: string | null
  idBackImage: string | null
  facialImage: string | null
  verificationResult?: VerificationResult | null
}

// User management types
export type UserRole = "admin" | "reviewer" | "supervisor" | "readonly"

export interface Permission {
  name: string
  description: string
}

export interface RolePermissions {
  role: UserRole
  permissions: string[]
  description: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  active: boolean
  lastLogin?: string
  createdAt: string
}

export interface AuthUser extends User {
  token: string
}
