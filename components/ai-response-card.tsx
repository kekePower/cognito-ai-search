import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

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
  // For typing effect animation
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const placeholderText = "I'm generating a thoughtful response to your query. This might take a moment as I process your question and create a comprehensive answer...";
  
  // Typing effect animation
  useEffect(() => {
    if (!isStreaming || response || isError) return;
    
    const interval = setInterval(() => {
      if (typingIndex < placeholderText.length) {
        setTypingText(prev => prev + placeholderText[typingIndex]);
        setTypingIndex(prev => prev + 1);
      } else {
        // Reset to create a loop effect
        setTypingText("");
        setTypingIndex(0);
      }
    }, 50); // Speed of typing
    
    return () => clearInterval(interval);
  }, [isStreaming, response, isError, typingIndex, placeholderText]);
  return (
    <Card className="mb-8 border-primary/20 bg-primary/5 shadow-md">
      <CardHeader className="pb-2 border-b border-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary-foreground">
          AI Response
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
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
        ) : isStreaming && !response ? (
          // Enhanced loading animation with typing effect
          <div className="space-y-5">
            {/* Animated typing indicator */}
            <div className="flex items-center gap-1 mb-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-muted-foreground">AI is generating...</span>
            </div>
            
            {/* Typing effect animation */}
            {typingText && (
              <div className="text-sm text-foreground/80 leading-relaxed mb-4">
                {typingText}
                <span className="inline-block h-4 w-1.5 bg-primary ml-0.5 animate-pulse" />
              </div>
            )}
            
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
            
            {/* Code block simulation */}
            <div className="bg-gray-800 rounded-md p-3 mt-4">
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Show the markdown content */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: CodeProps) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline ? (
                    <div className="my-4 rounded-md overflow-hidden">
                      <SyntaxHighlighter
                        style={oneDark}
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
                a({node, ...props}) {
                  return (
                    <a 
                      {...props} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    />
                  )
                },
                h1({node, ...props}) {
                  return <h1 className="text-3xl font-bold my-4" {...props} />
                },
                h2({node, ...props}) {
                  return <h2 className="text-2xl font-bold my-3" {...props} />
                },
                h3({node, ...props}) {
                  return <h3 className="text-xl font-bold my-2" {...props} />
                },
                ul({node, ...props}) {
                  return <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
                },
                ol({node, ...props}) {
                  return <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
                }
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
      </CardContent>
      {!isStreaming && onRegenerate && (isError || !response || response.length < 50) && (
        <CardFooter className="pt-0 pb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            className="ml-auto flex items-center gap-1 text-xs"
          >
            <RefreshCw className="h-3 w-3" />
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
