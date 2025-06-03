"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, Grid3X3, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import ProductFilters, { type FilterState } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { allProducts } from "@/data/products"

// Add type assertions
const NextButton = Button as any
const NextSeparator = Separator as any
const NextSelect = Select as any
const NextSelectContent = SelectContent as any
const NextSelectItem = SelectItem as any
const NextSelectTrigger = SelectTrigger as any
const NextSelectValue = SelectValue as any
const NextSheet = Sheet as any
const NextSheetContent = SheetContent as any
const NextSheetTrigger = SheetTrigger as any
const NextFilter = Filter as any
const NextGrid3X3 = Grid3X3 as any
const NextList = List as any
const NextChevronLeft = ChevronLeft as any
const NextChevronRight = ChevronRight as any
const NextChevronsLeft = ChevronsLeft as any
const NextChevronsRight = ChevronsRight as any

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 200],
    cannabinoidTypes: [],
    types: [],
  })
  const [sortOption, setSortOption] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Get the maximum price from all products
  const maxPrice = Math.max(...allProducts.map((product) => product.price))

  // Apply filters to products
  useEffect(() => {
    let result = [...allProducts]

    // Get search query from URL
    const searchQuery = searchParams.get("search")?.toLowerCase()

    // Apply search filter if query exists
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.type.toLowerCase().includes(searchQuery)
      )
    }

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category))
    }

    // Filter by price range
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Filter by product type
    if (filters.types.length > 0) {
      result = result.filter((product) => filters.types.includes(product.type))
    }

    // Filter by cannabinoid type
    if (filters.cannabinoidTypes.length > 0) {
      result = result.filter((product) => filters.cannabinoidTypes.includes(product.cannabinoidType))
    }

    // Apply sorting
    result = sortProducts(result, sortOption)

    setFilteredProducts(result)
  }, [filters, sortOption, searchParams])

  // Sort products based on selected option
  const sortProducts = (products: typeof allProducts, sortBy: string) => {
    const sorted = [...products]

    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "best-selling":
        return sorted.sort((a, b) => (a.isBestSeller === b.isBestSeller ? 0 : a.isBestSeller ? -1 : 1))
      case "featured":
      default:
        return sorted
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  // Handle sort changes
  const handleSortChange = (value: string) => {
    setSortOption(value)
  }

  // Toggle view mode
  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters onFilterChange={handleFilterChange} initialFilters={filters} maxPrice={maxPrice} />
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">
              All Products
              {filteredProducts.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length} products)</span>
              )}
            </h1>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Mobile filter button */}
              <NextSheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <NextSheetTrigger asChild>
                  <NextButton variant="outline" className="md:hidden flex items-center gap-2 w-full sm:w-auto">
                    <NextFilter className="h-4 w-4" />
                    Filters
                  </NextButton>
                </NextSheetTrigger>
                <NextSheetContent side="left">
                  <div className="py-4">
                    <ProductFilters onFilterChange={handleFilterChange} initialFilters={filters} maxPrice={maxPrice} />
                  </div>
                </NextSheetContent>
              </NextSheet>

              <div className="flex items-center gap-2 ml-auto">
                <div className="flex border rounded-md">
                  <NextButton
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className={
                      viewMode === "grid" ? "rounded-r-none bg-moss-500 hover:bg-moss-600" : "rounded-r-none"
                    }
                    onClick={() => toggleViewMode("grid")}
                  >
                    <NextGrid3X3 className="h-4 w-4" />
                  </NextButton>
                  <NextSeparator orientation="vertical" className="h-full" />
                  <NextButton
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className={
                      viewMode === "list" ? "rounded-l-none bg-moss-500 hover:bg-moss-600" : "rounded-l-none"
                    }
                    onClick={() => toggleViewMode("list")}
                  >
                    <NextList className="h-4 w-4" />
                  </NextButton>
                </div>

                <NextSelect value={sortOption} onValueChange={handleSortChange}>
                  <NextSelectTrigger className="w-[180px]">
                    <NextSelectValue placeholder="Sort by" />
                  </NextSelectTrigger>
                  <NextSelectContent>
                    <NextSelectItem value="featured">Featured</NextSelectItem>
                    <NextSelectItem value="newest">Newest</NextSelectItem>
                    <NextSelectItem value="price-low">Price: Low to High</NextSelectItem>
                    <NextSelectItem value="price-high">Price: High to Low</NextSelectItem>
                    <NextSelectItem value="best-selling">Best Selling</NextSelectItem>
                  </NextSelectContent>
                </NextSelect>
              </div>
            </div>
          </div>

          {/* No results message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
              <NextButton
                onClick={() =>
                  setFilters({
                    categories: [],
                    priceRange: [0, maxPrice],
                    cannabinoidTypes: [],
                    types: [],
                  })
                }
                className="bg-green-600 hover:bg-green-700"
              >
                Clear all filters
              </NextButton>
            </div>
          )}

          {/* Product Grid */}
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination - only show if we have products */}
          {filteredProducts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <NextButton
                  variant="default"
                  size="sm"
                  className="bg-moss-500 hover:bg-moss-600"
                  disabled
                >
                  1
                </NextButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
