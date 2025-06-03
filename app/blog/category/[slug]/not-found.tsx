import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, the blog category you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild className="bg-green-600 hover:bg-green-700">
        <Link href="/blog">Back to Blog</Link>
      </Button>
    </div>
  )
}
