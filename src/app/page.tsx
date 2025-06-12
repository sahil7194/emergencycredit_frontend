// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function Home() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   useEffect(() => {
//     // Simple token check in localStorage to simulate login state
//     const token = localStorage.getItem('token')
//     if (token) {
//       setIsLoggedIn(true)
//       router.replace('/user') // redirect logged in users to dashboard
//     } else {
//       setIsLoggedIn(false)
//     }
//     setLoading(false)
//   }, [router])

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark">
//         <p className="text-lg">Loading...</p>
//       </div>
//     )
//   }

//   if (isLoggedIn) {
//     // While router.replace runs, just don't render anything or show a spinner
//     return null
//   }

//   return (
//     <main className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       <div className="max-w-xl w-full space-y-8 text-center">
//         <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//           Welcome to YourAppName
//         </h1>
//         <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
//           Your gateway to managing your account efficiently and securely.
//         </p>
//         <div className="flex justify-center gap-6 flex-wrap">
//           <Link
//             href="/login"
//             className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition"
//           >
//             Login
//           </Link>
//           <Link
//             href="/signup"
//             className="px-6 py-3 rounded-md border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 font-semibold transition"
//           >
//             Signup
//           </Link>
//         </div>
//       </div>
//     </main>
//   )
// }

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Emergency Credit Instantly
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Check your CIBIL score and apply for instant credit based on your profile. Fast, secure, and hassle-free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
            <Link href="/cibil-check">
              <Button className="text-white bg-white/10 hover:bg-white/20">Check CIBIL</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">1. Check Your CIBIL</h3>
                <p>Get your credit score instantly with just a few details.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">2. Apply for Credit</h3>
                <p>Based on your score, apply for suitable emergency credit schemes.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">3. Get Approval</h3>
                <p>Track your application and receive funds quickly and securely.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Why Emergency Credit?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Emergencies don’t wait. We make credit fast, simple, and transparent.
          </p>
          <Link href="/schemes">
            <Button size="lg">Explore Schemes</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}



