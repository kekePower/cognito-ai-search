import { redirect } from 'next/navigation'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q

  if (!query) {
    // Redirect to home page if no query is provided
    redirect('/')
  }

  // Redirect to the home page with the query parameter
  redirect(`/?q=${encodeURIComponent(query)}`)
}
