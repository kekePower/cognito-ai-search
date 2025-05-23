import { NextResponse } from 'next/server';

// Helper function to extract hostname for 'source'
function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return '';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, bypassCache } = body; // bypassCache is not used in this version but kept for compatibility

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log(`API: Received search query: "${query}", Bypass cache: ${bypassCache}`);

    const searxngUrl = process.env.SEARXNG_API_URL;
    const ollamaUrl = process.env.OLLAMA_API_URL;
    const ollamaModel = process.env.DEFAULT_OLLAMA_MODEL;
    const ollamaMaxTokens = parseInt(process.env.AI_RESPONSE_MAX_TOKENS || '1200', 10);

    if (!searxngUrl || !ollamaUrl || !ollamaModel) {
      console.error('Missing environment variables for SearXNG or Ollama');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let searchResults: any[] = [];
    let aiResponse: string = '';

    // 1. Fetch results from SearXNG
    try {
      const searxngQueryUrl = `${searxngUrl}/?q=${encodeURIComponent(query)}&format=json&categories=general`;
      console.log(`API: Fetching SearXNG results from: ${searxngQueryUrl}`);
      const searxngResponse = await fetch(searxngQueryUrl, { cache: bypassCache ? 'no-store' : 'default' });
      
      if (!searxngResponse.ok) {
        const errorText = await searxngResponse.text();
        console.error(`SearXNG request failed: ${searxngResponse.status}`, errorText);
        // Don't throw here, try to proceed with AI if search fails
      } else {
        const searxngData = await searxngResponse.json();
        searchResults = (searxngData.results || []).map((result: any) => ({
          title: result.title || 'No title',
          link: result.url || '#',
          snippet: result.content || 'No snippet available.',
          source: getHostname(result.url || ''),
          favicon: '/favicon.ico', // Placeholder favicon
        }));
        console.log(`API: Fetched ${searchResults.length} results from SearXNG`);
      }
    } catch (e) {
      console.error('Error fetching or processing SearXNG results:', e);
      // Continue to AI part even if search fails
    }

    // 2. Generate AI response from Ollama
    try {
      // Simple prompt, can be enhanced with searchResults for context later
      const prompt = `User query: "${query}"

Based on this query, provide a concise and helpful answer.`;
      
      console.log(`API: Sending prompt to Ollama model ${ollamaModel}`);
      const ollamaApiResponse = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: prompt,
          stream: false,
          options: {
            num_predict: ollamaMaxTokens,
          },
        }),
      });

      if (!ollamaApiResponse.ok) {
        const errorText = await ollamaApiResponse.text();
        console.error(`Ollama request failed: ${ollamaApiResponse.status}`, errorText);
        aiResponse = 'Error generating AI response.';
      } else {
        const ollamaData = await ollamaApiResponse.json();
        aiResponse = ollamaData.response || 'No AI response generated.';
        console.log('API: Received AI response from Ollama.');
      }
    } catch (e) {
      console.error('Error fetching or processing Ollama response:', e);
      aiResponse = 'Error connecting to AI model.';
    }

    return NextResponse.json({
      aiResponse,
      searchResults,
    });

  } catch (error) {
    console.error('API Search Error (Outer Catch):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
