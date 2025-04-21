import { CheckCircle2 } from "lucide-react"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center w-full">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              index < currentStep
                ? "bg-green-500 border-green-500 text-white"
                : index === currentStep
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-300 text-gray-300"
            }`}
          >
            {index < currentStep ? <CheckCircle2 className="w-6 h-6" /> : <span>{index + 1}</span>}
          </div>
          <span className={`text-xs mt-2 ${index <= currentStep ? "text-gray-700" : "text-gray-400"}`}>{step}</span>
        </div>
      ))}
    </div>
  )
}
