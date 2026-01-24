import api from "@/app/api/api"

export type BasicUser = {
  id: number,
  firstName: string,
  lastName: string,
  email: string
}

export type UserProfile = {
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
  email: string,
  createdAt: Date
}

export async function userMe() {
  const response = await api.get<BasicUser>("/auth/login")
  return response.data
}