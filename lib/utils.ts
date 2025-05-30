import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to clean up think tags and other artifacts from Qwen3 responses
// This is a duplicate of the function in the API route, but it's also useful to have it here
// in case we need to clean responses on the client side
export function cleanResponse(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // Remove <Thinking>...</Thinking> blocks and their content
  // Corrected: /<Thinking>[\s\S]*?<\/Thinking>/g
  cleaned = cleaned.replace(/<Thinking>[\s\S]*?<\/Thinking>/g, "");

  // Remove any remaining think tags that might not be properly paired
  cleaned = cleaned.replace(/<\/?think>/g, "");

  // Fix Markdown ordered list items where number and text are on separate lines
  // e.g., "1.\nActual text" becomes "1. Actual text"
  // This specifically targets a number, a dot, optional whitespace, a newline,
  // then the actual list item text (which must contain non-whitespace).
  cleaned = cleaned.replace(/(\d+\.)\s+?(\S[^\r\n]*)/g, "$1 $2");

  // Remove extra newlines between a numbered list header and its subsequent indented list items
  // e.g., "1. Header\n\n  * Item" becomes "1. Header\n  * Item"
  cleaned = cleaned.replace(/^(\d+\..*?)(\r?\n(?:[ \t\u00a0]*\r?\n)*)(?=\s*(?:[-*+]|\d+\.)\s+)/gm, "$1\n");

  // Remove any leading/trailing whitespace from the final string
  cleaned = cleaned.trim();

  return cleaned;
}
