import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

type CodeProps = {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

interface AIResponseCardProps {
  response: string
  isError?: boolean
}

export default function AIResponseCard({ response, isError = false }: AIResponseCardProps) {

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5 shadow-md">
      <CardHeader className="pb-2 border-b border-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16.5V14m0-4V8.5M12 4a1 1 0 110 2 1 1 0 010-2zm0 14a1 1 0 110 2 1 1 0 010-2zm7-7a1 1 0 110 2 1 1 0 010-2zM5 11a1 1 0 110 2 1 1 0 010-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8z" />
          </svg>
          AI Response
          {isError && <AlertTriangle className="h-4 w-4 text-amber-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className={`prose dark:prose-invert max-w-none pt-4 ${isError ? 'text-amber-600 dark:text-amber-400' : ''}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({
              node,
              inline,
              className,
              children,
              ...props
            }: CodeProps) => {
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
            a: ({
              node,
              ...props
            }: {
              node?: any
              href?: string
              children?: React.ReactNode
            }) => (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              />
            ),
            // Add more custom components as needed
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-2" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse my-4" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />
            ),
          }}
        >
          {response}
        </ReactMarkdown>
        {isError && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 prose dark:prose-invert max-w-none">
            <p>Troubleshooting steps:</p>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Verify Ollama is running on your server (http://10.0.0.3:11434)</li>
              <li>
                Check if the cogito:14b model is installed (run:{" "}
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">ollama list</code>)
              </li>
              <li>
                If not installed, run:{" "}
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">ollama pull cogito:14b</code>
              </li>
              <li>Ensure your network allows connections to the Ollama server</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
