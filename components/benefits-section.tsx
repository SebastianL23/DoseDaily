import { Check, Leaf, ShieldCheck, Truck } from "lucide-react"

const NextLeaf = Leaf as any
const NextShieldCheck = ShieldCheck as any
const NextTruck = Truck as any
const NextCheck = Check as any

const benefits = [
  {
    icon: <NextLeaf className="h-8 w-8 text-moss-500" />,
    title: "Organic Hemp",
    description: "All our products are made from organically grown hemp plants.",
  },
  {
    icon: <NextShieldCheck className="h-8 w-8 text-moss-500" />,
    title: "Lab Tested",
    description: "Every batch is third-party lab tested for purity and potency.",
  },
  {
    icon: <NextTruck className="h-8 w-8 text-moss-500" />,
    title: "Free Shipping",
    description: "Free shipping on all orders over £75 within the UK.",
  },
  {
    icon: <NextCheck className="h-8 w-8 text-moss-500" />,
    title: "Discreet Packaging",
    description: "All orders are shipped in plain, unmarked packaging for your privacy.",
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our CBD</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
