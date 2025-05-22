import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to clean up think tags and other artifacts from Qwen3 responses
// This is a duplicate of the function in the API route, but it's also useful to have it here
// in case we need to clean responses on the client side
export function cleanResponse(text: string): string {
  if (!text) return ""

  // Remove <Thinking> and </Thinking> tags and their content
  let cleaned = text.replace(/<Thinking>[\s\S]*?<\/think>/g, "").trim()

  // Remove any remaining think tags that might not be properly paired
  cleaned = cleaned.replace(/<\/?think>/g, "").trim()

  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()

  return cleaned
}
