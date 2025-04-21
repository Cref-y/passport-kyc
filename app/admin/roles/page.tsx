"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getAllRolePermissions, updateRolePermissions } from "@/lib/user-service"
import type { RolePermissions } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// All possible permissions
const ALL_PERMISSIONS = [
  {
    name: "view_dashboard",
    description: "View the admin dashboard",
    category: "Dashboard",
  },
  {
    name: "view_submissions",
    description: "View the list of KYC submissions",
    category: "Submissions",
  },
  {
    name: "view_submission_details",
    description: "View detailed information about a submission",
    category: "Submissions",
  },
  {
    name: "approve_submissions",
    description: "Approve KYC submissions",
    category: "Submissions",
  },
  {
    name: "reject_submissions",
    description: "Reject KYC submissions",
    category: "Submissions",
  },
  {
    name: "flag_submissions",
    description: "Flag KYC submissions for further review",
    category: "Submissions",
  },
  {
    name: "manage_users",
    description: "Create, edit, and delete users",
    category: "Users",
  },
  {
    name: "manage_roles",
    description: "Manage role permissions",
    category: "Users",
  },
  {
    name: "view_reports",
    description: "View analytics and reports",
    category: "Reports",
  },
  {
    name: "export_data",
    description: "Export data from the system",
    category: "Data",
  },
]

export default function RolesPage() {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([])
  const [selectedRole, setSelectedRole] = useState<string>("admin")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Load all role permissions
    const allRolePermissions = getAllRolePermissions()
    setRolePermissions(allRolePermissions)
  }, [])

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setRolePermissions((prev) =>
      prev.map((rp) => {
        if (rp.role === selectedRole) {
          const newPermissions = checked
            ? [...rp.permissions, permission]
            : rp.permissions.filter((p) => p !== permission)
          return { ...rp, permissions: newPermissions }
        }
        return rp
      }),
    )
  }

  const handleSave = () => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const roleToUpdate = rolePermissions.find((rp) => rp.role === selectedRole)
      if (roleToUpdate) {
        updateRolePermissions(roleToUpdate.role, roleToUpdate.permissions)
        setSuccess(`Permissions for ${roleToUpdate.role} role updated successfully`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  // Group permissions by category
  const permissionsByCategory = ALL_PERMISSIONS.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof ALL_PERMISSIONS>,
  )

  const selectedRolePermissions = rolePermissions.find((rp) => rp.role === selectedRole)?.permissions || []

  return (
    <AdminLayout requiredPermission="manage_roles">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Role Management</h1>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Role-Based Access Control</AlertTitle>
          <AlertDescription className="text-blue-700">
            Manage what each role can do in the system. Changes to role permissions affect all users with that role.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Select a role to manage its permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Tabs value={selectedRole} onValueChange={setSelectedRole} orientation="vertical">
                  <TabsList className="flex flex-col h-auto space-y-1">
                    {rolePermissions.map((rp) => (
                      <TabsTrigger key={rp.role} value={rp.role} className="justify-start">
                        <span className="capitalize">{rp.role}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="capitalize">{selectedRole} Permissions</CardTitle>
              <CardDescription>{rolePermissions.find((rp) => rp.role === selectedRole)?.description}</CardDescription>
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

              <div className="space-y-6">
                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-medium">{category}</h3>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <div key={permission.name} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.name}
                            checked={selectedRolePermissions.includes(permission.name)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.name, checked === true)}
                          />
                          <div className="grid gap-1.5">
                            <Label htmlFor={permission.name} className="font-medium">
                              {permission.description}
                            </Label>
                            <p className="text-sm text-gray-500">{permission.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Permissions"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
