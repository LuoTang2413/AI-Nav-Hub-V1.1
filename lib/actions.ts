"use server"

import { revalidatePath } from "next/cache"

// Define the type for AI tool submission
export type AIToolSubmission = {
  name: string
  description: string
  url: string
  category: string
  logoUrl?: string
  tags?: string
  contactEmail: string
  submittedBy: string
  submitterName: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

// Define the type for AI tool import
export type AIToolImport = {
  name: string
  description: string
  url: string
  category: string
  logoUrl?: string
  tags?: string
}

// In a real application, this would connect to a database
// For now, we'll store submissions in memory (this will reset on server restart)
const submissions: AIToolSubmission[] = []

export async function submitAITool(data: AIToolSubmission) {
  // Validate the data
  if (!data.name || !data.description || !data.url || !data.category) {
    throw new Error("Missing required fields")
  }

  // In a real app, you would save this to a database
  // For demo purposes, we'll just add it to our in-memory array
  submissions.push({
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  })

  console.log("New submission received:", data.name)
  console.log("Total submissions:", submissions.length)

  // In a real app, you might send an email notification to admins
  // await sendAdminNotification(data);

  // Revalidate the paths that might show the pending submissions
  revalidatePath("/")
  revalidatePath("/admin/submissions")

  return { success: true }
}

// Function to get all submissions (for admin panel)
export async function getSubmissions(status?: "pending" | "approved" | "rejected") {
  // In a real app, you would fetch this from a database
  if (status) {
    return submissions.filter((sub) => sub.status === status)
  }
  return submissions
}

// Function to update a submission status (for admin review)
export async function updateSubmissionStatus(id: string, status: "approved" | "rejected", reviewNotes?: string) {
  // In a real app, you would update this in a database
  // For demo purposes, we'll just update our in-memory array
  // Find the submission by some identifier (in a real app, this would be a database ID)
  const submissionIndex = submissions.findIndex((sub) => sub.name === id || sub.submittedAt === id)

  if (submissionIndex === -1) {
    throw new Error("Submission not found")
  }

  submissions[submissionIndex] = {
    ...submissions[submissionIndex],
    status,
    reviewedAt: new Date().toISOString(),
    reviewNotes,
  }

  // If approved, we might want to add it to the main tools list
  if (status === "approved") {
    // In a real app, you would add this to your tools database
    // addToToolsDatabase(submissions[submissionIndex]);
  }

  // Revalidate relevant paths
  revalidatePath("/")
  revalidatePath("/admin/submissions")

  return { success: true }
}

// Function to import tools from CSV or JSON
export async function importTools(data: string, format: "csv" | "json") {
  // In a real app, you would save these to a database
  // For demo purposes, we'll just parse and validate the data

  const tools: AIToolImport[] = []
  const errors: string[] = []

  try {
    if (format === "csv") {
      // Parse CSV
      const lines = data.split("\n")
      const headers = lines[0].split(",")

      // Check required headers
      const requiredHeaders = ["name", "description", "category", "url"]
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
      }

      // Parse each line
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue

        const values = parseCSVLine(lines[i])
        const tool: any = {}

        headers.forEach((header, index) => {
          tool[header.trim()] = values[index]?.trim() || ""
        })

        // Validate required fields
        if (!validateTool(tool)) {
          errors.push(`Line ${i + 1}: Missing required fields`)
          continue
        }

        tools.push(tool as AIToolImport)
      }
    } else {
      // Parse JSON
      try {
        const parsed = JSON.parse(data)

        if (!Array.isArray(parsed)) {
          throw new Error("JSON data must be an array of tools")
        }

        // Validate each tool
        parsed.forEach((tool, index) => {
          if (!validateTool(tool)) {
            errors.push(`Item ${index + 1}: Missing required fields`)
            return
          }

          tools.push(tool as AIToolImport)
        })
      } catch (e) {
        throw new Error(`Invalid JSON format: ${e instanceof Error ? e.message : "Unknown error"}`)
      }
    }

    // In a real app, you would save these tools to a database
    // For demo purposes, we'll just simulate success

    // Simulate some random errors
    const successCount = tools.length - errors.length

    // Revalidate paths
    revalidatePath("/")

    return {
      total: tools.length,
      success: successCount,
      failed: errors.length,
      errors,
    }
  } catch (error) {
    throw new Error(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Helper function to validate a tool
function validateTool(tool: any): boolean {
  return !!(tool.name && tool.description && tool.category && tool.url)
}

// Helper function to parse CSV line (handles quoted values with commas)
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

