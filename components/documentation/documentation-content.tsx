"use client"

import React from "react"
import Link from "next/link"
import { Download, Settings, Zap, Shield, BookOpen, Github, ExternalLink, Terminal, Globe, Bot, Database, Sparkles } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"
import packageJson from "../../package.json"

export function DocumentationContent() {
  return (
    <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <BackButton href="/" />
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <SectionHeader
          title="Documentation"
          size="xl"
          align="left"
          className="mb-4"
        />
        
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full text-sm font-medium border pill-version-light dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800">
            v{packageJson.version}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium border pill-latest-light dark:bg-green-900/40 dark:text-green-200 dark:border-green-800">
            Latest
          </span>
        </div>
        
        <p className="text-xl text-muted-foreground mb-8">
          Complete guide to setting up, configuring, and using Cognito AI Search v{packageJson.version}
        </p>

        {/* Quick Navigation */}
        <div className="grid md:grid-cols-3 gap-4 mb-10 not-prose">
          <a href="#getting-started" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Quick Start</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">Get up and running in minutes</p>
          </a>
          
          <a href="#configuration" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Configuration</h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">Detailed setup and customization</p>
          </a>
          
          <a href="#contributing" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Github className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">Contributing</h3>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">Help improve the project</p>
          </a>
        </div>

        {/* What's New Section */}
        <section className="mb-12" id="whats-new">
          <SectionHeader
            title={`What's New in v${packageJson.version}`}
            size="lg"
            align="left"
            className="mb-4"
            icon={<Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          />
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">✨ Holographic Shard Design System</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• Crystalline UI with sharp angular components</li>
                <li>• Neon color scheme with cyan/magenta/blue accents</li>
                <li>• Glass morphism with backdrop blur effects</li>
                <li>• Dynamic glow effects and polygon clip-paths</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">🚀 Performance & Architecture</h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• 50% faster builds (4.0s → 2.0s)</li>
                <li>• 68% reduction in UI components (57 → 19)</li>
                <li>• Removed 31 unused dependencies</li>
                <li>• Enhanced caching and request deduplication</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">📄 Enhanced Search Experience</h3>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <li>• PDF export with advanced LaTeX support</li>
                <li>• 200+ AI-focused search suggestions</li>
                <li>• Next.js 15 Form integration</li>
                <li>• Clean error handling with retry functionality</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold mb-3 text-orange-900 dark:text-orange-100">🔧 Technical Improvements</h3>
              <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                <li>• Ollama 'think: false' parameter support</li>
                <li>• IPv6 Docker support configuration</li>
                <li>• Cross-browser compatibility fixes</li>
                <li>• Modular architecture with TypeScript</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h3 className="text-lg font-semibold mb-3 text-cyan-900 dark:text-cyan-100">🎨 User Experience</h3>
              <ul className="space-y-2 text-sm text-cyan-800 dark:text-cyan-200">
                <li>• Warm cream light mode with crystalline aesthetics</li>
                <li>• Enhanced dark mode with neon effects</li>
                <li>• Sparkles icon replacing brain emoji</li>
                <li>• Eliminated page scrolling with optimized spacing</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-lg font-semibold mb-3 text-indigo-900 dark:text-indigo-100">🔒 Security & Privacy</h3>
              <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                <li>• Enhanced input validation and error handling</li>
                <li>• Secure storage with automatic cleanup</li>
                <li>• No tracking, complete local processing</li>
                <li>• Improved content security policies</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Breaking Changes in v1.2.0
            </h3>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
              <li>• <strong>Ollama v0.9.0+ Required:</strong> Due to 'think: false' parameter support</li>
              <li>• <strong>Environment Variables:</strong> New configuration options available</li>
              <li>• <strong>Component APIs:</strong> Some internal component APIs have changed</li>
              <li>• <strong>CSS Classes:</strong> Updated Tailwind class names for consistency</li>
            </ul>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="mb-12" id="getting-started">
          <SectionHeader
            title="Getting Started"
            size="lg"
            align="left"
            className="mb-4"
            icon={<Zap className="h-6 w-6 text-green-600 dark:text-green-400" />}
          />
          
          <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 mb-6">
            <h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
            <ul className="space-y-2">
              <li>• <strong>Node.js 18+</strong> and npm/yarn/pnpm</li>
              <li>• <strong>SearXNG instance</strong> (self-hosted or public URL)</li>
              <li>• <strong>Ollama v0.9.0+</strong> installed with desired AI models</li>
              <li>• <strong>Redis</strong> (optional, recommended for caching)</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold mb-4">Quick Installation</h3>
          
          <div className="bg-secondary-900 dark:bg-secondary-950 rounded-lg p-4 mb-6 not-prose">
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <Terminal className="h-4 w-4" />
              <span className="text-sm font-medium">Terminal</span>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`# Clone the repository
git clone https://github.com/kekePower/cognito-ai-search.git
cd cognito-ai-search

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Start development server
pnpm dev`}
            </pre>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">!</span>
              </div>
              <div>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Important:</strong> You'll need to configure your <code>.env.local</code> file with your SearXNG and Ollama endpoints before the application will work properly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Docker Deployment Section */}
        <section className="mb-12" id="docker-deployment">
          <SectionHeader
            title="Docker Deployment"
            size="lg"
            align="left"
            className="mb-4"
            icon={<div className="h-6 w-6 text-blue-600 dark:text-blue-400">🐳</div>}
          />
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">🚀 Quick Start with Docker Hub</h3>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              The easiest way to get started is using our pre-built Docker image from Docker Hub:
            </p>
            
            <div className="bg-secondary-900 dark:bg-secondary-950 rounded-lg p-4 not-prose">
              <div className="flex items-center gap-2 mb-3 text-secondary">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-medium">Docker Run Command</span>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
{`docker run -d \\
  -p 3000:3000 \\
  -e OLLAMA_API_URL="http://YOUR_OLLAMA_HOST:11434" \\
  -e DEFAULT_OLLAMA_MODEL="phi4-mini:3.8b-q8_0" \\
  -e AI_RESPONSE_MAX_TOKENS="1200" \\
  -e SEARXNG_API_URL="http://YOUR_SEARXNG_HOST:8888" \\
  --name cognito-ai-search \\
  kekepower/cognito-ai-search:latest`}
              </pre>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6 not-prose">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">📦 Available Tags</h4>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• <code>kekepower/cognito-ai-search:latest</code> - Latest stable</li>
                <li>• <code>kekepower/cognito-ai-search:1.1.0</code> - Version 1.1.0</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">🔧 Key Environment Variables</h4>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <li>• <code>OLLAMA_API_URL</code> - Your Ollama instance</li>
                <li>• <code>SEARXNG_API_URL</code> - Your SearXNG instance</li>
                <li>• <code>DEFAULT_OLLAMA_MODEL</code> - AI model to use</li>
                <li>• <code>AI_RESPONSE_MAX_TOKENS</code> - Response length</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">🔄</span>
              </div>
              <div>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Automatic Updates:</strong> The Docker Hub image is automatically updated with each new release through our CI/CD pipeline. 
                  Pull the <code>latest</code> tag to get the newest features and fixes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Section */}
        <section className="mb-12" id="configuration">
          <SectionHeader
            title="Configuration"
            size="lg"
            align="left"
            className="mb-4"
            icon={<Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          />

          <h3 className="text-lg font-semibold mb-4">Environment Variables</h3>
          
          <div className="bg-secondary-900 dark:bg-secondary-950 rounded-lg p-4 mb-6 not-prose">
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">.env.local</span>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`# SearXNG Configuration
SEARXNG_API_URL=http://your-searxng-instance:port

# Ollama Configuration  
OLLAMA_API_URL=http://your-ollama-instance:11434
DEFAULT_OLLAMA_MODEL=phi4-mini:3.8b-q8_0
AI_RESPONSE_MAX_TOKENS=100

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">SearXNG Setup</h4>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                SearXNG is your privacy-focused search engine. You can either self-host it or use a public instance.
              </p>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• Enable API and JSON support</li>
                <li>• Configure rate limiting</li>
                <li>• Set up Redis caching (recommended)</li>
                <li>• Enable IPv6 support if needed</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Ollama Configuration</h4>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                Ollama runs your AI models locally. Choose models based on your hardware capabilities.
              </p>
              <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
                <li>• <strong>Recommended:</strong> phi4-mini:3.8b-q8_0</li>
                <li>• <strong>Alternative:</strong> mistral, llama3</li>
                <li>• <strong>GPU:</strong> Enable CUDA/Metal acceleration</li>
                <li>• <strong>Memory:</strong> 8GB+ RAM recommended</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Deployment Options</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6 not-prose">
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <h4 className="font-semibold mb-2">🏠 Home Server</h4>
              <p className="text-sm text-muted-foreground">Run on a spare computer or NAS device</p>
            </div>
            
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <h4 className="font-semibold mb-2">☁️ VPS/Cloud</h4>
              <p className="text-sm text-muted-foreground">Deploy on any Linux server or cloud provider</p>
            </div>
            
            <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <h4 className="font-semibold mb-2">🥧 Raspberry Pi</h4>
              <p className="text-sm text-muted-foreground">Works great on Pi 4 with 8GB RAM</p>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-12" id="architecture">
          <SectionHeader
            title="Architecture Overview"
            size="lg"
            align="left"
            className="mb-4"
            icon={<Database className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
          />
          
          <div className="bg-gradient-to-br from-secondary-50 to-blue-50 dark:from-secondary-800/50 dark:to-blue-900/20 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700 mb-6">
            <h3 className="text-lg font-semibold mb-4">How It All Works Together</h3>
            <p className="mb-4">
              Cognito AI Search operates on a parallel processing architecture where your search query is simultaneously:
            </p>
            <ul className="space-y-2">
              <li>• <strong>Optimized by AI:</strong> Local Ollama models enhance your query for better results</li>
              <li>• <strong>Searched via SearXNG:</strong> Anonymous web search across 70+ search engines</li>
              <li>• <strong>Analyzed by AI:</strong> Intelligent summaries and contextual responses</li>
              <li>• <strong>Cached intelligently:</strong> Smart caching prevents duplicate requests</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6 not-prose">
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Frontend</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Next.js 15 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Lucide React for icons</li>
                </ul>
              </div>
              
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Search Engine</h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• SearXNG metasearch engine</li>
                  <li>• 70+ search engine sources</li>
                  <li>• Privacy-focused design</li>
                  <li>• No tracking or logging</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">AI Processing</h4>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>• Ollama for local AI models</li>
                  <li>• Support for Llama, Mistral, Phi</li>
                  <li>• GPU acceleration support</li>
                  <li>• Completely offline capable</li>
                </ul>
              </div>
              
              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Infrastructure</h4>
                <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                  <li>• Docker containerization</li>
                  <li>• Redis caching (optional)</li>
                  <li>• IPv6 support</li>
                  <li>• Self-hosted deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contributing Section */}
        <section className="mb-12" id="contributing">
          <SectionHeader
            title="Contributing"
            size="lg"
            align="left"
            className="mb-4"
            icon={<Github className="h-6 w-6 text-green-600 dark:text-green-400" />}
          />
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100">🚀 Join Our Mission</h3>
            <p className="text-green-800 dark:text-green-200 mb-4">
              Help us build the future of private, intelligent search! Whether you're fixing bugs, adding features, 
              improving documentation, or sharing ideas - every contribution makes Cognito AI Search better for everyone.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                🐛 Bug Fixes
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                ✨ New Features
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                📚 Documentation
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                🎨 UI/UX
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-6">How to Contribute</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8 not-prose">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Fork & Branch</h4>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Fork the repository and create your feature branch from <code className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-xs">main</code>
              </p>
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded p-3">
                <code className="text-xs text-blue-800 dark:text-blue-200">
                  git checkout -b feature/amazing-feature
                </code>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Code Quality</h4>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                Write clean, well-documented code that follows our style guidelines and includes proper TypeScript types
              </p>
              <ul className="text-xs text-purple-800 dark:text-purple-200 space-y-1">
                <li>• Use TypeScript throughout</li>
                <li>• Follow existing patterns</li>
                <li>• Add proper error handling</li>
                <li>• Include JSDoc comments</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Pull Request</h4>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                Open a detailed PR describing your changes, the problem you're solving, and how to test it
              </p>
              <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                <li>• Clear description</li>
                <li>• Screenshots if UI changes</li>
                <li>• Test instructions</li>
                <li>• Link related issues</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Development Setup</h3>
          
          <div className="bg-secondary-900 dark:bg-secondary-950 rounded-lg p-6 mb-6 not-prose">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Terminal className="h-5 w-5" />
              <span className="font-medium">Quick Development Setup</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-muted text-sm mb-2">1. Clone and install dependencies:</p>
                <pre className="text-green-400 text-sm bg-secondary-800 rounded p-3 overflow-x-auto">
{`git clone https://github.com/YOUR-USERNAME/cognito-ai-search.git
cd cognito-ai-search
pnpm install`}
                </pre>
              </div>
              
              <div>
                <p className="text-muted text-sm mb-2">2. Set up your environment:</p>
                <pre className="text-blue-400 text-sm bg-secondary-800 rounded p-3 overflow-x-auto">
{`cp .env.example .env.local
# Edit .env.local with your SearXNG and Ollama URLs`}
                </pre>
              </div>
              
              <div>
                <p className="text-muted text-sm mb-2">3. Start development:</p>
                <pre className="text-purple-400 text-sm bg-secondary-800 rounded p-3 overflow-x-auto">
{`pnpm dev          # Start development server
pnpm type-check   # Run TypeScript checks
pnpm build        # Test production build`}
                </pre>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                🐛 Reporting Issues
              </h4>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                Found a bug? Help us fix it by providing detailed information:
              </p>
              <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                <li>• <strong>What happened:</strong> Clear description of the issue</li>
                <li>• <strong>Expected behavior:</strong> What should have happened</li>
                <li>• <strong>Steps to reproduce:</strong> How to trigger the bug</li>
                <li>• <strong>Environment:</strong> OS, Node.js version, browser</li>
                <li>• <strong>Screenshots:</strong> Visual evidence if applicable</li>
                <li>• <strong>Error logs:</strong> Console output or error messages</li>
              </ul>
            </div>

            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
                💡 Feature Requests
              </h4>
              <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                Have an idea to make Cognito AI Search better? We'd love to hear it:
              </p>
              <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                <li>• <strong>Problem:</strong> What issue does this solve?</li>
                <li>• <strong>Solution:</strong> Your proposed approach</li>
                <li>• <strong>Use case:</strong> When would this be useful?</li>
                <li>• <strong>Alternatives:</strong> Other solutions considered</li>
                <li>• <strong>Impact:</strong> Who would benefit from this?</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              🌟 Code Style Guidelines
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">✅ Do:</h5>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Use descriptive variable and function names</li>
                  <li>• Add TypeScript types for all parameters</li>
                  <li>• Include JSDoc comments for complex functions</li>
                  <li>• Follow the existing component structure</li>
                  <li>• Use Tailwind CSS for styling</li>
                  <li>• Handle errors gracefully</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">❌ Avoid:</h5>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Using <code>any</code> types in TypeScript</li>
                  <li>• Hardcoding values that should be configurable</li>
                  <li>• Large, monolithic components</li>
                  <li>• Inline styles instead of Tailwind classes</li>
                  <li>• Console.log statements in production code</li>
                  <li>• Breaking changes without discussion</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="mb-12">
          <SectionHeader
            title="Additional Resources"
            size="lg"
            align="left"
            className="mb-4"
            icon={<BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          />
          
          <div className="grid md:grid-cols-2 gap-6 not-prose">
            <a 
              href="https://github.com/kekePower/cognito-ai-search" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Github className="h-6 w-6 text-secondary dark:text-muted group-hover:text-primary dark:group-hover:text-white" />
                <h3 className="font-semibold">GitHub Repository</h3>
                <ExternalLink className="h-4 w-4 text-muted group-hover:text-secondary dark:group-hover:text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Source code, issues, and latest releases
              </p>
            </a>
            
            <a 
              href="https://docs.searxng.org/" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-6 w-6 text-secondary dark:text-muted group-hover:text-primary dark:group-hover:text-white" />
                <h3 className="font-semibold">SearXNG Documentation</h3>
                <ExternalLink className="h-4 w-4 text-muted group-hover:text-secondary dark:group-hover:text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Official SearXNG setup and configuration guide
              </p>
            </a>
            
            <a 
              href="https://ollama.ai/" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Bot className="h-6 w-6 text-secondary dark:text-muted group-hover:text-primary dark:group-hover:text-white" />
                <h3 className="font-semibold">Ollama</h3>
                <ExternalLink className="h-4 w-4 text-muted group-hover:text-secondary dark:group-hover:text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Local AI model runner and management
              </p>
            </a>
            
            <Link 
              href="/how-it-works"
              className="p-6 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-secondary dark:text-muted group-hover:text-primary dark:group-hover:text-white" />
                <h3 className="font-semibold">How It Works</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Learn about the technology and user experience
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
