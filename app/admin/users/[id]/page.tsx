"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import { getUserById, updateUser, createUser } from "@/lib/user-service"
import type { User, UserRole } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function UserEditPage() {
  const params = useParams()
  const router = useRouter()
  const isNewUser = params.id === "new"
  const [user, setUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "reviewer",
    active: true,
  })
  const [loading, setLoading] = useState(!isNewUser)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isNewUser) {
      const userData = getUserById(params.id as string)
      if (userData) {
        setUser(userData)
      } else {
        setError("User not found")
      }
      setLoading(false)
    }
  }, [params.id, isNewUser])

  const handleChange = (field: keyof User, value: any) => {
    setUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      if (isNewUser) {
        // Create new user
        const newUser = createUser({
          name: user.name || "",
          email: user.email || "",
          role: (user.role as UserRole) || "reviewer",
          active: user.active !== undefined ? user.active : true,
        })
        setSuccess(`User ${newUser.name} created successfully`)
        // Optionally redirect to the user list after a delay
        setTimeout(() => {
          router.push("/admin/users")
        }, 2000)
      } else {
        // Update existing user
        const updatedUser = updateUser(params.id as string, user)
        setSuccess(`User ${updatedUser.name} updated successfully`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout requiredPermission="manage_users">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading user details...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout requiredPermission="manage_users">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
            <h1 className="text-2xl font-bold">{isNewUser ? "Create User" : "Edit User"}</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isNewUser ? "New User Details" : "User Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={user.role || "reviewer"} onValueChange={(value) => handleChange("role", value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="readonly">Read Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="status"
                      checked={user.active}
                      onCheckedChange={(checked) => handleChange("active", checked)}
                    />
                    <Label htmlFor="status" className="cursor-pointer">
                      {user.active ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </div>
              </div>

              {!isNewUser && (
                <div className="space-y-2">
                  <Label>Account Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Created:</span>{" "}
                      {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-500">Last Login:</span>{" "}
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving..." : "Save User"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
