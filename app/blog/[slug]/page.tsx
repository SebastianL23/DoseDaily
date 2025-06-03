"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { blogPosts, blogPostContent, authors } from "../blog-data"
import { notFound } from "next/navigation"
import { useState, use } from "react"
import { supabase } from "@/lib/supabase"

// Add type assertions for components
const NextLink = Link as any
const NextButton = Button as any
const NextInput = Input as any
const NextAvatar = Avatar as any
const NextAvatarImage = AvatarImage as any
const NextAvatarFallback = AvatarFallback as any
const NextSeparator = Separator as any
const NextBadge = Badge as any
const NextImage = Image as any

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') { // Unique violation
          setMessage({ type: 'error', text: 'This email is already subscribed!' })
        } else {
          setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
        }
        return
      }

      setMessage({ type: 'success', text: 'Thank you for subscribing!' })
      setEmail('')
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Find the blog post data based on the slug
  const post = blogPosts.find((post) => post.slug === slug)

  // If post doesn't exist, return 404
  if (!post) {
    notFound()
  }

  // Get the content for this post
  const postContent = blogPostContent[slug as keyof typeof blogPostContent]

  // If content doesn't exist, use a default
  const content = postContent?.content || "<p>Content coming soon...</p>"

  // Get author info
  const authorId = postContent?.author || "dr-sarah-johnson"
  const author = authors[authorId as keyof typeof authors]

  // Get tags
  const tags = postContent?.tags || ["CBD"]

  // Get related posts (excluding current post)
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3)

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
        <span className="text-gray-900">{post.title}</span>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <NextBadge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">{post.category}</NextBadge>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <NextAvatar className="h-10 w-10">
              <NextAvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
              <NextAvatarFallback>
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </NextAvatarFallback>
            </NextAvatar>
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <p className="text-xs text-gray-500">{author.title}</p>
            </div>
          </div>

          <NextSeparator orientation="vertical" className="h-8" />

          <div className="flex items-center text-sm text-gray-500">
            <span className="h-4 w-4 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h.008v.008H12v6M12 6a6 6 0 100 12 6 6 0 000-12z" />
              </svg>
            </span>
            <span>{post.date}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <span className="h-4 w-4 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h.008v.008H12v6M12 6a6 6 0 100 12 6 6 0 000-12z" />
              </svg>
            </span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
          <NextImage 
            src={post.image || "/placeholder.svg"} 
            alt={post.title} 
            fill 
            priority
            className="object-cover" 
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="prose prose-green max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      {/* External Resources */}
      <div className="mb-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-green-600 mb-4">External Resources</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Official Information</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products-including-cannabidiol-cbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <span>FDA CBD Information</span>
                  <span className="text-sm text-gray-400">(opens in new tab)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.who.int/teams/mental-health-and-substance-use/alcohol-drugs-and-addictive-behaviours/drugs-psychoactive/cannabis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <span>WHO Cannabis Research</span>
                  <span className="text-sm text-gray-400">(opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">CBD Education & Research</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.lovecbd.org/what-is-cbd-2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <span>What is CBD? - Love CBD Guide</span>
                  <span className="text-sm text-gray-400">(opens in new tab)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.lovecbd.org/medical-cannabis-and-cbd-oil-in-the-uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <span>Medical Cannabis and CBD Oil in the UK</span>
                  <span className="text-sm text-gray-400">(opens in new tab)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8223341/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <span>CBD Research Studies</span>
                  <span className="text-sm text-gray-400">(opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">CBD Usage & Travel</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://britishcbd.net/cbd-oil-for-anxiety-natural-support-for-stress/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <span>CBD Oil for Anxiety - Natural Support Guide</span>
                  <span className="text-sm text-gray-400">(opens in new tab)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://britishcbd.net/can-you-take-vape-juice-on-a-plane/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <span>Travel Guide: Taking CBD Vape Juice on Planes</span>
                  <span className="text-sm text-gray-400">(opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <NextBadge key={tag} variant="outline" className="text-gray-600">
            {tag}
          </NextBadge>
        ))}
      </div>

      {/* Share - Updated to only include Facebook, Twitter, and LinkedIn */}
      <div className="flex items-center gap-4 mb-12">
        <span className="text-sm font-medium">Share this article:</span>
        <div className="flex gap-2">
          <NextButton variant="outline" size="icon" className="rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.25A6 6 0 006.031 21H5.25a8.25 8.25 0 0115.464-4.743c.354.922.546 1.925.546 2.955z" />
            </svg>
          </NextButton>
          <NextButton variant="outline" size="icon" className="rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.25A6 6 0 006.031 21H5.25a8.25 8.25 0 0115.464-4.743c.354.922.546 1.925.546 2.955z" />
            </svg>
          </NextButton>
          <NextButton variant="outline" size="icon" className="rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.25A6 6 0 006.031 21H5.25a8.25 8.25 0 0115.464-4.743c.354.922.546 1.925.546 2.955z" />
            </svg>
          </NextButton>
        </div>
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50 rounded-lg p-6 mb-12">
        <div className="flex items-start gap-4">
          <NextAvatar className="h-16 w-16">
            <NextAvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
            <NextAvatarFallback>
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </NextAvatarFallback>
          </NextAvatar>
          <div>
            <h3 className="text-lg font-semibold mb-2">About {author.name}</h3>
            <p className="text-gray-600 mb-4">{author.bio}</p>
            <a 
              href="https://starbay.shop/CBD/T22755/LP1/?cep=9ydlbLhiSG4bJTyQCTJYNejF26Wt7mUTzK_xsOar8l5QJN39hTVgEq73Y1Mz3dYF4_Es3jN8ZlQ8fhoq4QsydkznS4xFSO_ZMyW8o33hKN4u4LRKCAyO4DV6QJCha0i7XtiyZCuym_aB3Vfk_wexr6msTHxUBQK-C1tnjIlIp3qYcObXjYNNHT58z2JpYB0ukNho93FaeSeaAE4iqiA8EwO3zkTd95cz7lnkLePuP2nLYfG5UfpSUHSLkUFSgCmCS8ZNtwjDsLoAlp_2XhPu_bMpvG5RXnEaUBWmcFLM9-30-94C1lrSRqTNa9jkvtA96PMgq1FNdbHig1OnGz291_H1OYbrriSer5y0ctXcqBYUyNrS-rBlWwbBbp517ugKRQQq3B-LvmVQn3t9E1c7OA_PTp8_-VuizTA0Nj54sPfogtpaNjPQPlsZ2b8wxbWkrr9X3YJfsU-AKmmRJP5kWA&lptoken=170b47563038200c948f"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-green-600 text-base font-medium rounded-md text-green-600 hover:bg-green-50 transition-colors"
            >
              View all posts
            </a>
          </div>
        </div>
      </div>

      {/* Post Navigation - Removed "Next Post" button, kept only "Back to Blog" */}
      <div className="flex justify-start items-center mb-12">
        <NextButton variant="outline" className="flex items-center gap-2" asChild>
          <NextLink href="/blog">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Blog
          </NextLink>
        </NextButton>
      </div>

      {/* Related Posts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost) => (
            <div key={relatedPost.id} className="group">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <NextImage
                  src={relatedPost.image || "/placeholder.svg"}
                  alt={relatedPost.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-green-600 transition-colors">
                <NextLink href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</NextLink>
              </h3>
              <div className="flex items-center text-sm text-gray-500 gap-4 mb-2">
                <div className="flex items-center">
                  <span className="h-4 w-4 mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h.008v.008H12v6M12 6a6 6 0 100 12 6 6 0 000-12z" />
                    </svg>
                  </span>
                  <span>{relatedPost.date}</span>
                </div>
                <div className="flex items-center">
                  <span className="h-4 w-4 mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h.008v.008H12v6M12 6a6 6 0 100 12 6 6 0 000-12z" />
                    </svg>
                  </span>
                  <span>{relatedPost.readTime} min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-sand-100 rounded-lg p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-moss-600 mb-4">Stay Updated on CBD Research</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter to receive the latest CBD news, research, and wellness tips directly to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <NextInput 
              type="email" 
              placeholder="Your email address" 
              className="bg-white"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <NextButton 
              type="submit"
              className="bg-moss-500 hover:bg-moss-600 text-white"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </NextButton>
          </form>
          {message && (
            <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
