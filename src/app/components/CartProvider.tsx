"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { Product } from "../api/products";

const CART_STORAGE_KEY = "minimarket_cart";

export type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  deleteItem: (productId: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

//necesitamos el contexto para poder usar el carrito en tda la app
const CartContext = createContext<CartContextValue | null>(null);
const emptyCart: CartItem[] = [];
let cartSnapshot: CartItem[] = emptyCart;
let cartSnapshotRaw = "";

function parseStoredCart(rawCart: string | null): CartItem[] {
  if (!rawCart) {
    return emptyCart;
  }

  try {
    const parsedCart = JSON.parse(rawCart);
    if (!Array.isArray(parsedCart)) {
      return emptyCart;
    }

    return parsedCart.filter(
      (item): item is CartItem =>
        item &&
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number"
    ) || emptyCart;
  } catch (err) {
    console.error(err);
    return emptyCart;
  }
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") {
    return emptyCart;
  }

  const rawCart = window.localStorage.getItem(CART_STORAGE_KEY) ?? "";
  if (rawCart === cartSnapshotRaw) {
    return cartSnapshot;
  }

  cartSnapshotRaw = rawCart;
  cartSnapshot = parseStoredCart(rawCart);
  return cartSnapshot;
}

function emitCartChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("cart-updated"));
}

function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const nextSnapshot = items.length > 0 ? items : emptyCart;
  const rawCart = JSON.stringify(nextSnapshot);

  cartSnapshot = nextSnapshot;
  cartSnapshotRaw = rawCart;
  window.localStorage.setItem(CART_STORAGE_KEY, rawCart);
  emitCartChange();
}

function subscribeToCart(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCartChange = () => listener();
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("cart-updated", handleCartChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("cart-updated", handleCartChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => emptyCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (product: Product) => {
    const currentItems = getCartSnapshot();
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (!existingItem) {
      writeStoredCart([...currentItems, { ...product, quantity: 1 }]);
      setIsCartOpen(true);
      return;
    }

    writeStoredCart(
      currentItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    );
    setIsCartOpen(true);
  };

  const removeItem = (productId: number) => {
    const currentItems = getCartSnapshot();
    const targetItem = currentItems.find((item) => item.id === productId);

    if (!targetItem) {
      return;
    }

    if (targetItem.quantity <= 1) {
      writeStoredCart(currentItems.filter((item) => item.id !== productId));
      return;
    }

    writeStoredCart(
      currentItems.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
    );
  };

  const deleteItem = (productId: number) => {
    writeStoredCart(getCartSnapshot().filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    writeStoredCart([]);
  };

  const itemCount = items.reduce((totalItems, item) => totalItems + item.quantity, 0);
  const total = items.reduce((cartTotal, item) => cartTotal + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isCartOpen,
        addItem,
        removeItem,
        deleteItem,
        clearCart,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe ser usado dentro en un CartProvider");
  }

  return context;
}
