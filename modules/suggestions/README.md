# Suggestions Module

A comprehensive, self-contained module for managing AI-focused search suggestions in the Cognito AI Search application.

## 📁 Structure

```
modules/suggestions/
├── index.ts                     # Main module exports
├── components/
│   └── search-suggestions.tsx   # UI component with cognito styling
├── hooks/
│   └── use-search-suggestions.ts # State management and logic
├── data/
│   └── search-suggestions.ts    # 200 AI-focused suggestions data
└── README.md                    # This documentation
```

## 🚀 Usage

### Quick Import (Recommended)
```tsx
import { SearchSuggestions, useSearchSuggestions } from '@/modules/suggestions'
```

### Individual Imports
```tsx
import { SearchSuggestions } from '@/modules/suggestions/components/search-suggestions'
import { useSearchSuggestions } from '@/modules/suggestions/hooks/use-search-suggestions'
import { getRandomSuggestions } from '@/modules/suggestions/data/search-suggestions'
```

## 🎯 Components

### SearchSuggestions
Interactive UI component that displays AI-focused search suggestions with cognito styling.

**Props:**
- `onSuggestionClick: (suggestion: string) => void` - Callback when user clicks a suggestion

**Features:**
- ✨ 6 suggestions displayed at once
- 🔄 Refresh button with cognito animations
- 💎 Angular clipped suggestion cards
- 🌟 Hover effects with glint animations
- 📱 Responsive design
- ⚡ Skeleton loading states

```tsx
<SearchSuggestions 
  onSuggestionClick={(suggestion) => handleSearch(suggestion)} 
/>
```

## 🎣 Hooks

### useSearchSuggestions
React hook for managing suggestions state and functionality.

**Options:**
```tsx
interface UseSearchSuggestionsOptions {
  count?: number          // Number of suggestions (default: 4)
  refreshOnMount?: boolean // Auto-refresh on mount (default: true)
}
```

**Returns:**
```tsx
interface UseSearchSuggestionsReturn {
  suggestions: string[]           // Current suggestions array
  refreshSuggestions: () => void  // Function to get new suggestions
  isLoading: boolean             // Loading state
}
```

**Example:**
```tsx
const { suggestions, refreshSuggestions, isLoading } = useSearchSuggestions({
  count: 6,
  refreshOnMount: true
})
```

## 📊 Data

### Search Suggestions
200 carefully curated AI-focused search suggestions organized into 16 categories:

1. **AI Fundamentals & Theory** - Core concepts and theory
2. **Fine-tuning & Model Training** - Training techniques
3. **Open Source LLMs** - Model comparisons and guides
4. **GPUs, CPUs & Hardware** - Hardware for AI
5. **Performance Optimizations** - Speed and efficiency
6. **Math for AI** - Mathematical foundations
7. **Python for AI** - Programming tools and libraries
8. **AI Servers & Frameworks** - Deployment platforms
9. **AI Research & Papers** - Latest research
10. **AGI & ASI Concepts** - Advanced AI concepts
11. **Creative AI & Coding** - Creative applications
12. **LLM Testing & Evaluation** - Quality assessment
13. **Prompt Engineering** - Prompt optimization
14. **LLM Training Deep Dive** - Advanced training
15. **LLM Inference Optimization** - Production deployment
16. **Emerging AI Trends** - Future technologies

### getRandomSuggestions()
Utility function that returns a random subset of suggestions using Fisher-Yates shuffle.

```tsx
const suggestions = getRandomSuggestions(6) // Returns 6 random suggestions
```

## 🎨 Styling

The module uses the application's design system:
- **Glass morphism effects** with `glass-panel` class
- **Cognito styling** with angular clip paths
- **Primary color theming** with CSS variables
- **Smooth animations** and hover effects
- **Responsive design** for all screen sizes

## 🔧 Technical Features

- **SSR/Hydration Safe** - Proper client-side rendering
- **Performance Optimized** - Efficient re-renders with useCallback
- **Error Handling** - Graceful fallbacks for failed operations
- **TypeScript** - Full type safety throughout
- **Accessibility** - Keyboard navigation and screen reader support

## 🚀 Migration Guide

To migrate from the old structure:

1. **Update imports** in `search-container.tsx`:
   ```tsx
   // Old
   import { SearchSuggestions } from '@/components/search/search-suggestions'
   
   // New
   import { SearchSuggestions } from '@/modules/suggestions'
   ```

2. **Remove old files** (after testing):
   - `/components/search/search-suggestions.tsx`
   - `/hooks/use-search-suggestions.ts`
   - `/lib/search-suggestions.ts`

## 📈 Benefits

- **🎯 Single Responsibility** - Focused module for suggestions only
- **📦 Self-Contained** - All related code in one place
- **🔄 Reusable** - Easy to use in other parts of the application
- **🧪 Testable** - Isolated functionality for easier testing
- **📚 Documented** - Clear structure and usage examples
- **🚀 Maintainable** - Organized codebase with clear boundaries
