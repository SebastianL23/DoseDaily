import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { blogPosts, categories } from "../../blog-data"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { FunnelIcon, Squares2X2Icon, ListBulletIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline"
// Add type assertions for components
const NextLink = Link as any
const NextButton = Button as any
const NextBadge = Badge as any
const NextImage = Image as any

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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <NextLink href="/" className="hover:text-green-600">
          Home
        </NextLink>
        <span className="mx-2">/</span>
        <NextLink href="/blog" className="hover:text-green-600">
          Blog
        </NextLink>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="mb-12">
        <NextBadge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
          {category.name}
        </NextBadge>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {category.name} Articles
        </h1>
        <p className="text-lg text-gray-600">Browse our collection of articles about {category.name.toLowerCase()}.</p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoryPosts.map((post) => (
          <article key={post.id} className="group">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
              <NextImage
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
              <NextLink href={`/blog/${post.slug}`}>{post.title}</NextLink>
            </h2>
            <div className="flex items-center text-sm text-gray-500 gap-4 mb-2">
              <div className="flex items-center">
                <span className="h-4 w-4 mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h.008v.008H12v6M12 6a6 6 0 100 12 6 6 0 000-12z" />
                  </svg>
                </span>
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <span className="h-4 w-4 mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h.008v.008H12v6M12 6a6 6 0 100 12 6 6 0 000-12z" />
                  </svg>
                </span>
                <span>{post.readTime} min read</span>
              </div>
            </div>
            <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
          </article>
        ))}
      </div>

      {/* Back to Blog */}
      <div className="mt-12">
        <NextButton variant="outline" className="flex items-center gap-2" asChild>
          <NextLink href="/blog">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Blog
          </NextLink>
        </NextButton>
      </div>
    </main>
  )
}
