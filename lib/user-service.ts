"use client"

import type { User, UserRole, RolePermissions } from "./types"

// Default role permissions
const DEFAULT_ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: "admin",
    description: "Full system access with user management capabilities",
    permissions: [
      "view_dashboard",
      "view_submissions",
      "view_submission_details",
      "approve_submissions",
      "reject_submissions",
      "flag_submissions",
      "manage_users",
      "manage_roles",
      "view_reports",
      "export_data",
    ],
  },
  {
    role: "supervisor",
    description: "Can review and manage submissions, but cannot manage users",
    permissions: [
      "view_dashboard",
      "view_submissions",
      "view_submission_details",
      "approve_submissions",
      "reject_submissions",
      "flag_submissions",
      "view_reports",
      "export_data",
    ],
  },
  {
    role: "reviewer",
    description: "Can review submissions but cannot approve or reject high-risk cases",
    permissions: [
      "view_dashboard",
      "view_submissions",
      "view_submission_details",
      "approve_submissions",
      "reject_submissions",
      "flag_submissions",
    ],
  },
  {
    role: "readonly",
    description: "Can only view submissions and dashboard",
    permissions: ["view_dashboard", "view_submissions", "view_submission_details"],
  },
]

// Default users
const DEFAULT_USERS: User[] = [
  {
    id: "user-1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    active: true,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "user-2",
    email: "supervisor@example.com",
    name: "Supervisor User",
    role: "supervisor",
    active: true,
    createdAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "user-3",
    email: "reviewer@example.com",
    name: "Reviewer User",
    role: "reviewer",
    active: true,
    createdAt: "2023-01-03T00:00:00.000Z",
  },
  {
    id: "user-4",
    email: "readonly@example.com",
    name: "Read Only User",
    role: "readonly",
    active: true,
    createdAt: "2023-01-04T00:00:00.000Z",
  },
]

// Initialize users in localStorage if they don't exist
function initializeUsers() {
  if (typeof window === "undefined") return

  const users = localStorage.getItem("kyc-users")
  if (!users) {
    localStorage.setItem("kyc-users", JSON.stringify(DEFAULT_USERS))
  }

  const rolePermissions = localStorage.getItem("kyc-role-permissions")
  if (!rolePermissions) {
    localStorage.setItem("kyc-role-permissions", JSON.stringify(DEFAULT_ROLE_PERMISSIONS))
  }
}

// Get all users
export function getAllUsers(): User[] {
  initializeUsers()
  try {
    const users = localStorage.getItem("kyc-users")
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}

// Get user by ID
export function getUserById(id: string): User | null {
  try {
    const users = getAllUsers()
    return users.find((user) => user.id === id) || null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Get user by email
export function getUserByEmail(email: string): User | null {
  try {
    const users = getAllUsers()
    return users.find((user) => user.email === email) || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Create a new user
export function createUser(user: Omit<User, "id" | "createdAt">): User {
  try {
    const users = getAllUsers()

    // Check if email already exists
    if (users.some((u) => u.email === user.email)) {
      throw new Error("Email already exists")
    }

    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("kyc-users", JSON.stringify(users))

    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update an existing user
export function updateUser(id: string, userData: Partial<User>): User {
  try {
    const users = getAllUsers()
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Check if email is being changed and already exists
    if (userData.email && userData.email !== users[userIndex].email) {
      if (users.some((u) => u.email === userData.email)) {
        throw new Error("Email already exists")
      }
    }

    const updatedUser = { ...users[userIndex], ...userData }
    users[userIndex] = updatedUser

    localStorage.setItem("kyc-users", JSON.stringify(users))

    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

// Delete a user
export function deleteUser(id: string): boolean {
  try {
    const users = getAllUsers()
    const filteredUsers = users.filter((user) => user.id !== id)

    if (filteredUsers.length === users.length) {
      throw new Error("User not found")
    }

    localStorage.setItem("kyc-users", JSON.stringify(filteredUsers))

    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Get all role permissions
export function getAllRolePermissions(): RolePermissions[] {
  initializeUsers()
  try {
    const rolePermissions = localStorage.getItem("kyc-role-permissions")
    return rolePermissions ? JSON.parse(rolePermissions) : DEFAULT_ROLE_PERMISSIONS
  } catch (error) {
    console.error("Error getting role permissions:", error)
    return DEFAULT_ROLE_PERMISSIONS
  }
}

// Get permissions for a specific role
export function getRolePermissions(role: UserRole): string[] {
  try {
    const allRolePermissions = getAllRolePermissions()
    const rolePermission = allRolePermissions.find((rp) => rp.role === role)
    return rolePermission ? rolePermission.permissions : []
  } catch (error) {
    console.error("Error getting role permissions:", error)
    return []
  }
}

// Update role permissions
export function updateRolePermissions(role: UserRole, permissions: string[]): boolean {
  try {
    const allRolePermissions = getAllRolePermissions()
    const roleIndex = allRolePermissions.findIndex((rp) => rp.role === role)

    if (roleIndex === -1) {
      throw new Error("Role not found")
    }

    allRolePermissions[roleIndex].permissions = permissions
    localStorage.setItem("kyc-role-permissions", JSON.stringify(allRolePermissions))

    return true
  } catch (error) {
    console.error("Error updating role permissions:", error)
    throw error
  }
}
