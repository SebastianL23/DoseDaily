"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { EyeIcon, HeartIcon, ShoppingBagIcon, StarIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "./cart-provider"

// Add type assertions
const NextLink = Link as any
const NextChevronRight = ChevronRightIcon as any

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    rating: number
    reviewCount: number
    category: string
    isNew?: boolean
    isBestSeller?: boolean
    discount?: number
    lab_results: string
    [key: string]: any
  }
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      ...product,
      quantity: 1,
    })
  }

  if (viewMode === "list") {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <Link href={`/products/${product.id}`} className="relative w-full sm:w-48 h-48 hover:text-moss-500">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 scale-105"
            />

            {/* Badges */}
            {product.isBestSeller && (
              <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">Best Seller</Badge>
            )}
            {product.isNew && (
              <Badge className={`absolute ${product.isBestSeller ? 'top-10' : 'top-2'} left-2 bg-blue-500 hover:bg-blue-600`}>New</Badge>
            )}
            {product.discount && product.discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
            )}

            {/* Out of Stock Overlay for other products if needed */}
            {product.id > 9 && product.id !== 10 && product.id !== 11 && product.id !== 12 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-lg">Out of Stock</Badge>
              </div>
            )}
          </Link>

          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/products/${product.id}`} className="block hover:text-moss-500">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-moss-500 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={handleAddToCart}
                >
                  <HeartIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <EyeIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">£{product.price.toFixed(2)}</span>
                {product.discount && product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    £{(product.price * (1 + product.discount / 100)).toFixed(2)}
                  </span>
                )}
              </div>
              {(product.category === "Flower" || product.category === "Hash") && (
                <p className="mt-1 text-sm text-moss-600">
                  20% off for 7+ grams
                </p>
              )}
              {(product.category === "Rosin") && (
                <p className="mt-1 text-sm text-moss-600">
                  20% off for 3+ grams
                </p>
              )}
              {(product.category === "Vape Liquid" || product.category === "Vape") && (
                <p className="mt-1 text-sm text-moss-600">
                  25% off for 3+ bottles
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                className="bg-moss-500 hover:bg-moss-600 w-auto"
                onClick={handleAddToCart}
              >
                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" className="w-auto">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
      <Link href={`/products/${product.id}`} className="block hover:text-moss-500">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 scale-105"
          />

          {/* Badges */}
          {product.isBestSeller && (
            <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">Best Seller</Badge>
          )}
          {product.isNew && (
            <Badge className={`absolute ${product.isBestSeller ? 'top-10' : 'top-2'} left-2 bg-blue-500 hover:bg-blue-600`}>New</Badge>
          )}
          {product.discount && product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
          )}

          {/* Out of Stock Overlay for other products if needed */}
          {product.id > 9 && product.id !== 10 && product.id !== 11 && product.id !== 12 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-lg">Out of Stock</Badge>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 bg-white hover:bg-white/90 text-gray-900"
              onClick={handleAddToCart}
            >
              <ShoppingBagIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 bg-white hover:bg-white/90 text-gray-900"
            >
              <EyeIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-moss-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>

          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">£{product.price.toFixed(2)}</span>
              {product.discount && product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  £{(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>
            {(product.category === "Flower" || product.category === "Hash") && (
              <p className="mt-1 text-sm text-moss-600">
                20% off for 7+ grams
              </p>
            )}
            {(product.category === "Rosin") && (
              <p className="mt-1 text-sm text-moss-600">
                20% off for 3+ grams
              </p>
            )}
            {(product.category === "Vape Liquid" || product.category === "Vape") && (
              <p className="mt-1 text-sm text-moss-600">
                25% off for 3+ bottles
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              className="bg-moss-500 hover:bg-moss-600 w-auto"
              onClick={handleAddToCart}
            >
              <ShoppingBagIcon className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}
