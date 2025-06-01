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
  console.log(`Initial cleanResponse input: [${text}]`);

  let cleaned = text;

  // Comprehensive horizontal whitespace class string
  const H_SPACE_CLASS_STR = "[\u0009\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]";
  // Universal newline class string (includes CR, LF, CRLF, LS, PS)
  const ANY_NL_CLASS_STR = "(?:\r\n|\r|\n|\u2028|\u2029)";
  // Regex for list markers (digits or single letters followed by a period)
  const NUM_ALPHA_MARKER_STR = "(?:\\d+|[a-zA-Z])\\."; // General form

  // First, try to extract content from well-formed <Thinking> tags, as these might contain actual thoughts.
  cleaned = cleaned.replace(/<Thinking>([\s\S]*?)<\/Thinking>/gi, (match, content) => content ? content.trim() : "");
  // Then, aggressively remove all forms of <think>...</think> or stray <think>, </think> tags.
  // This regex looks for <think> potentially with attributes, followed by anything, then </think>, OR <think\s*\/?> OR just <think> or </think>.
  cleaned = cleaned.replace(/<think[^>]*>[\s\S]*?<\/think>|<think\s*\/?>|<\/think\s*>/gi, "");
  cleaned = cleaned.trim(); // Trim after all think tag removals

  // Remove Zero Width No-Break Space (BOM, U+FEFF) and Zero Width Space (U+200B) characters
  cleaned = cleaned.replace(/[\uFEFF\u200B]/g, "");
  console.log(`After ZWS removal: [${cleaned}]`);

  // --- Numbered List Formatting ---
  // Uses H_SPACE_CLASS_STR for comprehensive horizontal whitespace and ANY_NL_CLASS_STR for newlines.

  // Fix 1: Number or letter marker (e.g., 1., a.) separated by MULTIPLE newlines from text, possibly indented.
  // Handles cases with various Unicode newlines (e.g., \u2028, \u2029).
  // Goal: "  1. Text" or "  a. Text"
  const patternStrFix1NumAlpha = `^(${H_SPACE_CLASS_STR}*)(${NUM_ALPHA_MARKER_STR})${H_SPACE_CLASS_STR}*((?:${ANY_NL_CLASS_STR}${H_SPACE_CLASS_STR}*)+)${H_SPACE_CLASS_STR}*(\S.*)$`;
  cleaned = cleaned.replace(new RegExp(patternStrFix1NumAlpha, "gm"), "$1$2 $4");

  // Fix 3: Number or letter marker separated by MULTIPLE SPACES (on the same line) from text, possibly indented.
  // Goal: "  1. Text" or "  a. Text"
  const patternStrFix3NumAlpha = `^(${H_SPACE_CLASS_STR}*)(${NUM_ALPHA_MARKER_STR})${H_SPACE_CLASS_STR}{2,}(\S.*)$`;
  cleaned = cleaned.replace(new RegExp(patternStrFix3NumAlpha, "gm"), "$1$2 $3"); // Text capture uses (\S.*)

  // Remove extra newlines between a numbered/lettered list header and its subsequent indented list items
  // Handles cases with various Unicode newlines.
  const patternStrSubItemNumAlpha = `^(${H_SPACE_CLASS_STR}*${NUM_ALPHA_MARKER_STR}${H_SPACE_CLASS_STR}*.*?)(${ANY_NL_CLASS_STR}(?:${H_SPACE_CLASS_STR}*${ANY_NL_CLASS_STR})*)(?=${H_SPACE_CLASS_STR}*(?:[-*+]|${NUM_ALPHA_MARKER_STR})${H_SPACE_CLASS_STR}*)`;
  cleaned = cleaned.replace(new RegExp(patternStrSubItemNumAlpha, "gm"), "$1\n");

  // --- Bulleted List Formatting ---
  // Uses H_SPACE_CLASS_STR for comprehensive horizontal whitespace and ANY_NL_CLASS_STR for newlines.

  // Fix 1: Bullet separated by MULTIPLE newlines from text, possibly indented.
  // Handles cases with various Unicode newlines.
  // Goal: "  * Text"
  cleaned = cleaned.replace(new RegExp(`^(${H_SPACE_CLASS_STR}*)([\\u2022*+-])${H_SPACE_CLASS_STR}*((?:${ANY_NL_CLASS_STR}${H_SPACE_CLASS_STR}*)+)${H_SPACE_CLASS_STR}*(\\S.*)$`, "gm"), "$1$2 $4");

  // Fix 3: Bullet separated by MULTIPLE SPACES (on the same line) from text, possibly indented.
  // Goal: "  * Text"
  cleaned = cleaned.replace(new RegExp(`^(${H_SPACE_CLASS_STR}*)([\\u2022*+-])${H_SPACE_CLASS_STR}{2,}(\\S.*)$`, "gm"), "$1$2 $3"); // Text capture uses (\S.*)

  // Remove extra newlines between a bulleted list item and its subsequent indented list items
  // Handles cases with various Unicode newlines.
  cleaned = cleaned.replace(new RegExp(`^(${H_SPACE_CLASS_STR}*[\\u2022*+-].*?)(${ANY_NL_CLASS_STR}(?:${H_SPACE_CLASS_STR}*${ANY_NL_CLASS_STR})*)(?=${H_SPACE_CLASS_STR}*(?:[-*+]|\\d+\\.)${H_SPACE_CLASS_STR}*)`, "gm"), "$1\n");

  // Remove stray bullet points on a line by themselves if followed by a bolded heading line
  // Handles cases with various Unicode newlines.
  cleaned = cleaned.replace(new RegExp(`^[\\u2022*+-]${H_SPACE_CLASS_STR}*${ANY_NL_CLASS_STR}(?=${H_SPACE_CLASS_STR}*(?:(?:\\*\\*.*?\\*\\*)|(?:__.*?__)))`, "gm"), "");

  // Remove any leading/trailing whitespace from the final string
  cleaned = cleaned.trim();

  return cleaned;
}
