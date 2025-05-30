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
    
    // Check if Ollama server is healthy before proceeding
    const isHealthy = await checkOllamaHealth(config.ollamaApiUrl)
    if (!isHealthy) {
      console.error('[Ollama API] Server health check failed')
      const response: AIResponse = {
        response: '',
        error: 'AI assistant is currently unavailable. Please check that your Ollama server is running and accessible.'
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
You are an advanced AI assistant integrated into a search engine. Your primary goal is to provide the most accurate, comprehensive, and helpful responses to user queries. Follow these guidelines:

1. Be concise but thorough in your responses
2. Break down complex information into clear, easy-to-understand points
3. Provide relevant context and background information when helpful
4. If a question is unclear, ask for clarification
5. When appropriate, include examples, step-by-step explanations, or relevant data
6. Always maintain a helpful and professional tone
7. If you're unsure about something, acknowledge it rather than guessing
8. Format your response in clear, readable markdown. Use proper headings (e.g., ## Heading, ### Subheading). For lists, use standard markdown for bulleted lists (* item or - item) and ordered lists (e.g., 1. item, 2. item). CRITICALLY IMPORTANT: Ensure each list item's marker and text are on the SAME line (e.g., "1. First item" NOT "1.\nFirst item"). Use fenced code blocks (\`\`\`language\ncode\n\`\`\`) for code snippets when applicable.
9. Write a minimum of 500 words and no more than 800 words
10. IMPORTANT: Keep your response concise and focus on the most relevant information

Current query: ${prompt}`

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
    
    // Check if Ollama server is healthy before proceeding
    const isHealthy = await checkOllamaHealth(config.ollamaApiUrl)
    if (!isHealthy) {
      console.error('[Ollama API] Server health check failed')
      const response: AIResponse = {
        response: '',
        error: 'AI assistant is currently unavailable. Please check that your Ollama server is running and accessible.'
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
