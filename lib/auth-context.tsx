"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { AuthUser } from "./types"
import { getUserByEmail, getAllRolePermissions } from "./user-service"

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("kyc-auth-user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("kyc-auth-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to authenticate
      // For this demo, we'll simulate authentication with localStorage

      // Simple validation
      if (!email || !password) {
        return false
      }

      // Get user from "database"
      const user = getUserByEmail(email)

      // Check if user exists and password is correct
      // In a real app, you would hash and compare passwords
      if (!user || password !== "password") {
        // Using "password" as the default password for all users
        return false
      }

      // Update last login
      user.lastLogin = new Date().toISOString()

      // Create auth user with token
      const authUser: AuthUser = {
        ...user,
        token: `token-${Date.now()}`, // In a real app, this would be a JWT
      }

      // Save to localStorage
      localStorage.setItem("kyc-auth-user", JSON.stringify(authUser))
      setUser(authUser)

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("kyc-auth-user")
    setUser(null)
    router.push("/admin/login")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    // Get all permissions for the user's role
    const allRolePermissions = getAllRolePermissions()
    const rolePermissions = allRolePermissions.find((rp) => rp.role === user.role)

    if (!rolePermissions) return false

    return rolePermissions.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
