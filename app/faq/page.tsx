import type { Metadata } from "next"
import FAQContent from "./faq-content"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Dose Daily",
  description: "Find answers to common questions about CBD products, shipping, returns, and more.",
}

export default function FAQPage() {
  return <FAQContent />
} 