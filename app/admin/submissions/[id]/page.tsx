"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, XCircle, Flag, Clock, Download, User, CreditCard, Camera } from "lucide-react"
import { getSubmission, updateSubmissionStatus } from "@/lib/admin-service"
import type { AdminSubmission } from "@/lib/admin-service"
import { useAuth } from "@/lib/auth-context"

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [submission, setSubmission] = useState<AdminSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { hasPermission } = useAuth()

  useEffect(() => {
    if (params.id) {
      const submissionData = getSubmission(params.id as string)
      if (submissionData) {
        setSubmission(submissionData)
      } else {
        // Handle not found
      }
      setLoading(false)
    }
  }, [params.id])

  const handleStatusUpdate = async (status: "pending" | "approved" | "rejected" | "flagged") => {
    setUpdating(true)
    const success = updateSubmissionStatus(params.id as string, status)

    if (success) {
      // Update the local state
      setSubmission((prev) => (prev ? { ...prev, status } : null))
    }

    setUpdating(false)
  }

  if (loading) {
    return (
      <AdminLayout requiredPermission="view_submission_details">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading submission details...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!submission) {
    return (
      <AdminLayout requiredPermission="view_submission_details">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-gray-500">Submission not found</p>
          <Button variant="outline" onClick={() => router.push("/admin/submissions")}>
            Back to Submissions
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout requiredPermission="view_submission_details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/admin/submissions")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Submissions
            </Button>
            <h1 className="text-2xl font-bold">Submission Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            {hasPermission("export_data") && (
              <Button variant="outline" disabled={updating}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div
                  className={`p-2 rounded-full ${
                    submission.status === "pending"
                      ? "bg-yellow-100"
                      : submission.status === "approved"
                        ? "bg-green-100"
                        : submission.status === "rejected"
                          ? "bg-red-100"
                          : "bg-purple-100"
                  }`}
                >
                  {submission.status === "pending" ? (
                    <Clock className="h-6 w-6 text-yellow-600" />
                  ) : submission.status === "approved" ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : submission.status === "rejected" ? (
                    <XCircle className="h-6 w-6 text-red-600" />
                  ) : (
                    <Flag className="h-6 w-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold capitalize">{submission.status} Verification</h2>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {hasPermission("approve_submissions") && (
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    disabled={submission.status === "approved" || updating}
                    onClick={() => handleStatusUpdate("approved")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                )}
                {hasPermission("reject_submissions") && (
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    disabled={submission.status === "rejected" || updating}
                    onClick={() => handleStatusUpdate("rejected")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                )}
                {hasPermission("flag_submissions") && (
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50"
                    disabled={submission.status === "flagged" || updating}
                    onClick={() => handleStatusUpdate("flagged")}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Flag
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Details */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="verification">Verification Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p>
                      {submission.personalInfo.firstName} {submission.personalInfo.middleName}{" "}
                      {submission.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Document Type</h3>
                    <p className="capitalize">{submission.personalInfo.documentType.replace("-", " ")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                    <p>{submission.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p>{submission.personalInfo.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">City</h3>
                    <p>{submission.personalInfo.city}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">State/Province</h3>
                    <p>{submission.personalInfo.state}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Zip/Postal Code</h3>
                    <p>{submission.personalInfo.zipCode}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Country</h3>
                    <p>{submission.personalInfo.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium">Personal Info</h3>
                      <p className="text-sm text-gray-500">Complete</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium">ID Documents</h3>
                      <p className="text-sm text-gray-500">
                        {submission.hasIdFront && submission.hasIdBack ? "Complete" : "Incomplete"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium">Facial Scan</h3>
                      <p className="text-sm text-gray-500">{submission.hasFacialImage ? "Complete" : "Incomplete"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>ID Front</CardTitle>
                </CardHeader>
                <CardContent>
                  {submission.hasIdFront ? (
                    <div className="aspect-[3/2] w-full overflow-hidden rounded-lg border">
                      <img
                        src={localStorage.getItem(`${submission.id || "/placeholder.svg"}-id-front`) || ""}
                        alt="ID Front"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/2] w-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-gray-500">ID Front image not available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ID Back</CardTitle>
                </CardHeader>
                <CardContent>
                  {submission.hasIdBack ? (
                    <div className="aspect-[3/2] w-full overflow-hidden rounded-lg border">
                      <img
                        src={localStorage.getItem(`${submission.id || "/placeholder.svg"}-id-back`) || ""}
                        alt="ID Back"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/2] w-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-gray-500">ID Back image not available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Facial Scan</CardTitle>
              </CardHeader>
              <CardContent>
                {submission.hasFacialImage ? (
                  <div className="aspect-[1/1] max-w-md mx-auto overflow-hidden rounded-lg border">
                    <img
                      src={localStorage.getItem(`${submission.id || "/placeholder.svg"}-facial`) || ""}
                      alt="Facial Scan"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-[1/1] max-w-md mx-auto flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Facial scan image not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Verification Results</CardTitle>
              </CardHeader>
              <CardContent>
                {submission.verificationResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Facial Comparison</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">Match Score: {submission.score.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">(Scale: 0-1)</span>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                        {submission.verificationResult.message}
                      </p>
                    </div>

                    {submission.verificationResult.ocrData && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">OCR Data Extracted</h3>
                        <div className="space-y-2 text-sm">
                          {submission.verificationResult.ocrData.extractedName && (
                            <div>
                              <span className="text-gray-500">Name:</span>{" "}
                              {submission.verificationResult.ocrData.extractedName}
                            </div>
                          )}
                          {submission.verificationResult.ocrData.extractedDob && (
                            <div>
                              <span className="text-gray-500">Date of Birth:</span>{" "}
                              {submission.verificationResult.ocrData.extractedDob}
                            </div>
                          )}
                          {submission.verificationResult.ocrData.extractedIdNumber && (
                            <div>
                              <span className="text-gray-500">ID Number:</span>{" "}
                              {submission.verificationResult.ocrData.extractedIdNumber}
                            </div>
                          )}
                          {submission.verificationResult.ocrData.extractedAddress && (
                            <div>
                              <span className="text-gray-500">Address:</span>{" "}
                              {submission.verificationResult.ocrData.extractedAddress}
                            </div>
                          )}
                          {submission.verificationResult.ocrData.extractedExpiry && (
                            <div>
                              <span className="text-gray-500">Expiry Date:</span>{" "}
                              {submission.verificationResult.ocrData.extractedExpiry}
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">OCR Confidence:</span>{" "}
                            {(submission.verificationResult.ocrData.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No verification results available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full h-32 p-3 border rounded-md"
                  placeholder="Add notes about this verification..."
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <Button>Save Notes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
