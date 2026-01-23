import api from "@/app/api/api"

export type AuthCredentials = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export type AuthResponse = {
  accessToken: string
}

export async function login(credentials: Pick<AuthCredentials, "email" | "password">) {
  const response = await api.post<AuthResponse>("/auth/login", credentials)
  return response.data
}

export async function register(credentials: AuthCredentials) {
  const response = await api.post<AuthResponse>("/auth/register", credentials)
  return response.data
}