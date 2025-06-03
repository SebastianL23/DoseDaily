import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { blogPosts, categories } from "./blog-data"
import NewsletterForm from "../components/NewsletterForm"

// Add type assertions for components
const NextLink = Link as any
const NextButton = Button as any
const NextInput = Input as any
const NextBadge = Badge as any
const NextSeparator = Separator as any
const NextImage = Image as any

// Add type assertions for icons
const NextCalendarDays = CalendarDays as any
const NextClock = Clock as any
const NextChevronRight = ChevronRight as any
const NextSearch = Search as any

export default function BlogPage() {
  // Find the featured post
  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0]
  // Get the rest of the posts
  const recentPosts = blogPosts.filter((post) => post.id !== featuredPost.id).slice(0, 3)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">CBD Wellness Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the latest articles, research, and guides about CBD benefits, usage, and wellness.
        </p>
      </div>

      {/* Search and Categories */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-12">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <NextInput placeholder="Search articles..." className="pl-10 pr-4" />
            <NextSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <NextLink href="/blog">
            <NextBadge variant="secondary" className="hover:bg-gray-200 cursor-pointer">
              All
            </NextBadge>
          </NextLink>
          {categories.map((category) => (
            <NextLink key={category.slug} href={`/blog/category/${category.slug}`}>
              <NextBadge variant="secondary" className="hover:bg-gray-200 cursor-pointer">
                {category.name}
              </NextBadge>
            </NextLink>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <div className="relative rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-sand-100 p-8 md:p-12 rounded-xl">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
              <NextImage
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <NextBadge className="bg-moss-500 text-white hover:bg-moss-600">Featured</NextBadge>
              <h2 className="text-2xl md:text-3xl font-bold text-moss-600">
                <NextLink href={`/blog/${featuredPost.slug}`} className="hover:text-moss-700 transition-colors">
                  {featuredPost.title}
                </NextLink>
              </h2>
              <p className="text-gray-600">{featuredPost.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <div className="flex items-center">
                  <NextCalendarDays className="h-4 w-4 mr-1" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center">
                  <NextClock className="h-4 w-4 mr-1" />
                  <span>{featuredPost.readTime} min read</span>
                </div>
              </div>
              <NextButton asChild className="bg-moss-500 hover:bg-moss-600">
                <NextLink href={`/blog/${featuredPost.slug}`}>
                  Read Article <NextChevronRight className="ml-1 h-4 w-4" />
                </NextLink>
              </NextButton>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          <a 
            href="https://starbay.shop/CBD/T22755/LP1/?cep=9ydlbLhiSG4bJTyQCTJYNejF26Wt7mUTzK_xsOar8l5QJN39hTVgEq73Y1Mz3dYF4_Es3jN8ZlQ8fhoq4QsydkznS4xFSO_ZMyW8o33hKN4u4LRKCAyO4DV6QJCha0i7XtiyZCuym_aB3Vfk_wexr6msTHxUBQK-C1tnjIlIp3qYcObXjYNNHT58z2JpYB0ukNho93FaeSeaAE4iqiA8EwO3zkTd95cz7lnkLePuP2nLYfG5UfpSUHSLkUFSgCmCS8ZNtwjDsLoAlp_2XhPu_bMpvG5RXnEaUBWmcFLM9-30-94C1lrSRqTNa9jkvtA96PMgq1FNdbHig1OnGz291_H1OYbrriSer5y0ctXcqBYUyNrS-rBlWwbBbp517ugKRQQq3B-LvmVQn3t9E1c7OA_PTp8_-VuizTA0Nj54sPfogtpaNjPQPlsZ2b8wxbWkrr9X3YJfsU-AKmmRJP5kWA&lptoken=170b47563038200c948f"
            target="_blank"
            rel="noopener noreferrer"
            className="text-moss-500 hover:text-moss-600 flex items-center"
          >
            View All <NextChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
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
              <h3 className="text-xl font-semibold mb-2 group-hover:text-moss-500 transition-colors">
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
          ))}
        </div>
      </div>

      <NextSeparator className="my-16" />

      {/* Popular Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Explore by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <NextLink
              key={category.name}
              href={`/blog/category/${category.slug}`}
              className="group relative rounded-lg overflow-hidden aspect-[4/3]"
            >
              <NextImage
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count} articles</p>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      </div>

      {/* Links Section for SEO */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Related Resources</h2>
        <div className="max-w-2xl">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-moss-600">External Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products-including-cannabidiol-cbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-moss-500 transition-colors"
                >
                  FDA CBD Information
                </a>
              </li>
              <li>
                <a 
                  href="https://www.who.int/teams/mental-health-and-substance-use/alcohol-drugs-and-addictive-behaviours/drugs-psychoactive/cannabis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-moss-500 transition-colors"
                >
                  WHO Cannabis Research
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8223341/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-moss-500 transition-colors"
                >
                  CBD Research Studies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-moss-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <NewsletterForm />
        </div>
      </div>
    </main>
  )
}
