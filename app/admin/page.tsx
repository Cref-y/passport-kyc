"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Users, FileCheck, FileX, Clock } from "lucide-react"
import { getDashboardStats, getAllSubmissions } from "@/lib/admin-service"
import type { DashboardStats } from "@/lib/admin-service"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
    todaySubmissions: 0,
    averageScore: 0,
  })
  const [recentSubmissions, setRecentSubmissions] = useState([])

  useEffect(() => {
    // Load dashboard stats
    const dashboardStats = getDashboardStats()
    setStats(dashboardStats)

    // Load recent submissions - ensure we only get actual submissions
    const allSubmissions = getAllSubmissions()

    // Sort by submission date (newest first) and take only the most recent 5
    const sortedSubmissions = allSubmissions
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5)

    setRecentSubmissions(sortedSubmissions)
  }, [])

  // Data for status distribution chart
  const statusData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Approved", value: stats.approved, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
    { name: "Flagged", value: stats.flagged, color: "#6366f1" },
  ]

  // Mock data for weekly submissions chart
  const weeklyData = [
    { name: "Mon", submissions: 4 },
    { name: "Tue", submissions: 7 },
    { name: "Wed", submissions: 5 },
    { name: "Thu", submissions: 8 },
    { name: "Fri", submissions: 12 },
    { name: "Sat", submissions: 3 },
    { name: "Sun", submissions: 2 },
  ]

  return (
    <AdminLayout requiredPermission="view_dashboard">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <h3 className="text-2xl font-bold">{stats.pending}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <h3 className="text-2xl font-bold">{stats.approved}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FileX className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <h3 className="text-2xl font-bold">{stats.rejected}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Submissions</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Document Type</th>
                    <th className="px-4 py-3 text-left font-medium">Submitted</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Score</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission: any) => (
                    <tr key={submission.id} className="border-b">
                      <td className="px-4 py-3">{submission.name}</td>
                      <td className="px-4 py-3 capitalize">{submission.documentType.replace("-", " ")}</td>
                      <td className="px-4 py-3">{new Date(submission.submittedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            submission.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : submission.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : submission.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{submission.score.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/admin/submissions/${submission.id}`}>View</a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {recentSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                        No submissions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" asChild>
                <a href="/admin/submissions">View All Submissions</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
