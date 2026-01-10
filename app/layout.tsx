import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Gauza Dev Portfolio - Exploring Code Beyond The Universe",
  description: "A personal portfolio highlighting innovative web applications, research projects, and digital solutions developed by Muhammad Gauza Faliha",
  icons: {
    icon: [
      {
        url: "/images/p.jpeg",
        type: "image/jpeg",
      },
    ],
    apple: "/images/p.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
