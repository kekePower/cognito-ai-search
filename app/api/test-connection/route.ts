import { NextResponse } from "next/server"

export async function GET() {
  const results = {
    ollama: false,
    searxng: false,
    details: {
      ollama: "",
      searxng: "",
    },
  }

  try {
    const ollamaResponse = await fetch("http://10.0.0.3:11434/api/version", {
      method: "GET",
      cache: "no-store",
    })

    results.ollama = ollamaResponse.ok
    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json()
      results.details.ollama = `Connected to Ollama version: ${data.version || "unknown"}`
    } else {
      results.details.ollama = `Failed to connect: ${ollamaResponse.status} ${ollamaResponse.statusText}`
    }
  } catch (error: any) {
    results.details.ollama = `Error: ${error.message}`
  }

  try {
    const searxngResponse = await fetch("http://10.0.0.3:8888/healthz", {
      method: "GET",
      cache: "no-store",
    })

    results.searxng = searxngResponse.ok
    if (searxngResponse.ok) {
      results.details.searxng = "SearXNG server is reachable"
    } else {
      results.details.searxng = `Failed to connect: ${searxngResponse.status} ${searxngResponse.statusText}`
    }
  } catch (error: any) {
    results.details.searxng = `Error: ${error.message}`
  }

  return NextResponse.json(results)
}
