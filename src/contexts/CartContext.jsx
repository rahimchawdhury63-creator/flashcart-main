// CartContext.jsx — Shopping cart state. Persists to localStorage.
// Rule: a cart can only contain items from ONE store at a time (food delivery model).

import React, { createContext, useState, useEffect, useCallback } from 'react'

export const CartContext = createContext(null)

const STORAGE_KEY = 'flashcart_cart'

export function CartProvider({ children }) {
  // Cart shape: { storeId, storeName, storeSlug, items: [{...item, quantity, specialNote}] }
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { storeId: null, items: [] }
    } catch {
      return { storeId: null, items: [] }
    }
  })

  // Persist any cart change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // Add an item. If it belongs to a different store, returns a conflict signal
  // so the UI can confirm clearing the existing cart.
  const addItem = useCallback((item, store, quantity = 1) => {
    let conflict = false
    setCart((prev) => {
      // Different store -> signal conflict; do not mutate yet.
      if (prev.storeId && prev.storeId !== store.id && prev.items.length) {
        conflict = true
        return prev
      }
      const existing = prev.items.find((i) => i.itemId === item.id)
      let items
      if (existing) {
        items = prev.items.map((i) =>
          i.itemId === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      } else {
        items = [
          ...prev.items,
          {
            itemId: item.id,
            name: item.name,
            price: item.discountPrice || item.price,
            image: item.image,
            quantity,
            specialNote: '',
          },
        ]
      }
      return {
        storeId: store.id,
        storeName: store.name,
        storeSlug: store.slug,
        deliveryFee: store.deliveryFee || 0,
        items,
      }
    })
    return { conflict }
  }, [])

  // Replace the entire cart with a fresh single item (used after a store-conflict confirm).
  const replaceCart = useCallback((item, store, quantity = 1) => {
    setCart({
      storeId: store.id,
      storeName: store.name,
      storeSlug: store.slug,
      deliveryFee: store.deliveryFee || 0,
      items: [
        {
          itemId: item.id,
          name: item.name,
          price: item.discountPrice || item.price,
          image: item.image,
          quantity,
          specialNote: '',
        },
      ],
    })
  }, [])

  // Change quantity for an item (removes it if quantity hits 0).
  const updateQuantity = useCallback((itemId, quantity) => {
    setCart((prev) => {
      const items = prev.items
        .map((i) => (i.itemId === itemId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
      return items.length ? { ...prev, items } : { storeId: null, items: [] }
    })
  }, [])

  // Set a per-item special note.
  const setNote = useCallback((itemId, note) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.itemId === itemId ? { ...i, specialNote: note } : i)),
    }))
  }, [])

  // Remove an item entirely.
  const removeItem = useCallback((itemId) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.itemId !== itemId)
      return items.length ? { ...prev, items } : { storeId: null, items: [] }
    })
  }, [])

  // Empty the cart.
  const clearCart = useCallback(() => setCart({ storeId: null, items: [] }), [])

  // Derived totals.
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = cart.items.length ? cart.deliveryFee || 0 : 0
  const total = subtotal + deliveryFee

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        replaceCart,
        updateQuantity,
        setNote,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
