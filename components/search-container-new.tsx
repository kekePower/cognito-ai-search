import React, { useState, useCallback, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SearchResult {
  title: string;
  link: string;
  description: string;
}

interface AIResponseCardProps {
  response: string;
  isError: boolean;
  isStreaming: boolean;
  onRegenerate?: () => void;
}

const AIResponseCard: React.FC<AIResponseCardProps> = ({ response, isError, isStreaming, onRegenerate }) => {
  return (
    <Card 
      className="dark:bg-card border rounded-lg" 
    >
      <CardHeader>
        <CardTitle>AI Response</CardTitle>
        <CardDescription>Here's what the AI found:</CardDescription>
      </CardHeader>
      <CardContent>
        {isStreaming ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ) : (
          <p className={isError ? "text-red-500" : ""}>{response || "No response available."}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {onRegenerate && !isStreaming && (
          <Button onClick={onRegenerate}>Regenerate</Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div>
      {results.map((result, index) => (
        <Card key={index} className="mb-4 dark:bg-card border rounded-lg">
          <CardHeader>
            <CardTitle>
              <a href={result.link} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{result.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


interface SearchContainerNewProps {
  initialQuery?: string;
}

const SearchContainerNew: React.FC<SearchContainerNewProps> = ({ initialQuery }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery || '');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialQuery) {
      // Optionally, trigger a search automatically if initialQuery is present
      // handleSearch(); 
    }
  }, [initialQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const performSearch = useCallback(async (term: string) => {
    setIsLoading(true);
    setSearchResults([]); // Clear previous results
    setAiResponse(null); // Clear previous AI response

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock search results
    const mockResults: SearchResult[] = [
      { title: `Result 1 for ${term}`, link: 'https://example.com/result1', description: 'This is a description for result 1.' },
      { title: `Result 2 for ${term}`, link: 'https://example.com/result2', description: 'This is a description for result 2.' },
      { title: `Result 3 for ${term}`, link: 'https://example.com/result3', description: 'This is a description for result 3.' },
    ];

    setSearchResults(mockResults);
    setIsLoading(false);
  }, []);

  const optimizeSearchQuery = useCallback(async (query: string) => {
    setIsOptimizing(true);
    setAiResponse(null); // Clear previous AI response
    setSearchResults([]); // Clear previous search results

    // Simulate optimization delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI-optimized query
    const optimizedQuery = `AI Optimized: ${query}`;
    setSearchTerm(optimizedQuery);

    setIsOptimizing(false);
    return optimizedQuery;
  }, []);

  const generateAIResponse = useCallback(async (query: string) => {
    setIsAiLoading(true);
    setAiResponse(null);

    // Simulate AI response generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI response
    const mockAIResponse = `AI response for: ${query}. This is a detailed explanation.`;
    setAiResponse(mockAIResponse);
    setIsAiLoading(false);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search term.",
      });
      return;
    }

    try {
      const optimizedQuery = await optimizeSearchQuery(searchTerm);
      await performSearch(optimizedQuery);
      await generateAIResponse(optimizedQuery);

    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: error.message || "An error occurred during the search.",
        variant: "destructive",
      });
    }
  }, [searchTerm, toast, optimizeSearchQuery, performSearch, generateAIResponse]);

  const regenerateResponse = useCallback(async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search term.",
      });
      return;
    }

    try {
      await generateAIResponse(searchTerm);
    } catch (error: any) {
      console.error("AI Regeneration error:", error);
       toast({
        title: "AI Regeneration Error",
        description: error.message || "An error occurred during AI regeneration.",
        variant: "destructive",
      });
    }
  }, [searchTerm, toast, generateAIResponse]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Application</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <Button onClick={handleSearch} disabled={isLoading || isOptimizing}>
          {isLoading || isOptimizing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              Search <Search className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Search Results and AI Response Section */}
      {(isOptimizing || isLoading || searchResults.length > 0 || isAiLoading || aiResponse) && (
        <div className="mt-8 space-y-6">
          {/* AI Response Section - Always show when search is active */}
          {(isOptimizing || isAiLoading || aiResponse) && (
            <div className="transition-all duration-300 ease-in-out">
              {isOptimizing ? (
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <RefreshCw className="h-5 w-5 text-primary/70 animate-spin" />
                    <h3 className="text-lg font-semibold">Optimizing your search query with AI...</h3>
                  </div>
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ) : isAiLoading ? (
                <AIResponseCard 
                  response="" 
                  isError={false} 
                  isStreaming={true} 
                />
              ) : aiResponse ? (
                <AIResponseCard 
                  response={aiResponse} 
                  isError={false} 
                  isStreaming={false} 
                  onRegenerate={regenerateResponse} 
                />
              ) : null}
            </div>
          )}

          {/* Search Results Section */}
          {isLoading && !isOptimizing ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <SearchResults results={searchResults} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchContainerNew;