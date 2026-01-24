import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import Header from "./components/Header";
import SubNavbar from "./components/SubNavbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADSO",
  description: "frontend para el proyecto de adso",
};
/**
 * 
 * TODO:
 * - Prevenir parpadeo al carga la pagina
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("ssssdd");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <Providers>
            <Header></Header>
            <SubNavbar></SubNavbar>
            {children}
            <Footer></Footer>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
