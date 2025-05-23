import { SiteHeader } from "@/components/layout/site-header"
import { HowItWorksContent } from "@/components/how-it-works/how-it-works-content"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <HowItWorksContent />
    </div>
  )
}
