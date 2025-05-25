"use client"

import Link from "next/link"
import { ArrowLeft, Download, Settings, Zap, Shield, BookOpen, Github, ExternalLink, Terminal, Globe, Bot, Database, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import packageJson from "../../package.json"

export function DocumentationContent() {
  return (
    <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">
          Documentation
        </h1>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
            v{packageJson.version}
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
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
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            What's New in v{packageJson.version}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">🎨 Complete UI/UX Redesign</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• Modern interface with gradient animations</li>
                <li>• Dark/light theme support</li>
                <li>• Polished interactions and transitions</li>
                <li>• Pixel-perfect icon and text alignment</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">🚀 Enhanced Performance</h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• Smart caching and request deduplication</li>
                <li>• Optimized search flow</li>
                <li>• Faster response times</li>
                <li>• Improved error handling</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">🔍 Intelligent Search</h3>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <li>• AI-powered query optimization</li>
                <li>• 200+ curated search suggestions</li>
                <li>• Smart search result processing</li>
                <li>• Enhanced relevance scoring</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold mb-3 text-orange-900 dark:text-orange-100">🛠️ Robust Architecture</h3>
              <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                <li>• Modular component architecture</li>
                <li>• Custom React hooks</li>
                <li>• TypeScript throughout</li>
                <li>• Comprehensive error boundaries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="mb-12" id="getting-started">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            Getting Started
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-semibold mb-4">Prerequisites</h3>
            <ul className="space-y-2">
              <li>• <strong>Node.js 18+</strong> and npm/yarn/pnpm</li>
              <li>• <strong>SearXNG instance</strong> (self-hosted or public URL)</li>
              <li>• <strong>Ollama</strong> installed with desired AI models</li>
              <li>• <strong>Redis</strong> (optional, recommended for caching)</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold mb-4">Quick Installation</h3>
          
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 not-prose">
            <div className="flex items-center gap-2 mb-3 text-gray-300">
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

        {/* Configuration Section */}
        <section className="mb-12" id="configuration">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Configuration
          </h2>

          <h3 className="text-lg font-semibold mb-4">Environment Variables</h3>
          
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 mb-6 not-prose">
            <div className="flex items-center gap-2 mb-3 text-gray-300">
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
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2">🏠 Home Server</h4>
              <p className="text-sm text-muted-foreground">Run on a spare computer or NAS device</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2">☁️ VPS/Cloud</h4>
              <p className="text-sm text-muted-foreground">Deploy on any Linux server or cloud provider</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2">🥧 Raspberry Pi</h4>
              <p className="text-sm text-muted-foreground">Works great on Pi 4 with 8GB RAM</p>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mb-12" id="architecture">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Database className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            Architecture Overview
          </h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
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
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Github className="h-6 w-6 text-green-600 dark:text-green-400" />
            Contributing
          </h2>
          
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
          
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 mb-6 not-prose">
            <div className="flex items-center gap-2 mb-4 text-gray-300">
              <Terminal className="h-5 w-5" />
              <span className="font-medium">Quick Development Setup</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">1. Clone and install dependencies:</p>
                <pre className="text-green-400 text-sm bg-gray-800 rounded p-3 overflow-x-auto">
{`git clone https://github.com/YOUR-USERNAME/cognito-ai-search.git
cd cognito-ai-search
pnpm install`}
                </pre>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">2. Set up your environment:</p>
                <pre className="text-blue-400 text-sm bg-gray-800 rounded p-3 overflow-x-auto">
{`cp .env.example .env.local
# Edit .env.local with your SearXNG and Ollama URLs`}
                </pre>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">3. Start development:</p>
                <pre className="text-purple-400 text-sm bg-gray-800 rounded p-3 overflow-x-auto">
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
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Additional Resources
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 not-prose">
            <a 
              href="https://github.com/kekePower/cognito-ai-search" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Github className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <h3 className="font-semibold">GitHub Repository</h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                Source code, issues, and latest releases
              </p>
            </a>
            
            <a 
              href="https://docs.searxng.org/" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <h3 className="font-semibold">SearXNG Documentation</h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                Official SearXNG setup and configuration guide
              </p>
            </a>
            
            <a 
              href="https://ollama.ai/" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Bot className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <h3 className="font-semibold">Ollama</h3>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
              <p className="text-sm text-muted-foreground">
                Local AI model runner and management
              </p>
            </a>
            
            <Link 
              href="/how-it-works"
              className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
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
