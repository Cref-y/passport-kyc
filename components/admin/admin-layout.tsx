"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "./protected-route"

interface AdminLayoutProps {
  children: React.ReactNode
  requiredPermission?: string
}

export function AdminLayout({ children, requiredPermission }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout, hasPermission } = useAuth()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      permission: "view_dashboard",
    },
    {
      title: "Submissions",
      href: "/admin/submissions",
      icon: FileText,
      permission: "view_submissions",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      permission: "manage_users",
    },
    {
      title: "Roles",
      href: "/admin/roles",
      icon: Shield,
      permission: "manage_roles",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      permission: "view_dashboard", // Basic permission for settings
    },
  ]

  return (
    <ProtectedRoute requiredPermission={requiredPermission}>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white">
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold">KYC Admin</h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                // Only show nav items the user has permission for
                if (!hasPermission(item.permission)) return null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t">
              <div className="mb-4 px-3 py-2">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
                <div className="text-xs text-gray-500 mt-1 capitalize">{user?.role} Role</div>
              </div>
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm z-10">
            <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
