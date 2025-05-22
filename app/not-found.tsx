import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileSearch } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-md py-16 px-4 text-center">
      <div className="flex justify-center mb-4">
        <FileSearch className="h-16 w-16 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
