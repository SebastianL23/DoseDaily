import Link from "next/link"
import Image from "next/image"

const NextLink = Link as any
const NextImage = Image as any

const categories = [
  {
    id: 1,
    name: "Flower",
    image: "/images/flower.png",
    slug: "flower",
  },
  {
    id: 2,
    name: "Vape Liquid",
    image: "/images/vape.png",
    slug: "vape-liquid",
  },
  {
    id: 3,
    name: "Hash",
    image: "/images/hash.png",
    slug: "hash",
  },
  {
    id: 4,
    name: "Rosin",
    image: "/images/rosin.png",
    slug: "rosin",
  },
]

export default function FeaturedCategories() {
  return (
    <div className="max-w-[80%] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 px-4">
        {categories.map((category) => (
          <NextLink key={category.id} href={`/products?category=${encodeURIComponent(category.name)}`} className="group">
            <div className="flex flex-col">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <NextImage
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className={"object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-center mt-2 text-moss-600 font-semibold text-lg">{category.name}</h3>
            </div>
          </NextLink>
        ))}
      </div>
    </div>
  )
}
