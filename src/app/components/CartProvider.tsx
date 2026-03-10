"use client";

import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../api/products";
import {
  addCartItem,
  deleteCartItem,
  emptyCart,
  getCartProducts,
  ShoppingCart,
  ShoppingCartItem,
  updateCartItemQuantity,
} from "../api/cart";

type CartProductInput = Product | Pick<ShoppingCartItem, "productId">;

type CartContextValue = {
  items: ShoppingCartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;
  isLoading: boolean;
  addItem: (product: CartProductInput) => void;
  removeItem: (productId: number) => void;
  deleteItem: (productId: number) => void;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
};

export const CART_QUERY_KEY = ["cart"] as const;

const CartContext = createContext<CartContextValue | null>(null);

function toNumber(value: string): number {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function getProductId(product: CartProductInput): number {
  return "id" in product ? product.id : product.productId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: cart = emptyCart, isLoading: isCartLoading, isFetching: isCartFetching } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartProducts,
    staleTime: 30_000,
  });

  const setCartCache = (nextCart: ShoppingCart) => {
    queryClient.setQueryData(CART_QUERY_KEY, nextCart);
  };

  const addItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      addCartItem({ productId, quantity }),
    onSuccess: (nextCart) => {
      setCartCache(nextCart);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      updateCartItemQuantity(productId, { quantity }),
    onSuccess: (nextCart) => {
      setCartCache(nextCart);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: (nextCart) => {
      setCartCache(nextCart);
    },
  });

  const addItem = (product: CartProductInput) => {
    const productId = getProductId(product);
    setIsCartOpen(true);
    addItemMutation.mutate({ productId, quantity: 1 });
  };

  const removeItem = (productId: number) => {
    const currentItem = cart.shoppingCartItems.find((item) => item.productId === productId);

    if (!currentItem) {
      return;
    }

    if (currentItem.quantity <= 1) {
      deleteItemMutation.mutate(productId);
      return;
    }

    updateItemMutation.mutate({ productId, quantity: currentItem.quantity - 1 });
  };

  const deleteItem = (productId: number) => {
    deleteItemMutation.mutate(productId);
  };

  const clearCart = async () => {
    for (const item of cart.shoppingCartItems) {
      await deleteItemMutation.mutateAsync(item.productId);
    }
  };

  const itemCount = cart.shoppingCartItems.reduce((count, item) => count + item.quantity, 0);
  const total = toNumber(cart.subTotal);

  return (
    <CartContext.Provider
      value={{
        items: cart.shoppingCartItems,
        itemCount,
        total,
        isCartOpen,
        isLoading: isCartLoading || (isCartFetching && cart.shoppingCartItems.length === 0),
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
