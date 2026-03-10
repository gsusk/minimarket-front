import api from "./api";

export type ShoppingCartItem = {
  productId: number;
  name: string;
  unitPrice: string;
  quantity: number;
};

export type ShoppingCart = {
  shoppingCartItems: ShoppingCartItem[];
  subTotal: string;
  size: number;
};

export type AddCartItemRequest = {
  productId: number;
  quantity: number;
};

export type UpdateCartItemQuantityRequest = {
  quantity: number;
};

export const emptyCart: ShoppingCart = {
  shoppingCartItems: [],
  subTotal: "0",
  size: 0,
};

export async function getCartProducts(): Promise<ShoppingCart> {
  const response = await api.get<ShoppingCart>("/cart", {
    withCredentials: true,
    validateStatus: (status) => status === 200 || status === 404,
  });

  return response.status === 404 ? emptyCart : response.data;
}

export async function addCartItem(body: AddCartItemRequest): Promise<ShoppingCart> {
  const response = await api.post<ShoppingCart>("/cart/items", body, {
    withCredentials: true,
  });

  return response.data;
}

export async function updateCartItemQuantity(
  productId: number,
  body: UpdateCartItemQuantityRequest
): Promise<ShoppingCart> {
  const response = await api.put<ShoppingCart>(`/cart/items/${productId}`, body, {
    withCredentials: true,
  });

  return response.data;
}

export async function deleteCartItem(productId: number): Promise<ShoppingCart> {
  const response = await api.delete<ShoppingCart>(`/cart/items/${productId}`, {
    withCredentials: true,
  });

  return response.data;
}
