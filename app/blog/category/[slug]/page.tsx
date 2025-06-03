import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { blogPosts, categories } from "../../blog-data"
import { notFound } from "next/navigation"
import { Metadata } from "next"

// Add type assertions
const NextLink = Link as any
const NextImage = Image as any
const NextButton = Button as any
const NextBadge = Badge as any
const NextCalendarDays = CalendarDays as any
const NextClock = Clock as any
const NextChevronLeft = ChevronLeft as any

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = await Promise.resolve(categories.find((cat) => cat.slug === resolvedParams.slug))
  return {
    title: category ? `${category.name} - Blog Category` : 'Category Not Found',
  }
}

export default async function Page(props: CategoryPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    props.params,
    props.searchParams
  ])
  
  // Find the category based on the slug
  const category = await Promise.resolve(categories.find((cat) => cat.slug === resolvedParams.slug))

  // If category doesn't exist, return 404
  if (!category) {
    notFound()
  }

  // Filter posts by this category
  const categoryPosts = await Promise.resolve(
    blogPosts.filter((post) => post.category.toLowerCase() === category.name.toLowerCase())
  )

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <NextButton variant="outline" size="sm" asChild className="flex items-center gap-1">
            <NextLink href="/blog">
              <NextChevronLeft className="h-4 w-4" />
              Back to Blog
            </NextLink>
          </NextButton>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
        <p className="text-lg text-gray-600">Browse our collection of articles about {category.name.toLowerCase()}.</p>
      </div>

      {/* Category Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categoryPosts.length > 0 ? (
          categoryPosts.map((post) => (
            <div key={post.id} className="group">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <NextImage
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2">
                  <NextBadge className="bg-white/90 text-gray-800 hover:bg-white">{post.category}</NextBadge>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
                <NextLink href={`/blog/${post.slug}`}>{post.title}</NextLink>
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <div className="flex items-center">
                  <NextCalendarDays className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <NextClock className="h-4 w-4 mr-1" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">We haven't published any articles in this category yet.</p>
          </div>
        )}
      </div>
    </main>
  )
}
