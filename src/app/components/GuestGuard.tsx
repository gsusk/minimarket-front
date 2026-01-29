"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useMe from "../api/user"
import { Box, CircularProgress, Container } from "@mui/material"

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useMe()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (user) {
    return <Container maxWidth="lg" sx={{ minHeight: "100vh" }}></Container>
  }

  return <>{children}</>
}
