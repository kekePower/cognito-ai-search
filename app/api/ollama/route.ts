import { NextResponse } from "next/server"

// Get environment variables with defaults
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://10.0.0.3:11434';
const DEFAULT_OLLAMA_MODEL = process.env.DEFAULT_OLLAMA_MODEL || 'qwen3:8b';
const AI_RESPONSE_MAX_TOKENS = parseInt(process.env.AI_RESPONSE_MAX_TOKENS || '1200', 10);

interface OllamaRequestBody {
  model: string
  prompt: string
  stream?: boolean
  options?: {
    temperature?: number  // Controls randomness (0.0 to 1.0)
    top_p?: number       // Controls diversity via nucleus sampling (0.0 to 1.0)
    num_predict?: number // Maximum number of tokens to generate
  }
}

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

interface OllamaStreamChunk {
  model: string
  created_at?: string
  response: string
  done: boolean
}

// Function to clean up think tags and other artifacts from Qwen3 responses
function cleanResponse(text: string): string {
  // Remove <Thinking> and </Thinking> tags
  let cleaned = text.replace(/<Thinking>([\s\S]*?)<\/Thinking>/g, '')
  
  // Remove any remaining think tags
  cleaned = cleaned.replace(/<think>([\s\S]*?)<\/think>/g, '')
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()

  return cleaned
}

// No streaming function needed

export async function POST(request: Request) {
  try {
    const requestBody = await request.json()
    
    const { prompt, model = DEFAULT_OLLAMA_MODEL } = requestBody

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }
    
    return await generateResponse(prompt, model)
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    )
  }
}

async function generateResponse(prompt: string, model: string) {
  try {
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }


    const systemPrompt = `/no_think
You are an advanced AI assistant integrated into a search engine. Your primary goal is to provide the most accurate, comprehensive, and helpful responses to user queries. Follow these guidelines:

1. Be concise but thorough in your responses
2. Break down complex information into clear, easy-to-understand points
3. Provide relevant context and background information when helpful
4. If a question is unclear, ask for clarification
5. When appropriate, include examples, step-by-step explanations, or relevant data
6. Always maintain a helpful and professional tone
7. If you're unsure about something, acknowledge it rather than guessing
8. Format your response in clear, readable markdown with proper headings, lists, and code blocks when applicable
9. IMPORTANT: Keep your response concise and focus on the most relevant information

Current query: ${prompt}`

    const ollamaRequestBody: OllamaRequestBody = {
      model: model,
      prompt: systemPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: AI_RESPONSE_MAX_TOKENS // Use the environment variable to control response length
      }
    }



    // Add a timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 120000) // 120 second timeout (2 minutes)


    
    // Use fetch with appropriate options
    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Connection": "keep-alive",
      },
      body: JSON.stringify(ollamaRequestBody),
      signal: controller.signal,
      // Disable caching
      cache: 'no-store',
      // Ensure we get a fresh response
      next: { revalidate: 0 },
    })

    clearTimeout(timeoutId)
    console.log(`generateResponse - Received response with status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`generateResponse - Ollama API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Ollama API Error: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    console.log("generateResponse - Parsing JSON response")
    const data: OllamaResponse = await response.json()
    console.log("generateResponse - Ollama response received successfully:", {
      model: data.model,
      responseLength: data.response?.length || 0,
      done: data.done,
      total_duration: data.total_duration
    })

    // Clean the response before returning it
    const cleanedResponse = cleanResponse(data.response)

    return NextResponse.json({ response: cleanedResponse })
  } catch (error: any) {

    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request to Ollama timed out. Please check if the server is running and accessible." },
        { status: 504 },
      )
    }

    // Handle network errors specifically
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: `Could not connect to Ollama server at ${OLLAMA_API_URL}. Please check if the server is running and accessible.` },
        { status: 503 },
      )
    }

    throw error
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const prompt = searchParams.get('q')
  
  
  if (!prompt) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    )
  }
  
  try {
    const model = searchParams.get('model') || DEFAULT_OLLAMA_MODEL
    return await generateResponse(prompt, model)
  } catch (error: any) {
    return NextResponse.json(
      { error: `Search Error: ${error.message}` },
      { status: 500 }
    )
  }
}
