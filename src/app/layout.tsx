import './globals.css'
import Header from '@/layouts/header'
import Footer from '@/layouts/footer'
import { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Emergency Credit',
  description: 'Check your eligibility for emergency credit'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="pt-20 px-6">{children}
            <Toaster position="top-right" reverseOrder={false} />
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}


