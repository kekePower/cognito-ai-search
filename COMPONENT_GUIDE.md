# Reusable UI Components Guide

This guide documents the abstracted reusable UI components created to improve code maintainability and reduce duplication across the Cognito AI Search application.

## Components Overview

### 1. IconButton

A flexible button component that combines icons with text, supporting different positions and gaps.

```tsx
import { IconButton } from "@/components/ui/icon-button"
import { Search, Plus } from "lucide-react"

// Basic usage
<IconButton icon={<Search />}>Search</IconButton>

// Right-positioned icon with custom gap
<IconButton 
  icon={<Plus />} 
  iconPosition="right" 
  gap="3"
  variant="outline"
>
  Add New
</IconButton>
```

**Props:**
- `icon`: React.ReactNode - The icon to display
- `iconPosition`: "left" | "right" (default: "left")
- `gap`: "1" | "2" | "3" | "4" (default: "2")
- Extends all Button props

### 2. BackButton

A specialized navigation button for going back to previous pages.

```tsx
import { BackButton } from "@/components/ui/back-button"

// Basic usage
<BackButton href="/search" />

// Custom text
<BackButton href="/dashboard">
  Back to Dashboard
</BackButton>
```

**Props:**
- `href`: string - The destination URL
- `children`: React.ReactNode (default: "Back to Search")
- Extends IconButton props

### 3. GlassPanel

A glass-morphism panel component with configurable transparency and blur effects.

```tsx
import { GlassPanel } from "@/components/ui/glass-panel"

// Default glass effect
<GlassPanel>
  <p>Content with glass background</p>
</GlassPanel>

// Strong variant with large blur
<GlassPanel variant="strong" blur="lg">
  <p>More prominent glass effect</p>
</GlassPanel>
```

**Props:**
- `variant`: "default" | "subtle" | "strong" (default: "default")
- `blur`: "sm" | "md" | "lg" (default: "md")
- Extends HTML div props

### 4. LoadingCard

A skeleton loading state for card-based content.

```tsx
import { LoadingCard } from "@/components/ui/loading-card"

// Basic loading card
<LoadingCard />

// Custom configuration
<LoadingCard 
  showHeader={true}
  showFooter={true}
  contentLines={5}
  headerHeight="lg"
/>
```

**Props:**
- `showHeader`: boolean (default: true)
- `showFooter`: boolean (default: false)
- `headerHeight`: "sm" | "md" | "lg" (default: "md")
- `contentLines`: number (default: 3)
- `footerHeight`: "sm" | "md" | "lg" (default: "sm")

### 5. SectionHeader

A flexible header component for sections with optional icons and actions.

```tsx
import { SectionHeader } from "@/components/ui/section-header"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

// Basic header
<SectionHeader title="Search Results" />

// Full-featured header
<SectionHeader
  title="Search Results"
  subtitle="Found 42 results for your query"
  icon={<Search className="h-6 w-6" />}
  size="lg"
  action={
    <Button variant="outline" size="sm">
      <Filter className="h-4 w-4 mr-2" />
      Filter
    </Button>
  }
/>
```

**Props:**
- `title`: string - The main title
- `subtitle`: string (optional) - Secondary text
- `icon`: React.ReactNode (optional) - Leading icon
- `action`: React.ReactNode (optional) - Action element (button, etc.)
- `size`: "sm" | "md" | "lg" | "xl" (default: "md")
- `align`: "left" | "center" | "right" (default: "left")

### 6. EmptyState

A component for displaying empty states with optional icons and actions.

```tsx
import { EmptyState } from "@/components/ui/empty-state"
import { Search } from "lucide-react"

// Basic empty state
<EmptyState 
  title="No results found"
  description="Try adjusting your search terms"
/>

// With icon and action
<EmptyState
  icon={<Search />}
  title="No search results"
  description="We couldn't find anything matching your search. Try different keywords."
  action={{
    label: "Clear search",
    onClick: () => clearSearch(),
    variant: "outline"
  }}
  size="lg"
/>
```

**Props:**
- `title`: string - The main message
- `description`: string (optional) - Additional context
- `icon`: React.ReactNode (optional) - Illustrative icon
- `action`: object (optional) - Call-to-action button
- `size`: "sm" | "md" | "lg" (default: "md")

### 7. IconText

A flexible component for combining icons with text in various layouts.

```tsx
import { IconText } from "@/components/ui/icon-text"
import { User, Calendar } from "lucide-react"

// Horizontal layout
<IconText icon={<User />} gap="2">
  John Doe
</IconText>

// Vertical layout
<IconText 
  icon={<Calendar />} 
  iconPosition="top" 
  align="center"
  iconSize="lg"
>
  <h3>Event Date</h3>
  <p>March 15, 2024</p>
</IconText>
```

**Props:**
- `icon`: React.ReactNode - The icon to display
- `iconPosition`: "left" | "right" | "top" (default: "left")
- `gap`: "1" | "2" | "3" | "4" (default: "2")
- `align`: "start" | "center" | "end" (default: "center")
- `iconSize`: "sm" | "md" | "lg" (default: "md")

### 8. LoadingSpinner

A versatile loading spinner with text and overlay options.

```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Basic spinner
<LoadingSpinner />

// With text
<LoadingSpinner text="Loading results..." size="lg" />

// Full-screen overlay
<LoadingSpinner 
  text="Processing your request..." 
  overlay={true} 
/>
```

**Props:**
- `size`: "sm" | "md" | "lg" | "xl" (default: "md")
- `text`: string (optional) - Loading message
- `centered`: boolean (default: true) - Center the spinner
- `overlay`: boolean (default: false) - Full-screen overlay

### 9. ErrorBoundary

A React error boundary component with customizable fallback UI.

```tsx
import { ErrorBoundary } from "@/components/ui/error-boundary"

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom error handler
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Error caught:', error)
    // Send to error reporting service
  }}
>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={({ error, retry }) => (
    <div>
      <h2>Oops! Something went wrong</h2>
      <p>{error?.message}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children`: React.ReactNode - Components to wrap
- `fallback`: React.ComponentType (optional) - Custom error UI
- `onError`: function (optional) - Error event handler

## Migration Guide

### Replacing Common Patterns

#### Before (Repetitive):
```tsx
// Multiple instances of this pattern throughout the codebase
<div className="flex items-center gap-2">
  <ArrowLeft className="h-4 w-4" />
  <span>Back to Search</span>
</div>
```

#### After (Reusable):
```tsx
<BackButton href="/search" />
```

#### Before (Complex Empty State):
```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-muted p-3">
    <Search className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="mt-4 text-lg font-semibold">No results found</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    Try adjusting your search terms
  </p>
</div>
```

#### After (Clean):
```tsx
<EmptyState
  icon={<Search />}
  title="No results found"
  description="Try adjusting your search terms"
/>
```

## Benefits

1. **Consistency**: Standardized UI patterns across the application
2. **Maintainability**: Changes to common patterns only need to be made in one place
3. **Performance**: Reduced bundle size through component reuse
4. **Developer Experience**: Faster development with pre-built, tested components
5. **Accessibility**: Built-in accessibility features in reusable components

## Best Practices

1. **Import from index**: Use `import { ComponentName } from "@/components/ui"` for cleaner imports
2. **Extend thoughtfully**: Only add props that provide genuine flexibility
3. **Document usage**: Include examples in component docstrings
4. **Test thoroughly**: Ensure components work in various contexts
5. **Version control**: Track breaking changes to component APIs

## Component Testing

Each component includes comprehensive TypeScript types and follows React best practices. Test your components in different contexts to ensure they work as expected:

```tsx
import { render, screen } from '@testing-library/react'
import { IconButton } from '@/components/ui'
import { Search } from 'lucide-react'

test('renders icon button with correct text', () => {
  render(
    <IconButton icon={<Search />}>
      Search
    </IconButton>
  )
  
  expect(screen.getByText('Search')).toBeInTheDocument()
})
```

This component library provides a solid foundation for consistent, maintainable UI development in the Cognito AI Search application.
