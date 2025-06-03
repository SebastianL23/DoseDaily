import Link from "next/link"
import { Button } from "@/components/ui/button"

const NextButton = Button as any
const NextLink = Link as any

export default function BlogNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, the blog post you're looking for doesn't exist or has been removed.
      </p>
      <NextButton asChild className="bg-green-600 hover:bg-green-700">
        <NextLink href="/blog">Back to Blog</NextLink>
      </NextButton>
    </div>
  )
}
