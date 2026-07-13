import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

const parsePrice = (value) => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  const numeric = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isNaN(numeric) ? 0 : numeric
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const shipping = 0
  const discount = couponApplied ? 450 : 0

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items],
  )

  const total = useMemo(() => subtotal - discount + shipping, [subtotal, discount, shipping])
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items])

  const addItem = ({ productId, name, image, price, qty, variant, color, material }) => {
    const variantId = `${productId}-${variant || 'default'}-${color || 'default'}-${material || 'default'}`
    const normalizedPrice = parsePrice(price)

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.variantId === variantId)

      if (existingIndex > -1) {
        const nextItems = [...prevItems]
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          qty: nextItems[existingIndex].qty + qty,
        }
        return nextItems
      }

      return [
        ...prevItems,
        {
          variantId,
          productId,
          name,
          image,
          price: normalizedPrice,
          qty,
          variant,
          color,
          material,
        },
      ]
    })
  }

  const updateQuantity = (variantId, nextQty) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.variantId === variantId
            ? { ...item, qty: Math.max(1, nextQty) }
            : item,
        )
        .filter((item) => item.qty > 0),
    )
  }

  const removeItem = (variantId) => {
    setItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId))
  }

  const applyCoupon = (code) => {
    setCouponCode(code)
    setCouponApplied(Boolean(code && code.trim()))
  }

  const clearCart = () => {
    setItems([])
    setCouponCode('')
    setCouponApplied(false)
  }

  const value = {
    items,
    subtotal,
    discount,
    shipping,
    total,
    totalItems,
    couponCode,
    couponApplied,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}
