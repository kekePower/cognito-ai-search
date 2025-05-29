import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import 'katex/dist/katex.min.css';

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface MarkdownRendererProps {
  content: string;
  isDarkMode?: boolean;
  className?: string;
}

/**
 * Custom code component for syntax highlighting
 */
const CodeComponent = ({ node, inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return !inline && match ? (
    <SyntaxHighlighter
      style={isDarkMode ? oneDark : oneLight}
      language={match[1]}
      PreTag="div"
      className="rounded-lg !bg-transparent border border-border/20"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code 
      className={`${className} px-1.5 py-0.5 rounded bg-muted/50 text-sm font-mono border border-border/20`} 
      {...props}
    >
      {children}
    </code>
  );
};

/**
 * Markdown renderer component with enhanced styling and plugins
 */
export function MarkdownRenderer({ content, isDarkMode = false, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, errorColor: '#FF5733' }]]}
        components={{
          code: CodeComponent,
          // Enhanced heading styles
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-blue))] bg-clip-text text-transparent
                         drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]
                         dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]
                         light:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 mt-5 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-blue))] bg-clip-text text-transparent
                         drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]
                         dark:drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]
                         light:drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 mt-4 bg-gradient-to-r from-[hsl(var(--neon-cyan))] via-[hsl(var(--neon-magenta))] to-[hsl(var(--neon-blue))] bg-clip-text text-transparent
                         drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]
                         dark:drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]
                         light:drop-shadow-[0_0_4px_rgba(168,85,247,0.3)]">
              {children}
            </h3>
          ),
          // Enhanced list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-4 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/90 leading-relaxed">
              {children}
            </li>
          ),
          // Enhanced paragraph styles
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground/90">
              {children}
            </p>
          ),
          // Enhanced blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-2 mb-4 bg-muted/20 rounded-r-lg italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          // Enhanced table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border/20 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold border-b border-border/20">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-border/10">
              {children}
            </td>
          ),
          // Enhanced link styles
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          // Enhanced horizontal rule
          hr: () => (
            <hr className="my-6 border-border/30" />
          ),
          // Enhanced strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          // Enhanced emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-foreground/90">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Hook to get markdown renderer with current theme
 */
export function useMarkdownRenderer() {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return {
    MarkdownRenderer: ({ content, className }: Omit<MarkdownRendererProps, 'isDarkMode'>) => (
      <MarkdownRenderer content={content} isDarkMode={isDarkMode} className={className} />
    ),
    isDarkMode,
  };
}

/**
 * Default markdown styles for consistent theming
 */
export const markdownStyles = {
  container: "prose prose-sm max-w-none dark:prose-invert",
  heading: "scroll-m-20 tracking-tight",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  pre: "mb-4 mt-6 overflow-x-auto rounded-lg border bg-zinc-950 py-4",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  table: "w-full border-collapse border border-border",
  th: "border border-border px-4 py-2 text-left font-bold",
  td: "border border-border px-4 py-2",
} as const;
