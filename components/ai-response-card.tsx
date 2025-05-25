import { AlertTriangle, RefreshCw, Bot, Sparkles } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import 'katex/dist/katex.min.css'

type CodeProps = {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

interface AIResponseCardProps {
  response: string
  isError?: boolean
  isStreaming?: boolean
  onRegenerate?: () => void
}

export default function AIResponseCard({ response, isError = false, isStreaming = false, onRegenerate }: AIResponseCardProps) {
  // Track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode
  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Set up observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Static placeholder text for loading state
  const placeholderText = "I'm generating a thoughtful response to your query. This might take a moment as I process your question and create a comprehensive answer...";

  return (
    <div className="mb-8 p-5 rounded-lg border border-gray-200 dark:border-gray-700 card-bg-primary backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400 relative top-[0.075em]" />
          <span className="text-sm font-medium ml-2 text-gray-900 dark:text-white">AI Response</span>
        </div>
        {!isStreaming && response && (
          <div className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
            AI Analysis
          </div>
        )}
      </div>
      <div className="text-gray-600 dark:text-gray-300">
        {isError ? (
          <div className="text-destructive">
            <div className="flex items-start mb-4">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Error generating AI response</h3>
                <p className="text-sm text-muted-foreground mt-1">{response}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-background/50 rounded-md p-4 text-sm">
              <h4 className="font-medium mb-2">Troubleshooting steps:</h4>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Verify Ollama is running on your server (http://10.0.0.3:11434)</li>
                <li>
                  Check if the model is installed (run:{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">ollama list</code>)
                </li>
                <li>
                  If not installed, run:{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">ollama pull {process.env.NEXT_PUBLIC_DEFAULT_OLLAMA_MODEL || 'qwen3:30b'}</code>
                </li>
                <li>Ensure your network allows connections to the Ollama server</li>
              </ol>
            </div>
          </div>
        ) : isStreaming ? (
          // Enhanced loading animation with typing effect
          <div className="space-y-5">
            {/* Animated typing indicator with spinner */}
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin text-primary">
                <RefreshCw className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">AI is generating...</span>
            </div>
            
            {/* Static loading message with animated cursor */}
            <div className="text-sm text-foreground/80 leading-relaxed mb-4">
              {placeholderText}
              <span className="inline-block h-4 w-1.5 bg-primary ml-0.5 animate-pulse" />
            </div>
            
            {/* Simulated text lines with gradient loading effect */}
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded w-3/4 animate-shimmer" 
                    style={{ backgroundSize: '200% 100%', animationDuration: '1.5s' }} />
                  <div className="h-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded w-full animate-shimmer" 
                    style={{ backgroundSize: '200% 100%', animationDuration: '1.8s' }} />
                  <div className="h-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded w-5/6 animate-shimmer" 
                    style={{ backgroundSize: '200% 100%', animationDuration: '1.6s' }} />
                </div>
              ))}
            </div>
            
            {/* Code block simulation with theme support */}
            <div className={`rounded-md p-3 mt-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
              <div className="space-y-2">
                <div className={`h-3 rounded w-1/2 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                <div className={`h-3 rounded w-3/4 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                <div className={`h-3 rounded w-2/3 animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-foreground dark:text-gray-300">
            {/* Show the markdown content */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // Fix hydration errors by ensuring proper nesting
                p: ({children}) => <div className="my-2">{children}</div>,
                code: ({node, inline, className, children, ...props}: CodeProps) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline ? (
                    <div className="my-4 rounded-md overflow-hidden">
                      <SyntaxHighlighter
                        style={isDarkMode ? oneDark : oneLight}
                        language={match ? match[1] : 'text'}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                      {children}
                    </code>
                  )
                },
                a: ({...props}) => (
                  <a 
                    {...props} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  />
                ),
                h1: ({...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-bold my-3" {...props} />,
                h3: ({...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
                ul: ({...props}) => <ul className="list-disc pl-5 my-3 space-y-1" {...props} />,
                ol: ({...props}) => <ol className="list-decimal pl-5 my-3 space-y-1" {...props} />,
                li: ({...props}) => <li className="my-1" {...props} />,
                blockquote: ({...props}) => <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic" {...props} />
              }}
            >
              {response}
            </ReactMarkdown>
            
            {/* Show pulsing cursor at the end when streaming */}
            {isStreaming && (
              <span className="inline-block h-4 w-2 bg-primary animate-pulse ml-1" />
            )}
          </div>
        )}
      </div>
      {!isStreaming && onRegenerate && (isError || !response || response.length < 50) && (
        <div className="pt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            className="flex items-center gap-1 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <RefreshCw className="h-3 w-3" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
