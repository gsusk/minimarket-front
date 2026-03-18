import api from "./api";
import { OrderSummary } from "./orders";
import { DetailedProduct, CategorySummary } from "./products";

export type CreateProductPayload = {
  name: string;
  description: string;
  brand: string;
  price: number;
  categoryId: number;
  stock: number;
  specifications: Record<string, string>;
  images: string[];
};

export type CreateCategoryPayload = {
  name: string;
  parentId?: number | null;
};

export type AdjustStockPayload = {
  quantity: number;
  reason: string;
};

export async function adminGetAllOrders(): Promise<OrderSummary[]> {
  const response = await api.get<OrderSummary[]>("/admin/orders", {
    withCredentials: true,
  });
  return response.data;
}

export async function adminCreateProduct(
  payload: CreateProductPayload
): Promise<void> {
  await api.post("/products", payload, { withCredentials: true });
}

export async function adminUpdateProduct(
  id: number,
  payload: CreateProductPayload
): Promise<void> {
  await api.put(`/products/${id}`, payload, { withCredentials: true });
}

export async function adminDeleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`, { withCredentials: true });
}

export async function adminGetProduct(id: number): Promise<DetailedProduct> {
  const response = await api.get<DetailedProduct>(`/products/${id}`);
  return response.data;
}

export async function adminAdjustStock(
  productId: number,
  payload: AdjustStockPayload
): Promise<void> {
  await api.post(`/admin/inventory/${productId}/adjust`, payload, {
    withCredentials: true,
  });
}

export async function adminCreateCategory(
  payload: CreateCategoryPayload
): Promise<CategorySummary> {
  const response = await api.post<CategorySummary>(
    "/admin/categories",
    payload,
    { withCredentials: true }
  );
  return response.data;
}

export async function getCategories(): Promise<CategorySummary[]> {
  const response = await api.get<CategorySummary[]>("/categories/featured");
  return response.data;
}
