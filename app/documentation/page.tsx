import { SiteHeader } from "@/components/layout/site-header"
import { DocumentationContent } from "@/components/documentation/documentation-content"

export default function DocumentationPage() {
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <DocumentationContent />
    </div>
  )
}
