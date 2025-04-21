"use server"

import type { KycData } from "./types"
import { join } from "path"
import fs from "fs/promises"

export async function saveDataToFolder(data: KycData): Promise<string> {
  try {
    // Create a unique folder name for this verification
    const folderName = `kyc-verification-${Date.now()}`
    const folderPath = join(process.cwd(), "public", "verifications", folderName)

    // In a production environment, you would create the directory and save the files
    // For this example, we'll log the operations
    console.log(`Creating directory: ${folderPath}`)

    // In a real implementation, you would uncomment these lines:
    // await fs.mkdir(folderPath, { recursive: true })

    // Save the images
    console.log(`Saving ID front image to: ${join(folderPath, "id-front.jpg")}`)
    console.log(`Saving ID back image to: ${join(folderPath, "id-back.jpg")}`)
    console.log(`Saving facial scan to: ${join(folderPath, "facial-scan.jpg")}`)

    // In a real implementation, you would save the base64 images as files:
    // await saveBase64AsImage(data.idFrontImage, join(folderPath, "id-front.jpg"))
    // await saveBase64AsImage(data.idBackImage, join(folderPath, "id-back.jpg"))
    // await saveBase64AsImage(data.facialImage, join(folderPath, "facial-scan.jpg"))

    // Create JSON data without the large base64 strings
    const jsonData = {
      personalInfo: data.personalInfo,
      verificationResult: data.verificationResult,
      timestamp: new Date().toISOString(),
      files: {
        idFront: "id-front.jpg",
        idBack: "id-back.jpg",
        facialScan: "facial-scan.jpg",
      },
    }

    console.log(`Saving JSON data to: ${join(folderPath, "verification-data.json")}`)

    // In a real implementation, you would save the JSON data:
    // await fs.writeFile(
    //   join(folderPath, "verification-data.json"),
    //   JSON.stringify(jsonData, null, 2),
    //   "utf-8"
    // )

    return folderPath
  } catch (error) {
    console.error("File saving error:", error)
    throw new Error("Failed to save verification data to folder")
  }
}

// Helper function to save base64 data as an image file
async function saveBase64AsImage(base64Data: string | null, filePath: string): Promise<void> {
  if (!base64Data) return

  try {
    // Extract the base64 data from the data URL
    const base64Image = base64Data.split(",")[1]
    const imageBuffer = Buffer.from(base64Image, "base64")

    // Save the image
    await fs.writeFile(filePath, imageBuffer)
  } catch (error) {
    console.error(`Error saving image to ${filePath}:`, error)
    throw new Error(`Failed to save image to ${filePath}`)
  }
}
