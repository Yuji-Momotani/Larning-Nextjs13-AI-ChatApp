import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from "@/context/AppContext"

export const metadata: Metadata = {
  title: 'ChatApplication-with-Chatgpt',
  description: 'demo opneAI use API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
				<AppProvider>{children}</AppProvider>
			</body>
    </html>
  )
}
