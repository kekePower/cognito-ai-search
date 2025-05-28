import { AlertTriangle, RefreshCw, Bot, Sparkles, Zap, Diamond, Download, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { MarkdownRenderer } from "@/lib/markdown-renderer"

interface AIResponseCardProps {
  response: string;
  isError?: boolean;
  isAiLoading?: boolean; // Renamed from isStreaming
  isOptimizing?: boolean;
  optimizedQuery?: string;
  onRegenerate?: () => void;
}

export default function AIResponseCard({
  response,
  isError = false,
  isAiLoading = false, // Renamed from isStreaming
  isOptimizing = false,
  optimizedQuery,
  onRegenerate,
}: AIResponseCardProps) {
  // Track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
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

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Download as PDF function using dedicated module
  const downloadAsPDF = async () => {
    try {
      console.log('[AIResponseCard] Attempting to download PDF for response:', response.substring(0, 100) + '...');
      // Dynamic import to reduce bundle size
      const { generateMarkdownPDF } = await import('@/lib/pdf-generator');
      
      await generateMarkdownPDF(response, {
        headerText: 'Cognito AI Search - Analysis Report',
        includeTimestamp: true
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  // Static placeholder text for loading state
  const placeholderText = "I'm generating a thoughtful response to your query. This might take a moment as I process your question and create a comprehensive answer...";

  return (
    <div className="glass-panel-solid rounded-lg p-6 relative overflow-hidden" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
      {/* Decorative holographic lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      {/* Header with AI badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Diamond className="h-5 w-5 text-primary" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
          </div>
          <h2 className="text-lg font-semibold text-primary">AI Response</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass-panel px-3 py-1 text-xs text-primary border border-primary/30 rounded-md">
            <Sparkles className="h-3 w-3 inline mr-1" />
            Cognito AI
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative">
        {isAiLoading ? (
          <div className="space-y-4">
            {/* Streaming header */}
            <div className="flex items-center gap-3 text-primary">
              <div className="relative">
                <Bot className="h-5 w-5" />
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm animate-pulse"></div>
              </div>
              <span className="text-sm font-medium">
                  {isOptimizing && !optimizedQuery
                    ? "Optimizing search query..."
                    : isOptimizing && optimizedQuery
                    ? `Search optimized to: "${optimizedQuery}". Generating summary...`
                    : "Generating summary..."}
                </span>
            </div>
            
            {/* Animated loading bars */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden">
                  <div className="h-4 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded shimmer" 
                    style={{ animationDelay: `${i * 0.2}s` }} />
                </div>
              ))}
            </div>
            
            {/* Placeholder content */}
            <div className="glass-panel rounded-lg p-4 mt-4 border border-primary/20">
              <div className="space-y-2">
                <div className="h-3 rounded w-1/2 bg-primary/20 shimmer" />
                <div className="h-3 rounded w-3/4 bg-primary/15 shimmer" />
                <div className="h-3 rounded w-2/3 bg-primary/10 shimmer" />
              </div>
            </div>
          </div>
        ) : isError ? (
          <div className="glass-panel rounded-lg p-6 border border-destructive/30">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-destructive font-medium">Error generating response</p>
            </div>
            <p className="text-muted">{response || "Please try again or refine your search query."}</p>
          </div>
        ) : (
          <div className="relative">
            <MarkdownRenderer content={response} />
            
            {/* Show pulsing cursor at the end when AI is loading */}
            {isAiLoading && (
              <span className="inline-block h-4 w-2 bg-primary animate-pulse ml-1 rounded-sm" />
            )}
          </div>
        )}
      </div>
      
      {/* Action buttons - always show for successful responses */}
      {!isAiLoading && response && !isError && response.length > 50 && (
        <div className="pt-6 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="glass-panel text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 rounded-md"
          >
            {copiedToClipboard ? (
              <>
                <Check className="h-3 w-3 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-2" />
                Copy
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadAsPDF}
            className="glass-panel text-success hover:text-success/80 dark:text-success dark:hover:text-success/80 border-success/30 hover:border-success/50 transition-all duration-300 hover:scale-105 rounded-md"
          >
            <Download className="h-3 w-3 mr-2" />
            PDF
          </Button>
        </div>
      )}

      {/* Regenerate button - only show for errors or short responses */}
      {!isAiLoading && onRegenerate && (isError || !response || response.length < 50) && (
        <div className="pt-6 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            className="glass-panel text-accent hover:text-accent/80 dark:text-accent dark:hover:text-accent/80 border-accent/30 hover:border-accent/50 transition-all duration-300 hover:scale-105 rounded-md"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Regenerate
          </Button>
        </div>
      )}
    </div>
  )
}
