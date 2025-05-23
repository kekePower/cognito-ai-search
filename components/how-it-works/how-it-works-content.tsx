"use client"

import Link from "next/link"
import { Search, Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorksContent() {
  return (
    <main className="flex-1 container max-w-3xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-6">
          How Cognito AI Search Works
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What is Cognito AI Search?</h2>
          <p>
            Cognito AI Search combines the power of web search with AI-generated responses to give you the best of both worlds. 
            It's designed to be private, running entirely on your own hardware, so your search data stays with you.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Two Technologies Working Together</h2>
          
          <div className="bg-primary/5 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-medium mb-3 flex items-center">
              <Search className="h-5 w-5 mr-2 text-primary" />
              Web Search with SearXNG
            </h3>
            <p>
              When you type a search query, Cognito first optimizes your query to get better results, then sends it to SearXNG, 
              a privacy-focused search engine that collects results from multiple search engines. This gives you comprehensive 
              web results without tracking or storing your personal data.
            </p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI Responses with Ollama
            </h3>
            <p>
              At the same time, your query is sent to a local AI model running on Ollama. This AI reads your question and 
              generates a helpful, informative response based on its knowledge. Since the AI runs locally on your computer, 
              your questions aren't sent to external servers.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Smart Query Optimization</h2>
          <p>
            Cognito doesn't just pass your query along as-is. It uses AI to optimize your search query, making it more 
            effective at finding what you're looking for. For example, if you search for "Paris," the system might optimize 
            it to "things to do in Paris" to get more useful results.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Privacy First</h2>
          <p>
            Unlike mainstream search engines that track your searches to build a profile for advertising, Cognito AI Search 
            is designed with privacy in mind:
          </p>
          <ul>
            <li>All processing happens on your own hardware</li>
            <li>No personal data is sent to third-party servers</li>
            <li>Your search history is stored only in your browser</li>
            <li>You can easily delete your search history at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Technical Details (For the Curious)</h2>
          <p>
            Behind the scenes, Cognito AI Search uses:
          </p>
          <ul>
            <li><strong>SearXNG</strong>: A self-hosted, privacy-respecting metasearch engine</li>
            <li><strong>Ollama</strong>: A framework for running large language models locally</li>
            <li><strong>Next.js</strong>: A React framework for building the user interface</li>
          </ul>
          <p>
            When you search, your query is processed in parallel - sent to both SearXNG for web results and to 
            Ollama for AI-generated responses. The results are then presented together in a unified interface.
          </p>
        </section>
      </div>
    </main>
  )
}
