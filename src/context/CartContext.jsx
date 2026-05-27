// ============================================================
// FlashCart — Cart Context Provider
// Manages shopping cart state with:
// - Local state for immediate UI response
// - localStorage persistence (survives page refresh)
// - Single-store enforcement (can't mix stores in one cart)
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// Storage key from constants
import { STORAGE_KEYS } from '../utils/constants';

// Create cart context
const CartContext = createContext(null);

/**
 * CartProvider
 * Provides cart state to all child components.
 * Cart persists in localStorage between page visits.
 */
export const CartProvider = ({ children }) => {

  // ── CART STATE ────────────────────────────────────────

  // Cart items — array of { itemId, name, nameBn, price, quantity, imageURL, storeId, storeName, storeSlug }
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage on first render
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      // localStorage might be blocked — start empty
      return [];
    }
  });

  // Current store for this cart (only one store allowed per cart)
  const [cartStore, setCartStore] = useState(() => {
    try {
      const saved = localStorage.getItem('fc_cart_store');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Delivery note for the order
  const [orderNote, setOrderNote] = useState('');

  // ── PERSIST TO LOCALSTORAGE ────────────────────────────

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
      localStorage.setItem('fc_cart_store', JSON.stringify(cartStore));
    } catch {
      // localStorage might be full or blocked
      console.warn('[FlashCart Cart] Could not save cart to localStorage');
    }
  }, [cartItems, cartStore]);

  // ── COMPUTED VALUES ───────────────────────────────────

  // Total number of items in cart (sum of all quantities)
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Cart subtotal (sum of price * quantity for all items)
  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cartItems]
  );

  // Whether cart has items
  const hasItems = cartItems.length > 0;

  // ── CART ACTIONS ──────────────────────────────────────

  /**
   * addToCart
   * Adds an item to the cart or increments quantity if already present.
   * Returns an object indicating success and whether store changed.
   *
   * @param {object} item - Item to add
   * @param {object} store - The store this item belongs to
   * @returns {{ success: boolean, isDifferentStore: boolean }}
   */
  const addToCart = useCallback((item, store) => {
    // Check if this item is from a different store than current cart
    if (cartStore && cartStore.id !== store.id && cartItems.length > 0) {
      // Cannot mix stores — return signal to show confirmation dialog
      return { success: false, isDifferentStore: true };
    }

    setCartItems(prev => {
      // Check if item already in cart
      const existingIndex = prev.findIndex(i => i.itemId === item.id);

      if (existingIndex >= 0) {
        // Item exists — increment quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      // New item — add to cart
      return [
        ...prev,
        {
          itemId:    item.id,
          name:      item.name,
          nameBn:    item.nameBn || '',
          price:     item.price,
          quantity:  1,
          imageURL:  item.imageURL || '',
          storeId:   store.id,
          storeName: store.businessName,
          storeSlug: store.slug,
        },
      ];
    });

    // Set the cart store
    setCartStore({
      id:         store.id,
      name:       store.businessName,
      slug:       store.slug,
      deliveryFee:store.deliveryFee || 0,
    });

    return { success: true, isDifferentStore: false };
  }, [cartStore, cartItems]);

  /**
   * removeFromCart
   * Removes an item completely from the cart.
   *
   * @param {string} itemId - ID of item to remove
   */
  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.itemId !== itemId);

      // If cart is now empty, clear the store reference
      if (updated.length === 0) {
        setCartStore(null);
      }

      return updated;
    });
  }, []);

  /**
   * updateQuantity
   * Updates the quantity of a specific cart item.
   * If quantity reaches 0, removes the item.
   *
   * @param {string} itemId - Item ID to update
   * @param {number} newQuantity - New quantity (0 removes item)
   */
  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.itemId === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  /**
   * clearCart
   * Removes all items from the cart.
   * Called after order is placed or user confirms store switch.
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartStore(null);
    setOrderNote('');

    // Clear localStorage cart data
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem('fc_cart_store');
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  /**
   * replaceCart
   * Clears current cart and adds new item from different store.
   * Called when user confirms they want to switch stores.
   *
   * @param {object} item - New item to add
   * @param {object} store - New store
   */
  const replaceCart = useCallback((item, store) => {
    // Clear existing cart
    clearCart();

    // Add the new item after a brief delay
    // (allows state to clear before adding)
    setTimeout(() => {
      addToCart(item, store);
    }, 50);
  }, [clearCart, addToCart]);

  /**
   * isInCart
   * Checks if a specific item is in the cart.
   *
   * @param {string} itemId - Item ID to check
   * @returns {boolean}
   */
  const isInCart = useCallback((itemId) => {
    return cartItems.some(item => item.itemId === itemId);
  }, [cartItems]);

  /**
   * getItemQuantity
   * Gets the quantity of a specific item in the cart.
   *
   * @param {string} itemId - Item ID to check
   * @returns {number} Quantity (0 if not in cart)
   */
  const getItemQuantity = useCallback((itemId) => {
    const item = cartItems.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // ── CONTEXT VALUE ─────────────────────────────────────
  const contextValue = useMemo(() => ({
    // State
    cartItems,
    cartStore,
    orderNote,
    cartCount,
    cartSubtotal,
    hasItems,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    replaceCart,
    setOrderNote,

    // Utilities
    isInCart,
    getItemQuantity,
  }), [
    cartItems, cartStore, orderNote, cartCount, cartSubtotal, hasItems,
    addToCart, removeFromCart, updateQuantity, clearCart, replaceCart,
    isInCart, getItemQuantity,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
export default CartProvider;
