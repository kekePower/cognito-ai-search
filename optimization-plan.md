# Next.js Codebase Optimization Plan

## Executive Summary

This document outlines optimization opportunities identified in the Next.js 15.3.2 codebase for the Cognito AI Search application. The analysis reveals significant opportunities for code cleanup, dependency reduction, and performance improvements.

## Findings Overview

### 🔍 **Analysis Scope**
- **Project Type**: Next.js 15.3.2 application with AI-powered search functionality
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Total Dependencies**: 50+ packages analyzed

---

## 🗂️ Unused UI Components

### **High Priority - Complete Removal Candidates**

The following UI components exist in `/components/ui/` but are **never imported** anywhere in the codebase:

1. **Accordion** (`accordion.tsx`) - 58 lines
2. **Alert Dialog** (`alert-dialog.tsx`) - 141 lines  
3. **Alert** (`alert.tsx`) - 59 lines
4. **Aspect Ratio** (`aspect-ratio.tsx`) - ~30 lines
5. **Avatar** (`avatar.tsx`) - 50 lines
6. **Breadcrumb** (`breadcrumb.tsx`) - 56 lines
7. **Calendar** (`calendar.tsx`) - ~100 lines
8. **Chart** (`chart.tsx`) - ~200 lines
9. **Checkbox** (`checkbox.tsx`) - 30 lines
10. **Collapsible** (`collapsible.tsx`) - 11 lines
11. **Context Menu** (`context-menu.tsx`) - 40 lines
12. **Drawer** (`drawer.tsx`) - 118 lines
13. **Dropdown Menu** (`dropdown-menu.tsx`) - 41 lines
14. **Form** (`form.tsx`) - Complex form handling
15. **Hover Card** (`hover-card.tsx`) - 29 lines
16. **Input OTP** (`input-otp.tsx`) - 71 lines
17. **Menubar** (`menubar.tsx`) - 47 lines
18. **Navigation Menu** (`navigation-menu.tsx`) - 128 lines
19. **Pagination** (`pagination.tsx`) - Complex pagination
20. **Popover** (`popover.tsx`) - 31 lines
21. **Progress** (`progress.tsx`) - Progress bars
22. **Radio Group** (`radio-group.tsx`) - 44 lines
23. **Resizable** (`resizable.tsx`) - Panel resizing
24. **Scroll Area** (`scroll-area.tsx`) - Custom scrollbars
25. **Select** (`select.tsx`) - 160 lines
26. **Slider** (`slider.tsx`) - Range sliders
27. **Sonner** (`sonner.tsx`) - Toast notifications (Sonner)
28. **Switch** (`switch.tsx`) - 29 lines
29. **Table** (`table.tsx`) - 117 lines
30. **Tabs** (`tabs.tsx`) - 55 lines
31. **Textarea** (`textarea.tsx`) - 22 lines
32. **Toggle Group** (`toggle-group.tsx`) - 61 lines
33. **Toggle** (`toggle.tsx`) - 45 lines

### **Medium Priority - Partial Usage**

These components have internal references but no external usage:

1. **Command** (`command.tsx`) - Only used internally in other UI components
2. **Dialog** (`dialog.tsx`) - Used internally by Command component
3. **Toast** (`toast.tsx`) & **use-toast.ts** - Complex toast system, may be replaced by simpler solution

---

## 📦 Unused Dependencies

### **Radix UI Packages (High Removal Priority)**

Remove these unused Radix UI dependencies from `package.json`:

```json
"@radix-ui/react-accordion": "1.2.11",           // ❌ Remove
"@radix-ui/react-alert-dialog": "1.1.14",        // ❌ Remove  
"@radix-ui/react-aspect-ratio": "1.1.7",         // ❌ Remove
"@radix-ui/react-avatar": "1.1.10",              // ❌ Remove
"@radix-ui/react-checkbox": "1.3.2",             // ❌ Remove
"@radix-ui/react-collapsible": "1.1.11",         // ❌ Remove
"@radix-ui/react-context-menu": "2.2.15",        // ❌ Remove
"@radix-ui/react-dropdown-menu": "2.1.15",       // ❌ Remove
"@radix-ui/react-hover-card": "1.1.14",          // ❌ Remove
"@radix-ui/react-menubar": "1.1.15",             // ❌ Remove
"@radix-ui/react-navigation-menu": "1.2.13",     // ❌ Remove
"@radix-ui/react-popover": "1.2.9",              // ❌ Remove
"@radix-ui/react-progress": "1.1.7",             // ❌ Remove
"@radix-ui/react-radio-group": "1.2.7",          // ❌ Remove
"@radix-ui/react-select": "2.1.15",              // ❌ Remove
"@radix-ui/react-slider": "1.3.5",               // ❌ Remove
"@radix-ui/react-switch": "1.2.5",               // ❌ Remove
"@radix-ui/react-tabs": "1.1.12",                // ❌ Remove
"@radix-ui/react-toggle": "1.1.9",               // ❌ Remove
"@radix-ui/react-toggle-group": "1.1.10"         // ❌ Remove
```

### **Additional Unused Dependencies (Detected by depcheck)**

**✅ VERIFIED SAFE TO REMOVE:**
```json
"@hookform/resolvers": "^5.0.1",         // ❌ Remove - Only in package.json, no imports
"critters": "^0.0.25",                   // ❌ Remove - Only in package.json, no usage  
"date-fns": "4.1.0",                     // ❌ Remove - Only in package.json, no imports
"zod": "^3.24.1",                        // ❌ Remove - Only in package.json, no imports
"@tailwindcss/container-queries": "^0.1.1"  // ❌ Remove - Not used in config, no @container classes
```

**⚠️ VERIFIED REQUIRED (DO NOT REMOVE):**
```json
"@tailwindcss/postcss": "^4.1.7",        // ✅ KEEP - Used in postcss.config.js
"@types/node": "^22.15.21",              // ✅ KEEP - Required for process.env in next.config.mjs
"autoprefixer": "^10.4.21",              // ✅ KEEP - Required by lightningcss (Tailwind CSS v4)
"postcss": "^8.5.3"                      // ✅ KEEP - Required by Tailwind CSS, Next.js
```

**Verification Notes:**
- Checked for actual usage in codebase using grep search
- Verified build dependencies with `npm list` 
- Confirmed PostCSS configuration requirements
- Validated TypeScript needs for Node.js types

---

## 🎨 Unused CSS & Animations

### **Tailwind CSS Classes in tailwind.config.ts**

Several custom animations and keyframes are defined but may not be used:

```typescript
// Potentially unused animations:
"accordion-down": { /* ... */ },     // ❌ If accordion removed
"accordion-up": { /* ... */ },       // ❌ If accordion removed
"glint-sweep": { /* ... */ },        // ⚠️  Verify usage
"pulse-shadow": { /* ... */ }        // ⚠️  Verify usage
```

### **CSS Custom Properties**

Review sidebar-related CSS variables in components that may not be used:
- `--sidebar-width`
- `--sidebar-width-icon`
- Various sidebar color variables

---

## 🧹 Code Cleanup Opportunities

### **Search Container Optimizations**

In `/components/search-container.tsx`:

1. **Commented Code Removal** (Lines 89-95):
   ```tsx
   // Remove these commented sections:
   // {/* <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-sm opacity-50 group-focus-within:opacity-100 transition-opacity duration-300 rounded-lg"></div> */}
   // {/* <div className="absolute inset-0 border-2 border-primary/40 group-focus-within:border-primary/80 transition-all duration-300 rounded-lg"></div> */}
   // {/* Cognito edge highlight - TEMPORARILY REMOVED */}
   ```

2. **Unused State Variables** - Verify if all state variables are necessary
3. **Animation Classes** - Review complex animation combinations for performance

### **Import Optimizations**

1. **Lucide React Icons** - Only import icons that are actually used
2. **Utility Functions** - Review if all imported utilities are necessary
3. **Type Definitions** - Clean up unused type imports

---

## 📊 Impact Analysis

### **Bundle Size Reduction Estimates**

| Category | Est. Size Reduction | Files Affected |
|----------|-------------------|----------------|
| Unused UI Components | ~150-200 KB | 33 files |
| Radix UI Dependencies | ~800 KB - 1.2 MB | 20+ packages |
| Additional Dependencies (verified) | ~600-800 KB | 5 packages |
| Unused Animations | ~5-10 KB | CSS config |
| Dead Code | ~20-50 KB | Various files |
| **TOTAL ESTIMATED** | **~1.6-2.1 MB** | **55+ files** |

### **Performance Benefits**

1. **Faster Build Times**: Fewer dependencies to process
2. **Reduced Bundle Size**: Significantly smaller JavaScript bundles
3. **Improved Tree Shaking**: Cleaner dependency graph
4. **Better Developer Experience**: Simplified codebase

---

## 🎯 Implementation Plan

### **Phase 1: Safe Removals (High Priority)**
1. Remove unused UI component files
2. Remove corresponding Radix UI dependencies
3. Clean up commented code
4. Update package.json

### **Phase 2: Verification & Testing (Medium Priority)**
1. Verify no broken imports after removals
2. Test build process
3. Run automated tests
4. Check for any runtime errors

### **Phase 3: Advanced Optimizations (Low Priority)**
1. Optimize remaining components
2. Review and clean Tailwind config
3. Analyze runtime performance
4. Consider code splitting opportunities

---

## ⚠️ Risk Mitigation

### **Before Implementation**

1. **Create Git Branch**: `git checkout -b optimize/cleanup-unused-components`
2. **Backup Current State**: Full commit of working state
3. **Documentation**: Update component documentation
4. **Testing Strategy**: Ensure comprehensive testing after each phase

### **Validation Steps**

1. **Build Verification**: `npm run build` should succeed
2. **Type Checking**: `npm run type-check` should pass
3. **Linting**: `npm run lint` should pass
4. **Functionality Testing**: All search features should work

---

## 🔄 Maintenance Recommendations

### **Ongoing Practices**

1. **Regular Dependency Audits**: Monthly review of package.json
2. **Component Usage Tracking**: Document which components are actively used
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Code Review Guidelines**: Flag unused imports and components

### **Tools to Consider**

1. **Bundle Analyzer**: `@next/bundle-analyzer`
2. **Dependency Cruiser**: For dependency graph analysis
3. **ESLint Rules**: For unused import detection
4. **Automated Cleanup**: Scripts for regular maintenance

---

## 📈 Success Metrics

### **Quantifiable Goals**

- [ ] **Bundle Size**: Reduce by 1+ MB
- [ ] **Build Time**: Reduce by 15-30%
- [ ] **Dependencies**: Remove 20+ unused packages
- [ ] **File Count**: Remove 30+ unused files
- [ ] **Maintainability**: Simplified component structure

### **Quality Assurance**

- [ ] All existing functionality preserved
- [ ] No performance regressions
- [ ] Clean build with no warnings
- [ ] Improved developer experience

---

## **4. React Performance Optimization**

### **Missing React.memo Opportunities**

**Components that should be memoized to prevent unnecessary re-renders:**

```tsx
// 1. AIResponseCard - Heavy component with markdown rendering
const AIResponseCard = React.memo(({ response, isError, isStreaming, onRegenerate }: AIResponseCardProps) => {
  // Component logic...
})

// 2. SearchSuggestions - Frequently rendered with prop changes
const SearchSuggestions = React.memo(({ suggestions, onSuggestionClick }: SearchSuggestionsProps) => {
  // Component logic...
})

// 3. SearchResultsContainer - Large data rendering
const SearchResultsContainer = React.memo(({ results, isLoading }: SearchResultsContainerProps) => {
  // Component logic...
})

// 4. SearchForm - Input component with frequent state changes
const SearchForm = React.memo(({ query, setQuery, onSearch, isLoading }: SearchFormProps) => {
  // Component logic...
})
```

### **useEffect Dependency Optimization**

**Current Issues Found:**

1. **Potentially Missing Dependencies:**
   ```tsx
   // ❌ BAD - Missing handleSearch in dependency array
   useEffect(() => {
     const handleRouteChange = () => {
       if (searchQuery && searchQuery !== query) {
         handleSearch(searchQuery) // Used but not in deps
       }
     }
   }, [query]) // handleSearch is missing
   
   // ✅ GOOD - Either add dependency or use useCallback
   useEffect(() => {
     const handleRouteChange = () => {
       if (searchQuery && searchQuery !== query) {
         handleSearch(searchQuery)
       }
     }
   }, [query, handleSearch]) // Include all dependencies
   ```

2. **Unnecessary Re-renders from useEffect:**
   ```tsx
   // ❌ BAD - Theme observer creates new listeners frequently
   useEffect(() => {
     const observer = new MutationObserver((mutations) => {
       mutations.forEach((mutation) => {
         const isDark = document.documentElement.classList.contains('dark')
         setIsDarkMode(isDark)
       })
     })
     // Missing cleanup and optimization
   }, []) // Should use useCallback for observer handler
   ```

### **Recommended useMemo Opportunities**

**Heavy computations that should be memoized:**

```tsx
// 1. Search results filtering
const filteredResults = useMemo(() => {
  return searchResults.filter(result => result.type === selectedType)
}, [searchResults, selectedType])

// 2. Markdown parsing (if used frequently)
const parsedMarkdown = useMemo(() => {
  return parseMarkdownToReact(response)
}, [response])

// 3. Suggestion generation
const generatedSuggestions = useMemo(() => {
  return generateSearchSuggestions(query, recentSearches)
}, [query, recentSearches])
```

### **Performance Impact Estimates**

| Optimization | Impact | Complexity |
|-------------|---------|------------|
| React.memo for AI Response | High (heavy markdown rendering) | Low |
| React.memo for Search Components | Medium (frequent updates) | Low |
| useEffect dependency fixes | Medium (prevent stale closures) | Medium |
| useMemo for computations | Low-Medium (depends on data size) | Low |
| **TOTAL IMPROVEMENT** | **Medium-High** | **Low-Medium** |

### **Implementation Priority**

1. **High Priority:** Add React.memo to AIResponseCard (heaviest component)
2. **Medium Priority:** Fix useEffect dependencies in use-search hook
3. **Low Priority:** Add useMemo for expensive computations

---

*Generated on: 2025-05-26*  
*Analysis Version: 1.0*  
*Next.js Version: 15.3.2*
