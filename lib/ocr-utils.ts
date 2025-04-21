"use server"

// This is a simulated OCR function that would extract text from ID documents
// In a real implementation, you would use a service like Google Cloud Vision, Azure Computer Vision, or Tesseract.js
export async function extractTextFromImage(
  imageBase64: string,
  documentType: string,
): Promise<{
  extractedText: Record<string, string>
  confidence: number
}> {
  // Remove the data URL prefix if present
  const base64Data = imageBase64.includes("base64,") ? imageBase64.split("base64,")[1] : imageBase64

  // In a real implementation, you would send the image to an OCR service
  // For this example, we'll simulate OCR extraction with random data

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate random confidence between 0.7 and 0.95
  const confidence = 0.7 + Math.random() * 0.25

  // Simulate extracted data based on document type
  let extractedText: Record<string, string> = {}

  if (documentType === "national-id") {
    extractedText = {
      name: "JOHN MICHAEL DOE",
      dob: "1985-06-15",
      idNumber: "ID-12345678",
      address: "123 MAIN ST, ANYTOWN, ST 12345",
      expiry: "2028-06-14",
    }
  } else if (documentType === "passport") {
    extractedText = {
      name: "DOE, JOHN MICHAEL",
      dob: "15 JUN 1985",
      passportNumber: "P12345678",
      nationality: "UNITED STATES OF AMERICA",
      expiry: "14 JUN 2033",
    }
  } else if (documentType === "driving-license") {
    extractedText = {
      name: "DOE, JOHN M",
      dob: "06/15/1985",
      licenseNumber: "DL987654321",
      address: "123 MAIN ST, ANYTOWN, ST 12345",
      expiry: "06/14/2026",
      class: "C",
    }
  }

  return {
    extractedText,
    confidence,
  }
}
