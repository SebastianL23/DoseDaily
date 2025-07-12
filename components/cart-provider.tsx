"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, X } from "lucide-react"

// Add type assertions
const NextButton = Button as any
const NextX = X as any

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  selectedStrength?: string
  [key: string]: any
}

type Discount = {
  type: 'percentage' | 'fixed'
  value: number
  code: string
} | null

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  discount: Discount
  setDiscount: (discount: Discount) => void
  applyDiscount: (code: string, email: string) => Promise<{ success: boolean; message: string }>
  discountEmail: string
  setDiscountEmail: (email: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const NextCartProvider = CartContext.Provider as any

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [discount, setDiscount] = useState<Discount>(null)
  const [discountEmail, setDiscountEmail] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize cart and discount from localStorage on client-side only
  useEffect(() => {
    if (!isInitialized) {
      const savedCart = localStorage.getItem('cart')
      const savedDiscount = localStorage.getItem('discount')
      
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
      if (savedDiscount) {
        setDiscount(JSON.parse(savedDiscount))
      }
      
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isInitialized])

  // Save discount to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('discount', JSON.stringify(discount))
    }
  }, [discount, isInitialized])

  console.log('CartProvider state:', { cart, isOpen, discount }) // Debug log

  const addToCart = (product: CartItem) => {
    console.log('Adding to cart:', product) // Debug log
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          (item.selectedStrength === product.selectedStrength || (!item.selectedStrength && !product.selectedStrength)),
      )

      if (existingItemIndex !== -1) {
        // Update quantity if product exists
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += product.quantity
        console.log('Updated cart after adding:', updatedCart) // Debug log
        return updatedCart
      } else {
        // Add new product to cart
        const newCart = [...prevCart, product]
        console.log('New cart after adding:', newCart) // Debug log
        return newCart
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId)
      console.log('Cart after removing item:', newCart) // Debug log
      return newCart
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => 
        item.id === productId ? { ...item, quantity } : item
      )
      console.log('Cart after updating quantity:', newCart) // Debug log
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    setDiscount(null)
    if (isInitialized) {
      localStorage.removeItem('cart')
      localStorage.removeItem('discount')
    }
  }

  const applyDiscount = async (code: string, email: string) => {
    try {
      // First validate the discount code
      const validateResponse = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email }),
      })

      const validateData = await validateResponse.json()

      if (!validateData.valid) {
        return { success: false, message: validateData.message }
      }

      // If valid, mark it as used
      const markUsedResponse = await fetch('/api/mark-discount-used', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email }),
      })

      const markUsedData = await markUsedResponse.json()

      if (!markUsedData.success) {
        return { success: false, message: 'Failed to apply discount code' }
      }

      // Set the discount in the cart
      setDiscount({
        type: validateData.discount.discount_type,
        value: validateData.discount.discount_value,
        code: validateData.discount.code
      })

      return { success: true, message: 'Discount code applied successfully!' }
    } catch (error) {
      console.error('Error applying discount:', error)
      return { success: false, message: 'Failed to apply discount code' }
    }
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 5.99
  
  // Calculate discount amount
  const discountAmount = discount
    ? discount.type === 'percentage'
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0

  const total = subtotal + shipping - discountAmount

  return (
    <NextCartProvider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      isOpen, 
      setIsOpen,
      discount,
      setDiscount,
      applyDiscount,
      discountEmail,
      setDiscountEmail
    }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Your Cart</h2>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600">Your cart is empty</p>
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cart.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{item.name}</h3>
                                      <p className="ml-4">£{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    {item.selectedStrength && (
                                      <p className="mt-1 text-sm text-gray-500">Strength: {item.selectedStrength}</p>
                                    )}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        -
                                      </button>
                                      <span className="mx-2">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        +
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id)}
                                      className="font-medium text-red-600 hover:text-red-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>



                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-base text-gray-900">
                        <p>Subtotal</p>
                        <p>£{subtotal.toFixed(2)}</p>
                      </div>
                      {discount && (
                        <div className="flex justify-between text-base text-green-600">
                          <p>Discount ({discount.code})</p>
                          <p>-£{discountAmount.toFixed(2)}</p>
                        </div>
                      )}
                      <div className="flex justify-between text-base text-gray-900">
                        <p>Shipping</p>
                        <p>{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</p>
                      </div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>£{total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </NextCartProvider>
  )
}
