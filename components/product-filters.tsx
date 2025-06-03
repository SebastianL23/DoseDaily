"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

// Add type assertions
const NextAccordion = Accordion as any
const NextAccordionItem = AccordionItem as any
const NextAccordionTrigger = AccordionTrigger as any
const NextAccordionContent = AccordionContent as any
const NextCheckbox = Checkbox as any
const NextSlider = Slider as any

export type FilterState = {
  categories: string[]
  priceRange: [number, number]
  cannabinoidTypes: string[]
  types: string[]
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
  maxPrice?: number
}

export default function ProductFilters({ onFilterChange, initialFilters, maxPrice = 200 }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    const categoryParam = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const cannabinoidType = searchParams.get("cannabinoidType")
    const type = searchParams.get("type")

    return {
      categories: categoryParam ? [categoryParam] : initialFilters?.categories || [],
      priceRange: [
        minPrice ? Number.parseInt(minPrice) : initialFilters?.priceRange?.[0] || 0,
        maxPrice ? Number.parseInt(maxPrice) : initialFilters?.priceRange?.[1] || 200,
      ],
      cannabinoidTypes: cannabinoidType ? [cannabinoidType] : initialFilters?.cannabinoidTypes || [],
      types: type ? [type] : initialFilters?.types || [],
    }
  })

  // Update filters when URL params change
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam && !filters.categories.includes(categoryParam)) {
      setFilters((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryParam],
      }))
    }
  }, [searchParams, filters.categories])

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  // Handle category checkbox changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category),
    }))
  }

  // Handle product type checkbox changes
  const handleTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      types: checked ? [...prev.types, type] : prev.types.filter((t) => t !== type),
    }))
  }

  // Handle price range changes
  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }))
  }

  // Handle cannabinoid type checkbox changes
  const handleCannabinoidTypeChange = (cannabinoidType: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      cannabinoidTypes: checked
        ? [...prev.cannabinoidTypes, cannabinoidType]
        : prev.cannabinoidTypes.filter((s) => s !== cannabinoidType),
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      cannabinoidTypes: [],
      types: [],
    })
  }

  // Categories data - Updated with new categories
  const categories = [
    { id: "Flower", label: "Flower" },
    { id: "Vape Liquid", label: "Vape Liquid" },
    { id: "Hash", label: "Hash" },
    { id: "Rosin", label: "Rosin" },
  ]

  // Cannabinoid type options
  const cannabinoidTypeOptions = [
    { id: "cbd", label: "CBD" },
    { id: "thca", label: "THCA" },
  ]

  // Product type data
  const typeOptions = [
    { id: "indica", label: "Indica" },
    { id: "sativa", label: "Sativa" },
    { id: "hybrid", label: "Hybrid" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-900">
          Clear all
        </Button>
      </div>

      {/* Categories */}
      <NextAccordion type="multiple" defaultValue={["categories"]}>
        <NextAccordionItem value="categories">
          <NextAccordionTrigger>Categories</NextAccordionTrigger>
          <NextAccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <NextCheckbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked: boolean) => handleCategoryChange(category.id, checked)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </NextAccordionContent>
        </NextAccordionItem>
      </NextAccordion>

      {/* Price Range */}
      <NextAccordion type="multiple" defaultValue={["price"]}>
        <NextAccordionItem value="price">
          <NextAccordionTrigger>Price Range</NextAccordionTrigger>
          <NextAccordionContent>
            <div className="space-y-4">
              <NextSlider
                min={0}
                max={maxPrice}
                step={1}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">£{filters.priceRange[0]}</span>
                <span className="text-sm">£{filters.priceRange[1]}</span>
              </div>
            </div>
          </NextAccordionContent>
        </NextAccordionItem>
      </NextAccordion>

      {/* Cannabinoid Type */}
      <NextAccordion type="multiple" defaultValue={["cannabinoidType"]}>
        <NextAccordionItem value="cannabinoidType">
          <NextAccordionTrigger>Cannabinoid Type</NextAccordionTrigger>
          <NextAccordionContent>
            <div className="space-y-2">
              {cannabinoidTypeOptions.map((cannabinoidType) => (
                <div key={cannabinoidType.id} className="flex items-center space-x-2">
                  <NextCheckbox
                    id={cannabinoidType.id}
                    checked={filters.cannabinoidTypes.includes(cannabinoidType.id)}
                    onCheckedChange={(checked: boolean) => handleCannabinoidTypeChange(cannabinoidType.id, checked)}
                  />
                  <label
                    htmlFor={cannabinoidType.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cannabinoidType.label}
                  </label>
                </div>
              ))}
            </div>
          </NextAccordionContent>
        </NextAccordionItem>
      </NextAccordion>

      {/* Product Type */}
      <NextAccordion type="multiple" defaultValue={["type"]}>
        <NextAccordionItem value="type">
          <NextAccordionTrigger>Product Type</NextAccordionTrigger>
          <NextAccordionContent>
            <div className="space-y-2">
              {typeOptions.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <NextCheckbox
                    id={type.id}
                    checked={filters.types.includes(type.id)}
                    onCheckedChange={(checked: boolean) => handleTypeChange(type.id, checked)}
                  />
                  <label
                    htmlFor={type.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </NextAccordionContent>
        </NextAccordionItem>
      </NextAccordion>
    </div>
  )
}
