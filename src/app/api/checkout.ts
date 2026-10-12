import api from "./api";

export type CheckoutRequest = {
  shippingFullName: string;
  shippingAddressLine: string;
  shippingCity: string;
  shippingZipCode: string;
  shippingCountry: string;
};

export type CreatePaymentResponse = {
  paymentReference: string;
  clientSecret?: string;
  publishableKey?: string;
  currency: string;
  amount: number;
  status: string;
  orderId: string;
};

export type ConfirmPaymentRequest = {
  paymentMethodId?: string;
};

export async function processCheckout(body: CheckoutRequest): Promise<CreatePaymentResponse> {
  const response = await api.post<CreatePaymentResponse>("/checkout/initialize", body, {
    withCredentials: true,
  });

  return response.data;
}

export async function confirmOrderPayment(
  orderId: string,
  body?: ConfirmPaymentRequest
): Promise<CreatePaymentResponse> {
  const response = await api.post<CreatePaymentResponse>(
    `/orders/${orderId}/confirm-payment`,
    body || {},
    { withCredentials: true }
  );

  return response.data;
}

export async function getOrderPayment(orderId: string): Promise<CreatePaymentResponse> {
  const response = await api.get<CreatePaymentResponse>(`/orders/${orderId}/payment`, {
    withCredentials: true,
  });

  return response.data;
}
