import api from "@/app/api/api"
import { useQuery } from "@tanstack/react-query"

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
  const response = await api.get<BasicUser>("/user/me")
  return response.data
}

export default function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: userMe, staleTime: 30_000, retry: false })
}