"use client"

import { CoinbaseCheckout } from './coinbase-checkout'

export default function CoinbaseTest() {
  const testProduct = {
    name: "Test Product",
    price: 10.00,
    description: "This is a test product for Coinbase Commerce integration"
  }

  const handleSuccess = () => {
    console.log("Checkout successful!")
  }

  const handleError = (error: any) => {
    console.error("Checkout failed:", error)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Coinbase Checkout Test</h1>
      <div className="max-w-md">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">{testProduct.name}</h2>
          <p className="text-gray-600 mb-4">{testProduct.description}</p>
          <p className="text-lg font-bold mb-4">${testProduct.price.toFixed(2)}</p>
          <CoinbaseCheckout 
            product={testProduct}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </div>
    </div>
  )
} 