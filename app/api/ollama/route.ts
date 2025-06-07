import { NextRequest, NextResponse } from 'next/server'
import { getApiConfig } from '@/lib/api/config'
import { generateAIResponse, checkOllamaHealth } from '@/lib/api/ollama'
import { AIResponse } from '@/lib/api/types'
import { cleanResponse } from '@/lib/utils'

/**
 * POST handler for the Ollama API route
 * Generates a response using the Ollama API
 */
export async function POST(request: NextRequest) {
  try {
    // Get configuration - handle missing env vars gracefully
    let config;
    try {
      config = getApiConfig()
    } catch (configError) {
      console.error('[Ollama API] Configuration error:', configError)
      const response: AIResponse = {
        response: '',
        error: 'AI assistant configuration is incomplete. Please check your environment setup.'
      }
      return NextResponse.json(response, { status: 503 })
    }
    
    const requestBody = await request.json()
    const { prompt, model = config.defaultOllamaModel } = requestBody

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    console.log(`[Ollama API] Generating AI response for prompt: "${prompt.substring(0, 100)}..."`)

    // Create system prompt
    const systemPrompt = `/no_think
You are an advanced AI assistant integrated into a search engine. Your primary goal is to provide the most accurate, comprehensive, and helpful responses to user queries. Strive to deliver expert-level explanations and insights. Follow these guidelines:

1.  **Content Depth & Structure:**
    *   Provide thorough, in-depth, and comprehensive answers.
    *   Break down complex information into clear, logically structured sections using Markdown headings (##, ###).
    *   Offer relevant context, background information, and detailed explanations.
    *   When appropriate, include examples, step-by-step instructions, or relevant data.
    *   Utilize Markdown tables, blockquotes, and other formatting elements to enhance clarity and presentation when beneficial.

2.  **Accuracy & Tone:**
    *   Ensure all information is accurate and up-to-date.
    *   If a question is unclear or ambiguous, ask for clarification.
    *   Always maintain a helpful, objective, and professional tone.
    *   If you're unsure about something or if information is speculative, acknowledge it.

3.  **Markdown Formatting Specifics:**
    *   Use standard Markdown for bulleted lists (* item or - item) and ordered lists (e.g., 1. item, a. item).
    *   CRITICALLY IMPORTANT for lists: Each list item's marker (e.g., "1.", "a.") AND its corresponding text MUST be on the SAME line.
        *   CORRECT Example:
            \\\`\\\`\\\`
            1. First item.
            a. Sub-item alpha.
            \\\`\\\`\\\`
        *   INCORRECT Example (DO NOT DO THIS):
            \\\`\\\`\\\`
            1.
            First item.
            \\\`\\\`\\\`
    *   Use fenced code blocks (\`\`\`language\\ncode\\n\`\`\`) for code snippets.

4.  **Focus & Relevance:**
    *   Ensure your response directly addresses the user's query, focusing on the most relevant information to provide a complete answer.

Current query: ${prompt}`;

    // Generate AI response
    const aiResponse = await generateAIResponse(
      systemPrompt,
      config.ollamaApiUrl,
      model,
      config.aiResponseMaxTokens,
      config.ollamaTimeoutMs
    )

    // Clean the response
    const cleanedResponse = cleanResponse(aiResponse)

    const response: AIResponse = {
      response: cleanedResponse
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

  } catch (error: any) {
    console.error('[Ollama API] Error:', error)
    
    const response: AIResponse = {
      response: '',
      error: error.message || 'An unexpected error occurred'
    }

    return NextResponse.json(response, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  }
}

/**
 * GET handler for the Ollama API route
 * Generates a response using the Ollama API based on query parameters
 */
export async function GET(request: NextRequest) {
  try {
    // Get configuration - handle missing env vars gracefully
    let config;
    try {
      config = getApiConfig()
    } catch (configError) {
      console.error('[Ollama API] Configuration error:', configError)
      const response: AIResponse = {
        response: '',
        error: 'AI assistant configuration is incomplete. Please check your environment setup.'
      }
      return NextResponse.json(response, { status: 503 })
    }
    
    const { searchParams } = new URL(request.url)
    const prompt = searchParams.get('q')
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      )
    }
    
    const model = searchParams.get('model') || config.defaultOllamaModel
    
    // Forward to POST handler
    return POST(new NextRequest(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model })
    }))
    
  } catch (error: any) {
    console.error('[Ollama API] GET Error:', error)
    
    const response: AIResponse = {
      response: '',
      error: error.message || 'An unexpected error occurred'
    }

    return NextResponse.json(response, { status: 500 })
  }
}
