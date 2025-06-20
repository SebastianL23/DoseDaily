"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { CoinbaseCheckout } from "@/components/coinbase-checkout"
import { toast } from "sonner"
import { ShoppingBagIcon, MinusCircleIcon, PlusCircleIcon, HeartIcon, ShareIcon, ChevronRightIcon, StarIcon, TruckIcon } from "@heroicons/react/24/outline"

// Add type assertions
const NextBag = ShoppingBagIcon
const NextMinus = MinusCircleIcon
const NextPlus = PlusCircleIcon
const NextHeart = HeartIcon
const NextShare = ShareIcon
const NextChevronRight = ChevronRightIcon
const NextStar = StarIcon
const NextTruck = TruckIcon

function ProductActions({ product, quantity, setQuantity, calculatePrice, selectedCannabinoidType, setSelectedCannabinoidType }: { 
  product: any, 
  quantity: number, 
  setQuantity: React.Dispatch<React.SetStateAction<number>>,
  calculatePrice: (qty: number) => { total: number; original: number; discount: number; discountPercentage: number; hasDiscount: boolean },
  selectedCannabinoidType: string,
  setSelectedCannabinoidType: React.Dispatch<React.SetStateAction<string>>
}) {
  const { addToCart } = useCart()

  const incrementQuantity = () => setQuantity((prev: number) => prev + 1)
  const decrementQuantity = () => setQuantity((prev: number) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    const priceDetails = calculatePrice(quantity)
    addToCart({
      ...product,
      image: product.images[0],
      quantity,
      selectedCannabinoidType,
      price: priceDetails.total / quantity, // Store the per-unit price
      totalPrice: priceDetails.total // Store the total price
    })
  }

  return (
    <>
      {/* Cannabinoid Type Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Cannabinoid Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {product.cannabinoidTypes.map((cannabinoidType: string) => (
            <NextButton
              key={cannabinoidType}
              variant={selectedCannabinoidType === cannabinoidType ? "default" : "outline"}
              className={selectedCannabinoidType === cannabinoidType ? "bg-moss-500 hover:bg-moss-600" : ""}
              onClick={() => setSelectedCannabinoidType(cannabinoidType)}
            >
              {cannabinoidType.toUpperCase()}
            </NextButton>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Quantity {(product.category === "Vape Liquid" || product.category === "Vape") ? "(30ml bottles)" : "(grams)"}
        </h3>
        <div className="flex items-center">
          <NextButton variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
            <NextMinus className="h-4 w-4" />
          </NextButton>
          <span className="w-12 text-center">{quantity}</span>
          <NextButton variant="outline" size="icon" onClick={incrementQuantity}>
            <NextPlus className="h-4 w-4" />
          </NextButton>
        </div>
      </div>

      {/* Payment Options */}
      <div className="flex flex-col gap-4 mb-6">
        <NextButton 
          className="flex-1 bg-moss-500 hover:bg-moss-600 text-white font-medium py-3 text-lg transition-all duration-200 shadow-sm hover:shadow-md" 
          size="lg" 
          onClick={handleAddToCart}
        >
          <NextBag className="h-5 w-5 mr-2" />
          Add to Cart
        </NextButton>
        <div className="flex gap-2">
          <NextButton variant="outline" size="icon" className="rounded-full">
            <NextHeart className="h-5 w-5" />
          </NextButton>
          <NextButton variant="outline" size="icon" className="rounded-full">
            <NextShare className="h-5 w-5" />
          </NextButton>
        </div>
      </div>
    </>
  )
}

// Server Component
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Add type assertions
const NextImage = Image as any
const NextLink = Link as any
const NextButton = Button as any
const NextBadge = Badge as any
const NextTabs = Tabs as any
const NextTabsList = TabsList as any
const NextTabsTrigger = TabsTrigger as any
const NextTabsContent = TabsContent as any

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params using React.use()
  const resolvedParams = use(params)
  const productId = resolvedParams.id
  const [quantity, setQuantity] = useState(1)
  const [selectedCannabinoidType, setSelectedCannabinoidType] = useState("cbd")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Debug logging
  console.log('Product ID from URL:', productId)
  console.log('Product ID as number:', Number(productId))

  // Product data array
  const products = [
    {
      id: 1,
      name: "Raspberry Muffin",
      price: 7.99,
      images: [
        "/images/raspberry.webp"
      ],
      rating: 4.8,
      reviewCount: 124,
      category: "Flower",
      isNew: false,
      isBestSeller: true,
      description: "Our Raspberry Muffin is carefully cultivated to provide a relaxing and calming experience. Known for its dense buds and rich aroma, this strain is perfect for evening use.",
      benefits: [
        "Promotes relaxation and calmness",
        "May help with sleep issues",
        "Potential pain relief properties",
        "Rich in terpenes and cannabinoids",
      ],
      details: "Grown indoors under optimal conditions. Hand-trimmed and cured to perfection.",
      usage: "For optimal experience, use with a quality grinder. Can be consumed in a variety of ways including smoking, vaporizing, or used to create edibles.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Indica",
      terpenes: "Myrcene, Caryophyllene, Limonene",
      effects: "Relaxing, Sleepy, Euphoric",
    },
    {
      id: 2,
      name: "Blue Dream Amnesia Vape Liquid",
      price: 24.99,
      images: [
        "/images/amnesia.webp"
      ],
      rating: 4.9,
      reviewCount: 89,
      category: "Vape Liquid",
      isNew: false,
      isBestSeller: true,
      description: "Premium vape liquid with a sweet berry aroma and balanced effects.",
      benefits: [
        "Smooth vaping experience",
        "Long-lasting effects",
        "Discreet consumption",
        "No combustion required",
      ],
      details: "High-quality vape liquid made with premium ingredients.",
      usage: "Use with any standard vape pen or device.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Hybrid",
      terpenes: "Myrcene, Pinene, Caryophyllene",
      effects: "Balanced, Uplifting, Creative",
    },
    {
      id: 3,
      name: "Moroccan Hash",
      price: 6.50,
      images: [
        "/images/hash1.png",
        "/images/hash1.png"
      ],
      rating: 4.7,
      reviewCount: 56,
      category: "Hash",
      isNew: false,
      isBestSeller: true,
      description: "Traditional Moroccan hash with rich, earthy flavors and potent effects.",
      benefits: [
        "Rich in cannabinoids",
        "Traditional preparation methods",
        "Long-lasting effects",
        "Versatile consumption options",
      ],
      details: "Hand-pressed using traditional methods, aged to perfection.",
      usage: "Can be smoked, vaporized, or used in edibles.",
      cannabinoidTypes: ["cbd", "thcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Indica",
      terpenes: "Myrcene, Caryophyllene, Pinene",
      effects: "Relaxing, Calming, Sedating",
    },
    {
      id: 4,
      name: "Banana Kush Wax",
      price: 30.00,
      images: [
        "/images/bananakush.webp",
        "/images/bananakush.webp"
      ],
      rating: 4.8,
      reviewCount: 92,
      category: "Rosin",
      isNew: true,
      isBestSeller: true,
      description: "Premium Banana Kush wax with a sweet, tropical aroma and balanced effects. This high-quality concentrate is perfect for those seeking a potent and flavorful experience.",
      benefits: [
        "Rich in cannabinoids and terpenes",
        "Sweet tropical flavor profile",
        "Potent effects",
        "Clean consumption experience",
      ],
      details: "Extracted using heat and pressure, no solvents used. Preserves the full spectrum of cannabinoids and terpenes.",
      usage: "Best consumed at low temperatures for maximum flavor and effect. Can be used with a dab rig or vaporizer.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Hybrid",
      terpenes: "Myrcene, Limonene, Caryophyllene",
      effects: "Relaxing, Euphoric, Happy",
    },
    {
      id: 5,
      name: "Lemon Octane",
      price: 5.50,
      images: [
        "/images/lemonoc.jpg",
        "/images/lemonoc.jpg"
      ],
      rating: 4.5,
      reviewCount: 18,
      category: "Flower",
      isNew: true,
      isBestSeller: false,
      description: "Energizing Lemon Octane strain perfect for daytime use. Known for its citrus aroma and uplifting effects.",
      benefits: [
        "Boosts energy and focus",
        "Enhances creativity",
        "Uplifting effects",
        "Great for social situations",
      ],
      details: "Grown with organic methods, hand-trimmed for quality.",
      usage: "Best consumed during daytime hours.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Sativa",
      terpenes: "Limonene, Pinene, Terpinolene",
      effects: "Energetic, Focused, Creative",
    },
    {
      id: 6,
      name: "Gelato Vape Liquid",
      price: 39.99,
      images: [
        "/images/gelato1.webp"
      ],
      rating: 4.7,
      reviewCount: 156,
      category: "Vape Liquid",
      isNew: false,
      isBestSeller: true,
      description: "Premium Gelato-flavored CBD vape liquid for a smooth, flavorful, and relaxing vaping experience. Perfect for use in refillable vape pens and e-cigarettes.",
      benefits: [
        "Delicious Gelato-inspired flavor",
        "Smooth vapor production",
        "CBD-rich formula for relaxation",
        "Easy to use with most refillable vape devices",
      ],
      details: "Made with high-quality CBD distillate and natural terpenes. Free from nicotine and THC. Suitable for all refillable vape pens and e-cigarettes.",
      usage: "Fill your refillable vape pen or e-cigarette tank with Gelato Vape Liquid. Start with a few puffs and increase as desired. Not for use in sub-ohm devices.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Hybrid",
      terpenes: "Limonene, Caryophyllene, Linalool",
      effects: "Relaxing, Euphoric, Happy",
    },
    {
      id: 7,
      name: "Bubble Hash",
      price: 7.99,
      images: [
        "/images/hash3.jpg"
      ],
      rating: 4.6,
      reviewCount: 78,
      category: "Hash",
      isNew: false,
      isBestSeller: true,
      description: "Traditional bubble hash made using ice water extraction method.",
      benefits: [
        "Full spectrum extraction",
        "Rich in trichomes",
        "Versatile consumption",
        "Traditional preparation",
      ],
      details: "Made using ice water and fine mesh screens.",
      usage: "Can be smoked, vaporized, or used in edibles.",
      cannabinoidTypes: ["cbd", "thcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Hybrid",
      terpenes: "Myrcene, Pinene, Caryophyllene",
      effects: "Relaxing, Calming, Happy",
    },
    {
      id: 8,
      name: "Wedding Cake Wax",
      price: 28.00,
      images: [
        "/images/weddingcake.webp",
        "/images/weddingcake.webp"
      ],
      rating: 4.9,
      reviewCount: 112,
      category: "Rosin",
      isNew: true,
      isBestSeller: false,
      description: "Premium Wedding Cake wax with a sweet, vanilla-like aroma and balanced effects. This high-quality concentrate offers a perfect blend of relaxation and euphoria.",
      benefits: [
        "Rich in cannabinoids and terpenes",
        "Sweet vanilla flavor profile",
        "Potent effects",
        "Clean consumption experience",
      ],
      details: "Extracted using heat and pressure, no solvents used. Preserves the full spectrum of cannabinoids and terpenes.",
      usage: "Best consumed at low temperatures for maximum flavor and effect. Can be used with a dab rig or vaporizer.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Hybrid",
      terpenes: "Limonene, Caryophyllene, Linalool",
      effects: "Relaxing, Euphoric, Happy",
    },
    {
      id: 9,
      name: "OG Kush Flower",
      price: 6.99,
      images: [
        "/images/ogkush.webp",
        "/images/ogkush.webp"
      ],
      rating: 4.8,
      reviewCount: 203,
      category: "Flower",
      isNew: false,
      isBestSeller: true,
      description: "Classic OG Kush strain known for its potent effects and distinctive aroma.",
      benefits: [
        "Potent effects",
        "Rich in terpenes",
        "Classic strain",
        "Versatile consumption",
      ],
      details: "Grown indoors with organic methods.",
      usage: "Can be smoked, vaporized, or used in edibles.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Indica",
      terpenes: "Myrcene, Limonene, Caryophyllene",
      effects: "Relaxing, Happy, Euphoric",
    },
    {
      id: 10,
      name: "Amnesia Haze",
      price: 8.99,
      images: [
        "/images/ammi.jpg"
      ],
      rating: 4.6,
      reviewCount: 18,
      category: "Flower",
      isNew: true,
      isBestSeller: false,
      description: "Amnesia Haze is a legendary sativa strain known for its uplifting and energetic effects, with a citrusy aroma and dense, resinous buds.",
      benefits: [
        "Uplifts mood and energy",
        "Citrus and earthy aroma",
        "Great for daytime use",
        "Rich in cannabinoids and terpenes"
      ],
      details: "Cultivated indoors for maximum potency and flavor. Hand-trimmed and slow-cured.",
      usage: "Best enjoyed during the day for a boost in creativity and focus. Can be smoked, vaporized, or used in edibles.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Sativa",
      terpenes: "Limonene, Terpinolene, Myrcene",
      effects: "Energetic, Uplifting, Creative",
    },
    {
      id: 11,
      name: "Gelato",
      price: 8.49,
      images: [
        "/images/bud7.jpg"
      ],
      rating: 4.8,
      reviewCount: 27,
      category: "Flower",
      isNew: true,
      isBestSeller: false,
      description: "Gelato is a popular hybrid strain known for its sweet, dessert-like aroma and balanced effects. Perfect for relaxation and creative activities.",
      benefits: [
        "Sweet and creamy flavor",
        "Balanced hybrid effects",
        "Great for relaxation and creativity",
        "Rich in cannabinoids and terpenes"
      ],
      details: "Expertly cultivated indoors for premium quality. Hand-trimmed and slow-cured for optimal flavor.",
      usage: "Enjoy during the afternoon or evening for a relaxing and uplifting experience. Can be smoked, vaporized, or used in edibles.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Hybrid",
      terpenes: "Limonene, Caryophyllene, Humulene",
      effects: "Relaxing, Uplifting, Creative",
    },
    {
      id: 12,
      name: "Lemonchello",
      price: 6.99,
      images: [
        "/images/lemonchello.jpg"
      ],
      rating: 4.7,
      reviewCount: 45,
      category: "Flower",
      isNew: true,
      isBestSeller: false,
      description: "Lemonchello is a refreshing hybrid strain with a bright citrus aroma and uplifting effects. Perfect for daytime use and creative activities.",
      benefits: [
        "Bright citrus flavor profile",
        "Uplifting and energizing effects",
        "Great for daytime use",
        "Rich in terpenes and cannabinoids"
      ],
      details: "Cultivated with care using organic methods. Hand-trimmed and slow-cured for maximum flavor and potency.",
      usage: "Best enjoyed during the day for a boost in energy and creativity. Can be smoked, vaporized, or used in edibles.",
      cannabinoidTypes: ["cbd", "hhcp"],
      lab_results: "https://example.com/lab-results",
      strain_type: "Hybrid",
      terpenes: "Limonene, Pinene, Myrcene",
      effects: "Uplifting, Energetic, Creative",
    },
  ]

  // Find the product based on the ID
  const product = products.find(p => p.id === Number(productId))

  // If product is not found, you might want to show an error or redirect
  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
          <p className="mt-2 text-gray-500">Temporary out of stock</p>
        </div>
      </main>
    )
  }

  const calculatePrice = (qty: number) => {
    // Base price calculation with HHCP premium
    const basePrice = product.price * qty
    const hhcpMultiplier = selectedCannabinoidType === "hhcp" ? 1.5 : 1
    const adjustedBasePrice = basePrice * hhcpMultiplier
    
    let discount = 0
    let discountPercentage = 0

    // Apply bulk discounts based on category
    if (product.category === "Flower" || product.category === "Hash") {
      // 20% discount for 7+ grams
      if (qty >= 7) {
        discountPercentage = 20
        discount = adjustedBasePrice * 0.20
      }
    } else if (product.category === "Rosin") {
      // 20% discount for 3+ grams
      if (qty >= 3) {
        discountPercentage = 20
        discount = adjustedBasePrice * 0.20
      }
    } else if (product.category === "Vape Liquid" || product.category === "Vape") {
      // 25% discount for 3+ bottles
      if (qty >= 3) {
        discountPercentage = 25
        discount = adjustedBasePrice * 0.25
      }
    }

    return {
      total: adjustedBasePrice - discount,
      original: adjustedBasePrice,
      discount,
      discountPercentage,
      hasDiscount: discount > 0
    }
  }

  // Calculate the current price with any applicable discounts
  const priceDetails = calculatePrice(quantity)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <NextLink href="/" className="hover:text-green-600">
          Home
        </NextLink>
        <NextChevronRight className="h-4 w-4 mx-2" />
        <NextLink href="/products" className="hover:text-green-600">
          Products
        </NextLink>
        <NextChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <NextImage src={product.images[selectedImageIndex] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            {product.isBestSeller && (
              <NextBadge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600">Best Seller</NextBadge>
            )}
            {product.isNew && (
              <NextBadge className={`absolute ${product.isBestSeller ? 'top-14' : 'top-4'} left-4 bg-blue-500 hover:bg-blue-600`}>New</NextBadge>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
              <div
                key={index}
                className={`relative aspect-square overflow-hidden rounded-md border cursor-pointer hover:border-green-500 ${selectedImageIndex === index ? 'border-green-600' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <NextImage
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <NextStar
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-500">
                Starting at £{product.price.toFixed(2)}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  £{priceDetails.total.toFixed(2)}
                </span>
                {priceDetails.hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      £{priceDetails.original.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-moss-600">
                      Save {priceDetails.discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              {priceDetails.hasDiscount && (
                <p className="text-sm text-moss-600">
                  {product.category === "Flower" || product.category === "Hash"
                    ? "20% off for 7+ grams"
                    : product.category === "Rosin"
                    ? "20% off for 3+ grams"
                    : "25% off for 3+ bottles"}
                </p>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Strain Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-md">
              <span className="text-sm font-medium text-gray-500">Strain Type</span>
              <p className="font-medium">{product.strain_type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <span className="text-sm font-medium text-gray-500">Effects</span>
              <p className="font-medium">{product.effects}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <span className="text-sm font-medium text-gray-500">Terpenes</span>
              <p className="font-medium">{product.terpenes}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <span className="text-sm font-medium text-gray-500">Category</span>
              <p className="font-medium">{product.category}</p>
            </div>
          </div>

          {/* Interactive Product Actions */}
          <div className="mb-6">
            <ProductActions 
              product={product} 
              quantity={quantity} 
              setQuantity={setQuantity} 
              calculatePrice={calculatePrice}
              selectedCannabinoidType={selectedCannabinoidType}
              setSelectedCannabinoidType={setSelectedCannabinoidType}
            />
          </div>

          {/* Shipping Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <NextTruck className="h-4 w-4" />
            <span>Fast Shipping</span>
          </div>

          {/* Lab Results */}
          <div className="mb-6">
            <NextLink
              href="/images/labresults.webp"
              className="text-moss-500 hover:text-moss-600 text-sm font-medium flex items-center gap-1"
              target="_blank"
            >
              View Lab Results
              <NextChevronRight className="h-4 w-4" />
            </NextLink>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <NextTabs defaultValue="description">
          <NextTabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <NextTabsTrigger value="description">Description</NextTabsTrigger>
            <NextTabsTrigger value="benefits">Benefits</NextTabsTrigger>
            <NextTabsTrigger value="details">Details</NextTabsTrigger>
            <NextTabsTrigger value="usage">Usage</NextTabsTrigger>
          </NextTabsList>
          <NextTabsContent value="description" className="mt-8">
            <p className="text-gray-600">{product.description}</p>
          </NextTabsContent>
          <NextTabsContent value="benefits" className="mt-8">
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {product.benefits.map((benefit: string, index: number) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </NextTabsContent>
          <NextTabsContent value="details" className="mt-8">
            <p className="text-gray-600">{product.details}</p>
          </NextTabsContent>
          <NextTabsContent value="usage" className="mt-8">
            <p className="text-gray-600">{product.usage}</p>
          </NextTabsContent>
        </NextTabs>
      </div>
    </main>
  )
}

// Sample related products - updated to match new categories
const relatedProducts = [
  {
    id: 2,
    name: "Blue Dream Amnesia Vape Liquid",
    price: 24.99,
    image: "/images/amnesia.webp",
    rating: 4.9,
    reviewCount: 89,
    category: "Vape Liquid",
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 5,
    name: "Lemon Octane",
    price: 5.50,
    image: "/placeholder.svg?height=300&width=300&text=Sativa+Hybrid",
    rating: 4.5,
    reviewCount: 18,
    category: "Flower",
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 3,
    name: "Moroccan Hash",
    price: 6.50,
    image: "/images/hash1.png",
    rating: 4.7,
    reviewCount: 56,
    category: "Hash",
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 9,
    name: "Live Rosin Extract",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300&text=Rosin",
    rating: 4.3,
    reviewCount: 28,
    category: "Rosin",
    isNew: false,
    isBestSeller: false,
  },
]
