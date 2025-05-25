"use client"

import Link from "next/link"
import { Search, Sparkles, ArrowLeft, Globe, Bot, Shield, Zap, Database, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorksContent() {
  return (
    <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 md:py-12">
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
            Cognito AI Search is a privacy-first intelligent search platform that seamlessly combines comprehensive web results 
            with AI-powered insights. Unlike traditional search engines, everything runs on your own infrastructure, 
            ensuring your data remains completely private and secure while delivering a premium search experience.
          </p>
          <p>
            Experience the power of web search enhanced by artificial intelligence - think Google's comprehensive results 
            meets ChatGPT's intelligence, but with complete privacy and no data collection. Every interaction is smooth, 
            fast, and designed with attention to detail.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Your Search Journey: Step by Step</h2>
          
          <div className="grid gap-6 mb-8">
            <div className="flex items-start gap-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-blue-900 dark:text-blue-100">
                  1. Ask Your Question
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Type your question naturally in our beautifully designed search interface. As you focus on the search field, 
                  watch as elegant gradient animations guide your attention. No need for special keywords - our AI understands 
                  natural language and context.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-purple-900 dark:text-purple-100">
                  2. AI Query Optimization
                </h3>
                <p className="text-purple-800 dark:text-purple-200">
                  Watch as our local AI analyzes your question with a subtle pulsing animation, optimizing your search query 
                  for maximum relevance. For example, "Paris" becomes "things to do in Paris travel guide" - all while 
                  maintaining complete privacy with smooth, professional visual feedback.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-green-900 dark:text-green-100">
                  3. Anonymous Web Search
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Your optimized query is sent to SearXNG, which searches multiple engines (Google, Bing, DuckDuckGo, etc.) 
                  without tracking you or storing your data. You get comprehensive results while staying anonymous.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-orange-900 dark:text-orange-100">
                  4. AI Analysis & Summary
                </h3>
                <p className="text-orange-800 dark:text-orange-200">
                  While searching the web, our local AI analyzes your question with elegant loading animations. Watch as 
                  both web results and AI insights fade in smoothly, creating a seamless experience where you get 
                  comprehensive information and intelligent analysis in one beautifully designed interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Why Choose Cognito AI Search?</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-medium">100% Private</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• No tracking or data collection</li>
                <li>• No advertising profiles</li>
                <li>• All processing on your hardware</li>
                <li>• Search history stays local</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-medium">AI-Enhanced</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Smart query optimization</li>
                <li>• Intelligent AI responses</li>
                <li>• Natural language understanding</li>
                <li>• Contextual summaries</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-medium">Self-Hosted</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Complete control over your data</li>
                <li>• No dependency on external services</li>
                <li>• Customizable and extensible</li>
                <li>• Works offline for AI responses</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xl font-medium">Comprehensive</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Results from multiple search engines</li>
                <li>• Both web results and AI insights</li>
                <li>• Fast, responsive interface</li>
                <li>• Works on all devices</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Privacy: What Makes Us Different</h2>
          <p className="mb-4">
            Traditional search engines like Google track everything you search to build detailed profiles for advertising. 
            Here's how we're different:
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-4">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">❌ Traditional Search Engines:</h4>
            <ul className="text-red-800 dark:text-red-200 space-y-1">
              <li>• Track every search you make</li>
              <li>• Build advertising profiles</li>
              <li>• Store your data indefinitely</li>
              <li>• Share data with third parties</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Cognito AI Search:</h4>
            <ul className="text-green-800 dark:text-green-200 space-y-1">
              <li>• No tracking or data collection</li>
              <li>• No advertising or profiling</li>
              <li>• Data stays on your hardware</li>
              <li>• You control your search history</li>
              <li>• 100% Open Source</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6">Enhanced Search Experience</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-medium">Smart Suggestions</h3>
              </div>
              <p className="text-sm mb-3">
                Get inspired with 6 curated search suggestions from our collection of 200+ diverse AI-related topics. 
                Each suggestion is carefully crafted to help you explore fascinating areas of artificial intelligence.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• 200+ curated AI topics</li>
                <li>• 6 suggestions per visit</li>
                <li>• Covers cutting-edge AI research</li>
                <li>• Perfect for learning and exploration</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-medium">Polished Interface</h3>
              </div>
              <p className="text-sm mb-3">
                Every detail has been carefully crafted for a premium experience. From smooth animations to 
                pixel-perfect alignment, the interface feels responsive and professional.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Smooth fade-in transitions</li>
                <li>• Elegant loading animations</li>
                <li>• Responsive design</li>
                <li>• Dark/light theme support</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Technical Details (For the Curious)</h2>
          <details className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 transition-transform duration-200" />
              Technical Details (For the Curious)
            </summary>
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">🔍 Search Engine: SearXNG</h4>
                <p className="mb-2">
                  SearXNG is a privacy-respecting metasearch engine that aggregates results from multiple search engines 
                  without storing your data or tracking your searches.
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Searches Google, Bing, DuckDuckGo, and 70+ other engines</li>
                  <li>• No logs, no tracking, no data retention</li>
                  <li>• Open source and self-hostable</li>
                  <li>• Removes tracking parameters from results</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">🤖 AI Processing: Ollama</h4>
                <p className="mb-2">
                  Ollama runs large language models locally on your hardware, ensuring your conversations never leave your infrastructure.
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Supports Llama, Mistral, CodeLlama, and many other models</li>
                  <li>• Runs entirely on your hardware (CPU or GPU)</li>
                  <li>• No internet connection required for AI responses</li>
                  <li>• Models can be customized and fine-tuned</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">⚡ Technology Stack</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Frontend:</strong> Next.js 15, TypeScript, Tailwind CSS</li>
                  <li>• <strong>Search:</strong> SearXNG metasearch engine</li>
                  <li>• <strong>AI:</strong> Ollama with local language models</li>
                  <li>• <strong>Deployment:</strong> Docker, Node.js or static hosting</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-2">🏠 Deployment Options</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Home Server:</strong> Run on a spare computer or NAS</li>
                  <li>• <strong>VPS/Cloud:</strong> Deploy on any Linux server</li>
                  <li>• <strong>Raspberry Pi:</strong> Works great on Pi 4 with 8GB RAM</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">🔄 How It All Works Together</h4>
                <p className="text-sm">
                  When you search, your query is processed in parallel: sent to both SearXNG for web results and to 
                  Ollama for AI-generated responses. The optimized query ensures better search results, while the AI 
                  provides contextual understanding and summaries. Everything happens locally, so your data never 
                  leaves your infrastructure.
                </p>
              </div>
            </div>
          </details>
        </section>
      </div>
    </main>
  )
}
