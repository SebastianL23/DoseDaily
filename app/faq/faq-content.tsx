"use client"

import * as React from "react"
import Link from "next/link"
import { FiMail } from 'react-icons/fi'
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function FAQContent() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to the most common questions about our products, shipping, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="space-y-4 sticky top-20">
            <h3 className="font-semibold text-lg">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#general" className="text-moss-500 hover:text-moss-600">
                  General Questions
                </a>
              </li>
              <li>
                <a href="#products" className="text-moss-500 hover:text-moss-600">
                  Products & Usage
                </a>
              </li>
              <li>
                <a href="#shipping" className="text-moss-500 hover:text-moss-600">
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="#returns" className="text-moss-500 hover:text-moss-600">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#legal" className="text-moss-500 hover:text-moss-600">
                  Legal & Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <section id="general" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">General Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="what-is-cbd" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">What is CBD?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD (Cannabidiol) is a naturally occurring compound found in the cannabis plant. Unlike THC, CBD is
                    non-psychoactive, meaning it doesn't produce the "high" associated with cannabis use. CBD has gained
                    popularity for its potential wellness benefits and is available in various forms including oils,
                    edibles, topicals, and more.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="will-cbd-get-me-high" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  Will CBD products get me high?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    No, CBD products will not get you high. CBD is non-psychoactive and does not produce the
                    intoxicating effects associated with THC. Our products contain less than 0.2% THC, which is the
                    legal limit in the UK and not enough to cause any psychoactive effects.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="is-cbd-legal" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">Is CBD legal in the UK?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Yes, CBD is legal in the UK as long as it contains less than 0.2% THC and is derived from an
                    EU-approved industrial hemp strain. All our products comply with UK regulations and contain less
                    than the legal limit of THC.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="who-should-use" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">Who should use CBD?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD is used by people from all walks of life for various reasons. However, we recommend consulting
                    with a healthcare professional before starting any CBD regimen, especially if you are pregnant,
                    nursing, have a medical condition, or are taking medications.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="age-requirement" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  Is there an age requirement to purchase CBD?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Yes, you must be 21 years or older to purchase CBD products from our website. We have age
                    verification measures in place to ensure compliance with this policy.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="products" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Products & Usage</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="difference-flower-hash" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  What's the difference between CBD flower and hash?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD flower refers to the dried buds of the hemp plant, which contain high levels of CBD and very low
                    levels of THC. CBD hash is a concentrated form made from the resin of the hemp plant, typically more
                    potent than flower. Both products offer different experiences and potency levels, allowing users to
                    choose based on their preferences.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-to-use-flower" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">How do I use CBD flower?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD flower can be used in several ways. It can be smoked in a joint or pipe, vaporized using a dry
                    herb vaporizer, or used to make homemade edibles or teas. Vaporizing is often considered a healthier
                    alternative to smoking as it produces vapor instead of smoke.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-to-use-hash" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">How do I use CBD hash?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD hash can be crumbled and mixed with flower in a joint or pipe, vaporized in a concentrate
                    vaporizer, or dabbed using a dab rig. It can also be added to foods or beverages, though it should
                    be decarboxylated first for maximum effectiveness when consumed orally.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dosage" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">How much CBD should I take?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD dosage varies from person to person based on factors like body weight, individual body
                    chemistry, and the condition being addressed. We recommend starting with a low dose and gradually
                    increasing until you find your optimal dosage. For specific guidance, consult with a healthcare
                    professional.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="lab-testing" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  Are your products lab tested?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Yes, all our products undergo rigorous third-party lab testing to ensure quality, potency, and
                    safety. Lab reports verify cannabinoid content and confirm the absence of harmful contaminants like
                    pesticides, heavy metals, and residual solvents. Lab results are available on each product page or
                    upon request.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cbd-vs-thca" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  What's the difference between CBD and THCA products?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD (Cannabidiol) is non-psychoactive and won't produce a high. THCA (Tetrahydrocannabinolic acid)
                    is the non-psychoactive precursor to THC found in raw cannabis plants. When heated (through smoking,
                    vaping, or cooking), THCA converts to THC, which can produce psychoactive effects. Our THCA products
                    comply with UK regulations regarding THC content.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="shipping" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Shipping & Delivery</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="shipping-time" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">How long does shipping take?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Standard shipping within the UK typically takes 2-4 business days. International shipping times vary by destination but
                    generally take 5-10 business days. All orders are processed within 24-48 hours.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping-cost" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">How much does shipping cost?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    We offer free standard shipping on all UK orders over £75. For orders under £75, standard shipping
                    costs £5.99. International shipping rates vary
                    by destination and are calculated at checkout.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="international-shipping" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">Do you ship internationally?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Yes, we ship to most European countries. However, due to varying regulations regarding CBD products
                    in different countries, we cannot ship to all international destinations. Please check our shipping
                    policy for a list of countries we currently serve.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="discreet-packaging" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">Is your packaging discreet?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Yes, all our orders are shipped in plain, unmarked packaging with no indication of the contents
                    inside. The shipping label will show our company name but not specify that the package contains CBD
                    products. We respect your privacy and understand the importance of discreet delivery.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="track-order" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">How can I track my order?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Once your order ships, you'll receive a confirmation email with a tracking number and instructions
                    on how to track your package. You can also log into your account on our website to view your order
                    status and tracking information.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="returns" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Returns & Refunds</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="return-policy" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">What is your return policy?</AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    We offer a 7-day satisfaction guarantee. If you're not completely satisfied with your purchase, you
                    can return unopened products within 7 days of delivery for a full refund of the product price
                    (excluding shipping costs). For health and safety reasons, we cannot accept returns of opened
                    products unless they are defective.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="defective-products" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  What if I receive a defective product?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    If you receive a defective product, please contact our customer service team within 7 days of
                    delivery. We'll arrange for a replacement or refund. Please provide photos of the defective item to
                    help us process your claim more efficiently.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section id="legal" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Legal & Compliance</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="drug-test" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  Will CBD show up on a drug test?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Most standard drug tests look for THC metabolites, not CBD. Our products contain less than 0.2% THC
                    (the legal limit in the UK), which is unlikely to trigger a positive result on most drug tests.
                    However, we cannot guarantee that you will pass a drug test after using our products, as individual
                    factors and test sensitivity vary.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="medical-claims" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  Do you make medical claims about your products?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    No, we do not make any medical claims about our CBD products. CBD is sold as a food supplement in
                    the UK, not as a medicine. Our products are not intended to diagnose, treat, cure, or prevent any
                    disease. Always consult with a healthcare professional before starting any new supplement regimen.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="driving-cbd" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  Can I drive after using CBD products?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    CBD itself is not known to impair driving ability. However, CBD can affect each person differently,
                    and some people may experience drowsiness or other effects that could impact driving. We recommend
                    understanding how CBD affects you personally before driving or operating heavy machinery.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="travel-with-cbd" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium py-4">
                  Can I travel with CBD products?
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  <p>
                    Traveling with CBD within the UK is generally acceptable. However, international travel with CBD
                    products can be complicated due to varying legal status in different countries. We recommend
                    researching the specific laws of your destination before traveling with CBD products. In some
                    countries, CBD is illegal regardless of THC content.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          If you couldn't find the answer to your question, please don't hesitate to contact us.
        </p>
        <Button asChild className="bg-moss-500 hover:bg-moss-600">
          <Link href="/contact" className="flex items-center gap-2">
            <FiMail className="h-4 w-4" /> Contact Us
          </Link>
        </Button>
      </div>
    </main>
  )
} 