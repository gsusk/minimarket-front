"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useMe from "../api/user"
import { Box, CircularProgress, Container } from "@mui/material"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError, error } = useMe()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.push("/login")
    }
  }, [user, isLoading, isError, router])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Container maxWidth="lg" sx={{ minHeight: "100vh" }}></Container>
  }

  return <>{children}</>
}
