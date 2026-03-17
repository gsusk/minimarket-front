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
  currency: string;
  amount: number;
  status: string;
  orderId: string;
};

export async function processCheckout(body: CheckoutRequest): Promise<CreatePaymentResponse> {
  const response = await api.post<CreatePaymentResponse>("/checkout/initialize", body, {
    withCredentials: true,
  });

  return response.data;
}
