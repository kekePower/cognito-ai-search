import { NextResponse } from "next/server"

// Get environment variables with defaults
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://10.0.0.3:11434';
const DEFAULT_OLLAMA_MODEL = process.env.DEFAULT_OLLAMA_MODEL || 'cogito:14b';

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

// Function to clean up think tags and other artifacts from Qwen3 responses
function cleanResponse(text: string): string {
  // Remove <Thinking> and </Thinking> tags
  let cleaned = text.replace(/<Thinking>[\s\S]*?<\/think>/g, "").trim()

  // Remove any remaining think tags that might not be properly paired
  cleaned = cleaned.replace(/<\/?think>/g, "").trim()

  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()

  return cleaned
}

export async function POST(request: Request) {
  try {
    const { prompt, model = DEFAULT_OLLAMA_MODEL } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }
    
    return await generateResponse(prompt, model)
  } catch (error: any) {
    console.error("Error in POST /api/ollama:", error)
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

    console.log(`Making request to Ollama at ${OLLAMA_API_URL} for model ${model} with prompt: ${prompt}`);

    const systemPrompt = `/no_think You are an advanced AI assistant integrated into a search engine. Your primary goal is to provide the most accurate, comprehensive, and helpful responses to user queries. Follow these guidelines:

1. Be concise but thorough in your responses
2. Break down complex information into clear, easy-to-understand points
3. Provide relevant context and background information when helpful
4. If a question is unclear, ask for clarification
5. When appropriate, include examples, step-by-step explanations, or relevant data
6. Always maintain a helpful and professional tone
7. If you're unsure about something, acknowledge it rather than guessing
8. Format your response in clear, readable markdown with proper headings, lists, and code blocks when applicable

Current query: ${prompt}`

    const ollamaRequestBody: OllamaRequestBody = {
      model: model,
      prompt: systemPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        // Note: max_tokens is not supported by all Ollama models
        // Using num_predict instead for models that support it
        num_predict: 2000
      }
    }

    // Add a timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ollamaRequestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Ollama API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Ollama API Error: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    const data: OllamaResponse = await response.json()
    console.log("Ollama response received successfully")

    // Clean the response before returning it
    const cleanedResponse = cleanResponse(data.response)

    return NextResponse.json({ response: cleanedResponse })
  } catch (error: any) {
    console.error("Error communicating with Ollama:", error)

    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request to Ollama timed out. Please check if the server is running and accessible." },
        { status: 504 },
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
    console.error("Error in GET /api/ollama search:", error)
    return NextResponse.json(
      { error: `Search Error: ${error.message}` },
      { status: 500 }
    )
  }
}
