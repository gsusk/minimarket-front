import api from "./api";

export type OrderDetails = {
  id: string;
  email: string;
  userId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
};

export type OrderItemSummary = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
};

export type OrderSummary = {
  orderId: string;
  userId: number;
  email: string;
  status: string;
  totalAmount: number;
  items: OrderItemSummary[];
  createdAt: string;
};

export async function placeOrder(): Promise<OrderDetails> {
  const response = await api.post<OrderDetails>("/orders", undefined, {
    withCredentials: true,
  });

  return response.data;
}

export async function getOrderDetails(orderId: string): Promise<OrderSummary> {
  const response = await api.get<OrderSummary>(`/orders/${orderId}`, {
    withCredentials: true,
  });

  return response.data;
}
