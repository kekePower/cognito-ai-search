"use client"

import React from "react"
import { Search, Sparkles, Globe, Bot, Shield, Zap, Database, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { SectionHeader } from "@/components/ui/section-header"

export function HowItWorksContent() {
  return (
    <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <BackButton href="/" />
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <SectionHeader
          title="How Cognito AI Search Works"
          size="xl"
          align="left"
          className="mb-6"
        />

        <section className="mb-10">
          <SectionHeader
            title="What is Cognito AI Search?"
            size="lg"
            className="mb-4"
          />
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
          <SectionHeader
            title="Your Search Journey: Step by Step"
            size="lg"
            className="mb-6"
          />
          
          <div className="grid gap-6 mb-8">
            <div className="how-it-works-blue-card flex items-start gap-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <SectionHeader
                  title="1. Ask Your Question"
                  size="md"
                  className="mb-2 text-blue-900 dark:text-blue-100"
                />
                <p className="text-blue-800 dark:text-blue-200">
                  Type your question naturally in our beautifully designed search interface. As you focus on the search field, 
                  watch as elegant gradient animations guide your attention. No need for special keywords - our AI understands 
                  natural language and context.
                </p>
              </div>
            </div>

            <div className="how-it-works-purple-card flex items-start gap-4 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <SectionHeader
                  title="Instant AI Analysis"
                  size="md"
                  className="mb-2 text-purple-900 dark:text-purple-100"
                />
                <p className="text-purple-800 dark:text-purple-200">
                  Watch as our local AI analyzes your question with a subtle pulsing animation, optimizing your search query 
                  for maximum relevance. For example, "Paris" becomes "things to do in Paris travel guide" - all while 
                  maintaining complete privacy with smooth, professional visual feedback.
                </p>
              </div>
            </div>

            <div className="how-it-works-green-card flex items-start gap-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <SectionHeader
                  title="3. Anonymous Web Search"
                  size="md"
                  className="mb-2 text-green-900 dark:text-green-100"
                />
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
                <SectionHeader
                  title="4. AI Analysis & Summary"
                  size="md"
                  className="mb-2 text-orange-900 dark:text-orange-100"
                />
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
          <SectionHeader
            title="Why Choose Cognito AI Search?"
            size="lg"
            className="mb-6"
          />
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-card rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <SectionHeader
                  title="100% Private"
                  size="md"
                  className="mb-0"
                />
              </div>
              <ul className="space-y-2 text-sm">
                <li>• No tracking or data collection</li>
                <li>• No advertising profiles</li>
                <li>• All processing on your hardware</li>
                <li>• Search history stays local</li>
              </ul>
            </div>

            <div className="p-6 bg-card rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <SectionHeader
                  title="AI-Enhanced"
                  size="md"
                  className="mb-0"
                />
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Smart query optimization</li>
                <li>• Intelligent AI responses</li>
                <li>• Natural language understanding</li>
                <li>• Contextual summaries</li>
              </ul>
            </div>

            <div className="p-6 bg-card rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                <SectionHeader
                  title="Self-Hosted"
                  size="md"
                  className="mb-0"
                />
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Complete control over your data</li>
                <li>• No dependency on external services</li>
                <li>• Customizable and extensible</li>
                <li>• Works offline for AI responses</li>
              </ul>
            </div>

            <div className="p-6 bg-card rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <SectionHeader
                  title="Comprehensive"
                  size="md"
                  className="mb-0"
                />
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
          <SectionHeader
            title="Privacy: What Makes Us Different"
            size="lg"
            className="mb-4"
          />
          <p className="mb-4">
            Traditional search engines like Google track everything you search to build detailed profiles for advertising. 
            Here's how we're different:
          </p>
          
          <div className="how-it-works-red-list bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-4">
            <SectionHeader
              title="Traditional Search Engines:"
              size="md"
              className="mb-2 text-red-900 dark:text-red-100"
            />
            <ul className="text-red-800 dark:text-red-200 space-y-1">
              <li>• Track every search you make</li>
              <li>• Build advertising profiles</li>
              <li>• Store your data indefinitely</li>
              <li>• Share data with third parties</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <SectionHeader
              title="Cognito AI Search:"
              size="md"
              className="mb-2 text-green-900 dark:text-green-100"
            />
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
          <SectionHeader
            title="Enhanced Search Experience"
            size="lg"
            className="mb-6"
          />
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <SectionHeader
                  title="Holographic Design System"
                  size="md"
                  className="mb-0"
                />
              </div>
              <p className="text-sm mb-3">
                Experience the future with our crystalline holographic interface featuring sharp angular components, 
                neon color schemes, and glass morphism effects that create an immersive search environment.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Crystalline UI with angular components</li>
                <li>• Neon cyan/magenta/blue color palette</li>
                <li>• Glass morphism with backdrop blur</li>
                <li>• Dynamic glow effects and animations</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                <SectionHeader
                  title="Performance Excellence"
                  size="md"
                  className="mb-0"
                />
              </div>
              <p className="text-sm mb-3">
                Built for speed with 50% faster builds, optimized codebase with 68% fewer components, 
                and enhanced caching for lightning-fast search responses.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• 50% faster builds (4.0s → 2.0s)</li>
                <li>• 68% reduction in UI components</li>
                <li>• Enhanced caching system</li>
                <li>• Optimized request handling</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <SectionHeader
                  title="Advanced Features"
                  size="md"
                  className="mb-0"
                />
              </div>
              <p className="text-sm mb-3">
                Export search results to PDF with LaTeX support, enjoy 200+ AI-focused search suggestions, 
                and experience seamless Next.js 15 form integration.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• PDF export with LaTeX formatting</li>
                <li>• 200+ curated AI search topics</li>
                <li>• Next.js 15 form integration</li>
                <li>• Enhanced error handling</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                <SectionHeader
                  title="Cross-Platform Support"
                  size="md"
                  className="mb-0"
                />
              </div>
              <p className="text-sm mb-3">
                Enjoy consistent experience across all browsers with Firefox compatibility fixes, 
                IPv6 Docker support, and warm cream light mode alongside enhanced dark mode.
              </p>
              <ul className="space-y-1 text-sm">
                <li>• Cross-browser compatibility</li>
                <li>• IPv6 Docker configuration</li>
                <li>• Warm cream light mode</li>
                <li>• Enhanced dark mode with neon effects</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <SectionHeader
            title="Technical Details (For the Curious)"
            size="lg"
            className="mb-4"
          />
          <details className="bg-card rounded-lg p-6 border border-border">
            <summary className="cursor-pointer font-semibold text-primary mb-4 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 transition-transform duration-200" />
              Technical Details (For the Curious)
            </summary>
            <div className="space-y-6 mt-4">
              <div>
                <SectionHeader
                  title="Search Engine: SearXNG"
                  size="md"
                  className="mb-2"
                />
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
                <SectionHeader
                  title="AI Processing: Ollama"
                  size="md"
                  className="mb-2"
                />
                <p className="mb-2">
                  Ollama runs large language models locally on your hardware, ensuring your conversations never leave your infrastructure.
                  <strong className="text-amber-600 dark:text-amber-400"> Requires Ollama v0.9.0+ for compatibility with advanced features.</strong>
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Supports Llama, Mistral, CodeLlama, and many other models</li>
                  <li>• Runs entirely on your hardware (CPU or GPU)</li>
                  <li>• No internet connection required for AI responses</li>
                  <li>• Models can be customized and fine-tuned</li>
                  <li>• Uses 'think: false' parameter for optimized responses</li>
                </ul>
              </div>
              
              <div>
                <SectionHeader
                  title="Technology Stack"
                  size="md"
                  className="mb-2"
                />
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Frontend:</strong> Next.js 15, TypeScript, Tailwind CSS</li>
                  <li>• <strong>Search:</strong> SearXNG metasearch engine</li>
                  <li>• <strong>AI:</strong> Ollama v0.9.0+ with local language models</li>
                  <li>• <strong>Deployment:</strong> Docker with IPv6 support, Node.js or static hosting</li>
                  <li>• <strong>Performance:</strong> 50% faster builds, optimized component architecture</li>
                  <li>• <strong>Design:</strong> Holographic shard system with crystalline aesthetics</li>
                </ul>
              </div>
              
              <div>
                <SectionHeader
                  title="Deployment Options"
                  size="md"
                  className="mb-2"
                />
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Home Server:</strong> Run on a spare computer or NAS</li>
                  <li>• <strong>VPS/Cloud:</strong> Deploy on any Linux server</li>
                  <li>• <strong>Raspberry Pi:</strong> Works great on Pi 4 with 8GB RAM</li>
                </ul>
              </div>

              <div>
                <SectionHeader
                  title="How It All Works Together"
                  size="md"
                  className="mb-2"
                />
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
