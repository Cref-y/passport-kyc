"use server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

interface ComparisonResult {
  score: number
  message: string
}

export async function generateAiComparison(idImage: string, facialImage: string): Promise<ComparisonResult> {
  try {
    // Extract the base64 data from the data URLs
    const idImageBase64 = idImage.split(",")[1]
    const facialImageBase64 = facialImage.split(",")[1]

    const prompt = `
      I have two images: one from an ID card and one from a facial scan.
      I need to determine if they are the same person.
      Please analyze the facial features and provide a match score between 0 and 1,
      where 1 is a perfect match and 0 is no match at all.
      Also provide a brief explanation of your reasoning.
      
      Format your response exactly like this:
      Score: [number between 0 and 1]
      Explanation: [your detailed explanation]
    `

    // Use the AI SDK to generate text with the Gemini Pro Vision model
    const { text } = await generateText({
      model: google("gemini-pro-vision"),
      prompt,
      images: [idImageBase64, facialImageBase64],
    })

    // Parse the response to extract the score and explanation
    const scoreMatch = text.match(/Score:\s*([\d.]+)/)
    const explanationMatch = text.match(/Explanation:\s*(.+)(?:\n|$)/s)

    const score = scoreMatch ? Number.parseFloat(scoreMatch[1]) : 0.5
    const message = explanationMatch ? explanationMatch[1].trim() : "Unable to extract explanation from AI response."

    return {
      score,
      message,
    }
  } catch (error) {
    console.error("AI comparison error:", error)

    // Fallback to a default response if the API call fails
    return {
      score: 0.5,
      message: "Unable to perform AI comparison. Please try again or proceed with manual verification.",
    }
  }
}
