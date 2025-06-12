// // src/app/layout.tsx
// import './globals.css'
// // import Header from '@/components/layouts/header'
// import Header from '@/layouts/header'
// import Footer from '@/layouts/footer'
// import { ReactNode } from 'react'

// export const metadata = {
//   title: 'Emergency Credit',
//   description: 'Check your eligibility for emergency credit'
// }

// export default function RootLayout({ children }: { children: ReactNode }) {
//   // TEMP: fake auth object for example
//   const auth = {
//     user: {
//       name: 'John Doe',
//       type: 0 // adjust type for different roles
//     }
//   }

//   return (
//     <html lang="en">
//       <body>
//         <Header auth={auth} />
//         <main className="pt-20 px-6">{children}</main>
//         <Footer/>
//       </body>
//     </html>
//   )
// }

// src/app/layout.tsx
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


