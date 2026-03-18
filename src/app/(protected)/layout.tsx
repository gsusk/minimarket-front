import React from 'react'
import AuthGuard from '../components/AuthGuard'
import Header from '../components/Header'
import SubNavbar from '../components/SubNavbar'
import Footer from '../components/Footer'

export default function ProtectedLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Header />
      <SubNavbar />
      {children}
      <Footer />
    </AuthGuard>
  )
}
