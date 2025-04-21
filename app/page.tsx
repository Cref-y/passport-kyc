import { KycForm } from "@/components/kyc-form"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
          <p className="text-gray-500 mt-2">Complete the verification process to continue</p>
          <p className="text-xs text-yellow-600 mt-1">Beta Version - Under Active Development</p>
        </div>
        <KycForm />

        <div className="mt-8 text-center">
          <a href="/admin" className="text-sm text-blue-600 hover:underline">
            Admin Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
