// 'use client'

// import React, { useEffect } from 'react'
// import '@fontsource/poppins/700.css'
// import { Button } from '@/components/ui/button'
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
// import { Menu, ShieldCheck } from 'lucide-react'
// import ThemeToggle from '@/components/theme-toggle';
// import { useRouter } from 'next/navigation'

// const Header = ({ auth }: { auth: any }) => {
//    const router = useRouter()
//   let navLinks = [
//     { href: '/check-cibil', label: 'Check Cibil' },
//     { href: '/blogs', label: 'Blogs' },
//     { href: '/schemes', label: 'Schemes' },
//   ]

//   if (!auth) {
//     navLinks = navLinks.concat([{ href: '/', label: 'Home' }])
//   }

//   if (auth?.user) {
//     if (auth.user.type === 0) {
//       navLinks.unshift({ href: '/user/home', label: 'Home' })
//       navLinks = navLinks.concat([
//         { href: '/user/profile', label: 'Profile' },
//         { href: '/user/application-history', label: 'Application History' },
//       ])
//     } else if (auth.user.type === 1) {
//       navLinks = [
//         { href: '/agent/home', label: 'Home' },
//         { href: '/blogs', label: 'Blogs' },
//         { href: '/schemes', label: 'Schemes' },
//         { href: '/agent/refer/schemes', label: 'Refer Schemes' },
//         { href: '/agent/reference-history', label: 'Reference History' },
//         { href: '/agent/profile', label: 'Profile' },
//       ]
//     } else if (auth.user.type === 2) {
//       navLinks = [
//         { href: '/crm/home', label: 'Home' },
//         { href: '/crm/users', label: 'Users' },
//         { href: '/crm/schemes', label: 'Schemes' },
//         { href: '/crm/blog', label: 'Blogs' },
//         { href: '/crm/bank', label: 'Banks' },
//         { href: '/crm/application-history', label: 'Application History' },
//         { href: '/crm/cibil-log', label: 'Cibil Log' },
//         { href: '/crm/profile', label: 'Profile' },
//       ]
//     }
//   }

//  const logout = async () => {
//   const token = localStorage.getItem('token');

//   if (token) {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
//         method: 'POST', // or 'DELETE' if your API uses DELETE for logout
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!res.ok) {
//         console.error('Logout API call failed');
//         // Optionally show a toast or alert to the user
//       }
//     } catch (error) {
//       console.error('Logout API error:', error);
//     }
//   }

//   // Clear local token and redirect no matter what
//   localStorage.removeItem('token');
//   router.push('/login');
// }


//   return (
//     <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-md overflow-x-hidden">
//       <div className="container max-w-full mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
//         <div className="flex items-center gap-6 md:gap-10 min-w-0">
//           <a href="/" className="flex items-center space-x-2 min-w-0">
//             <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
//             <span
//               className="text-primary text-xl font-bold tracking-tight break-words min-w-0"
//               style={{ fontFamily: "'Poppins', sans-serif" }}
//             >
//               Emergency<span className="text-blue-600">Credits</span>
//             </span>
//           </a>

//           {/* Horizontal nav only visible from lg and above */}
//           <nav className="hidden lg:flex md:items-center md:gap-6 lg:gap-8 xl:gap-10 min-w-0">
//             {navLinks.map((link) => (
//               <a
//                 key={link.href}
//                 href={link.href}
//                 className="hover:text-primary/80 focus:text-primary text-sm font-medium whitespace-nowrap"
//               >
//                 {link.label}
//               </a>
//             ))}
//           </nav>
//         </div>

//         <div className="flex items-center gap-4 min-w-0">
//           <ThemeToggle />
//           {/* Auth buttons visible from lg and above */}
//           <div className="hidden lg:flex items-center gap-3 lg:gap-4 min-w-0">
//             {auth?.user ? (
//               <>
                
//                 <Button variant="outline" className="min-w-[100px] truncate">
//                   {auth.user.name}
//                 </Button>

//                 <Button variant="outline" onClick={logout}>
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button variant="outline" asChild>
//                   <a href="/login">Sign In</a>
//                 </Button>
//                 <Button asChild>
//                   <a href="/signup">Signup</a>
//                 </Button>
//               </>
//             )}
//           </div>

//           {/* Hamburger menu visible below lg */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="flex flex-col gap-6 p-6">
//               <SheetHeader className="px-4 pt-4 pb-2">
//                 <SheetTitle className="text-base">Menu</SheetTitle>
//               </SheetHeader>

//               <nav className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
//                 {navLinks.map((link) => (
//                   <a
//                     key={link.href}
//                     href={link.href}
//                     className="hover:text-primary text-sm font-medium whitespace-nowrap"
//                   >
//                     {link.label}
//                   </a>
//                 ))}
//               </nav>

//               {auth?.user && (
//                 <div className="mt-auto flex flex-col gap-3 lg:hidden">
//                   <Button variant="outline" className="w-full" disabled>
//                     {auth.user.name}
//                   </Button>
//                   <Button variant="outline" className="w-full" onClick={logout}>
//                     Logout
//                   </Button>
//                 </div>
//               )}
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header








// 'use client'

// import React from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet'
// import { Menu, ShieldCheck } from 'lucide-react'
// import ThemeToggle from '@/components/theme-toggle'
// import { useAuth } from '@/context/AuthContext'
// import '@fontsource/poppins/700.css'

// const Header = () => {
//   const { user,loading } = useAuth()
//   const pathname = usePathname()
//   const router = useRouter()

//   let navLinks = [
//     { href: '/check-cibil', label: 'Check Cibil' },
//     { href: '/blogs', label: 'Blogs' },
//     { href: '/schemes', label: 'Schemes' },
//   ]

//   if (user) {
//     if (user.type === '0') {
//       navLinks = [
//         { href: '/user/home', label: 'Home' },
//         ...navLinks,
//         { href: '/user/profile', label: 'Profile' },
//         { href: '/user/application-history', label: 'Application History' },
//       ]
//     } else if (user.type === '1') {
//       navLinks = [
//         { href: '/agent/home', label: 'Home' },
//         { href: '/blogs', label: 'Blogs' },
//         { href: '/schemes', label: 'Schemes' },
//         { href: '/agent/refer/schemes', label: 'Refer Schemes' },
//         { href: '/agent/reference-history', label: 'Reference History' },
//         { href: '/agent/profile', label: 'Profile' },
//       ]
//     } else if (user.type === '2') {
//       navLinks = [
//         { href: '/crm/home', label: 'Home' },
//         { href: '/crm/users', label: 'Users' },
//         { href: '/crm/schemes', label: 'Schemes' },
//         { href: '/crm/blog', label: 'Blogs' },
//         { href: '/crm/bank', label: 'Banks' },
//         { href: '/crm/application-history', label: 'Application History' },
//         { href: '/crm/cibil-log', label: 'Cibil Log' },
//         { href: '/crm/profile', label: 'Profile' },
//       ]
//     }
//   }

//   const isActive = (href: string) => pathname === href

//   const logout = async () => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       try {
//         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         })
//       } catch (error) {
//         console.error('Logout error:', error)
//       }
//     }
//     localStorage.removeItem('token')
//     router.push('/login')
//   }

//   return (
//     <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-md overflow-x-hidden">
//       <div className="container max-w-full mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20">
//         {/* Logo */}
//         <div className="flex items-center gap-6 md:gap-10">
//           <Link href="/" className="flex items-center space-x-2">
//             <ShieldCheck className="w-5 h-5 text-blue-600" />
//             <span
//               className="text-primary text-xl font-bold tracking-tight"
//               style={{ fontFamily: "'Poppins', sans-serif" }}
//             >
//               Emergency<span className="text-blue-600">Credits</span>
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden lg:flex gap-6">
//             {navLinks.map(({ href, label }) => (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`text-sm font-medium whitespace-nowrap hover:text-primary/80 ${
//                   isActive(href) ? 'text-primary font-semibold' : ''
//                 }`}
//               >
//                 {label}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-4">
//           <ThemeToggle />

//           {/* Desktop Auth Buttons */}
//           <div className="hidden lg:flex items-center gap-4">
//             {user ? (
//               <>
//                 <Button variant="outline" className="min-w-[100px] truncate">
//                   {user.name}
//                 </Button>
//                 <Button variant="outline" onClick={logout}>
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button variant="outline" asChild>
//                   <Link href="/login">Sign In</Link>
//                 </Button>
//                 <Button asChild>
//                   <Link href="/signup">Signup</Link>
//                 </Button>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="flex flex-col gap-6 p-6">
//               <SheetHeader className="px-4 pt-4 pb-2">
//                 <SheetTitle className="text-base">Menu</SheetTitle>
//               </SheetHeader>

//               <nav className="flex flex-col gap-4 overflow-y-auto">
//                 {navLinks.map(({ href, label }) => (
//                   <Link
//                     key={href}
//                     href={href}
//                     className={`text-sm font-medium whitespace-nowrap hover:text-primary ${
//                       isActive(href) ? 'text-primary font-semibold' : ''
//                     }`}
//                   >
//                     {label}
//                   </Link>
//                 ))}
//               </nav>

//               {user && (
//                 <div className="mt-auto flex flex-col gap-3 lg:hidden">
//                   <Button variant="outline" className="w-full" disabled>
//                     {user.name}
//                   </Button>
//                   <Button variant="outline" className="w-full" onClick={logout}>
//                     Logout
//                   </Button>
//                 </div>
//               )}
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header
























































// 'use client'

// import React from 'react'
// import '@fontsource/poppins/700.css'
// import { Button } from '@/components/ui/button'
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
// import { Menu, ShieldCheck } from 'lucide-react'
// import ThemeToggle from '@/components/theme-toggle'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/context/AuthContext'
// import Link from 'next/link'

// const Header = () => {
//   const { user, loading } = useAuth()
//   const router = useRouter()
//   const { setUser } = useAuth()

//   if (loading) {
//   return (
//     <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-md overflow-x-hidden">
//       <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20">
//         <span className="text-sm text-muted-foreground">Loading...</span>
//       </div>
//     </header>
//   )
// }


//   let navLinks = [
//     { href: '/check-cibil', label: 'Check Cibil' },
//     { href: '/blogs', label: 'Blogs' },
//     { href: '/schemes', label: 'Schemes' },
//   ]

//   if (user?.type === '0') {
//     navLinks.unshift({ href: '/user/home', label: 'Home' })
//     navLinks = navLinks.concat([
//       { href: '/user/profile', label: 'Profile' },
//       { href: '/user/application-history', label: 'Application History' },
//     ])
//   } else if (user?.type === '1') {
//     navLinks = [
//       { href: '/agent/home', label: 'Home' },
//       { href: '/blogs', label: 'Blogs' },
//       { href: '/schemes', label: 'Schemes' },
//       { href: '/agent/refer/schemes', label: 'Refer Schemes' },
//       { href: '/agent/reference-history', label: 'Reference History' },
//       { href: '/agent/profile', label: 'Profile' },
//     ]
//   } else if (user?.type === '2') {
//     navLinks = [
//       { href: '/crm/home', label: 'Home' },
//       { href: '/crm/users', label: 'Users' },
//       { href: '/crm/schemes', label: 'Schemes' },
//       { href: '/crm/blog', label: 'Blogs' },
//       { href: '/crm/bank', label: 'Banks' },
//       { href: '/crm/application-history', label: 'Application History' },
//       { href: '/crm/cibil-log', label: 'Cibil Log' },
//       { href: '/crm/profile', label: 'Profile' },
//     ]
//   }

//   const logout = async () => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (!res.ok) {
//         console.error('Logout API call failed')
//       }
//     } catch (error) {
//       console.error('Logout API error:', error)
//     }
//   }

//   localStorage.removeItem('token')
//   setUser(null) // <-- clear user state immediately
//   router.push('/login')
// }

//   return (
//     <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-md overflow-x-hidden">
//       <div className="container max-w-full mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
//         <div className="flex items-center gap-6 md:gap-10 min-w-0">
//           <Link href="/" className="flex items-center space-x-2 min-w-0">
//             <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
//             <span
//               className="text-primary text-xl font-bold tracking-tight break-words min-w-0"
//               style={{ fontFamily: "'Poppins', sans-serif" }}
//             >
//               Emergency<span className="text-blue-600">Credits</span>
//             </span>
//           </Link>

//           {/* <nav className="hidden lg:flex md:items-center md:gap-6 lg:gap-8 xl:gap-10 min-w-0"> */}
//           <nav className="hidden lg:flex items-center gap-5 min-w-0">

//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="hover:text-primary/80 focus:text-primary text-sm font-medium whitespace-nowrap"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <div className="flex items-center gap-4 min-w-0">
//           <ThemeToggle />

//           <div className="hidden lg:flex items-center gap-3 lg:gap-4 min-w-0">
//             {user ? (
//               <>
//                 <Button variant="outline" className="min-w-[100px] truncate">
//                   {user.name}
//                 </Button>
//                 <Button variant="outline" onClick={logout}>
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button variant="outline" asChild>
//                   <Link href="/login">Sign In</Link>
//                 </Button>
//                 <Button asChild>
//                   <Link href="/signup">Signup</Link>
//                 </Button>
//               </>
//             )}
//           </div>

//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="lg:hidden"
//                 aria-label="Open menu"
//               >
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="flex flex-col gap-6 p-6">
//               <SheetHeader className="px-4 pt-4 pb-2">
//                 <SheetTitle className="text-base">Menu</SheetTitle>
//               </SheetHeader>

//               <nav className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className="hover:text-primary text-sm font-medium whitespace-nowrap"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </nav>

//               {user && (
//                 <div className="mt-auto flex flex-col gap-3 lg:hidden">
//                   <Button variant="outline" className="w-full" disabled>
//                     {user.name}
//                   </Button>
//                   <Button variant="outline" className="w-full" onClick={logout}>
//                     Logout
//                   </Button>
//                 </div>
//               )}
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header







'use client'

import React from 'react'
import '@fontsource/poppins/700.css'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu, ShieldCheck } from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

const Header = () => {
  const { user, loading, setUser } = useAuth()
  const router = useRouter()

  const logout = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) console.error('Logout API call failed')
      } catch (error) {
        console.error('Logout API error:', error)
      }
    }

    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  // While loading user info (after refresh, etc.)
 if (loading) {
  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-md overflow-x-hidden">
      <div className="container max-w-full mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
        <div className="flex items-center gap-6 md:gap-10 min-w-0">
          <div className="w-24 h-6 rounded bg-gray-300 animate-pulse dark:bg-gray-700" />
        </div>
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-32 h-8 rounded bg-gray-300 animate-pulse dark:bg-gray-700" />
        </div>
      </div>
    </header>
  )
}


  // Navigation based on user type
  let navLinks = [
    { href: '/check-cibil', label: 'Check Cibil' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/schemes', label: 'Schemes' },
  ]

  if (user?.type === '0') {
    navLinks.unshift({ href: '/user/home', label: 'Home' })
    navLinks = navLinks.concat([
      // { href: '/user/profile', label: 'Profile' },
      { href: '/user/application-history', label: 'Application History' },
    ])
  } else if (user?.type === '1') {
    navLinks = [
      { href: '/agent/home', label: 'Home' },
      { href: '/blogs', label: 'Blogs' },
      { href: '/schemes', label: 'Schemes' },
      { href: '/agent/refer-schemes', label: 'Refer Schemes' },
      { href: '/agent/reference-history', label: 'Reference History' },
      // { href: '/agent/profile', label: 'Profile' },
    ]
  } else if (user?.type === '2') {
    navLinks = [
      { href: '/crm/home', label: 'Home' },
      { href: '/crm/user', label: 'Users' },
      { href: '/crm/schemes', label: 'Schemes' },
      { href: '/crm/blogs', label: 'Blogs' },
      { href: '/crm/bank', label: 'Banks' },
      { href: '/crm/application-history', label: 'Application History' },
      { href: '/crm/cibil-log', label: 'Cibil Log' },
      // { href: '/crm/profile', label: 'Profile' },
    ]
  }

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-md overflow-x-hidden">
      <div className="container max-w-full mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
        <div className="flex items-center gap-6 md:gap-10 min-w-0">
          <Link href="/" className="flex items-center space-x-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span
              className="text-primary text-xl font-bold tracking-tight break-words min-w-0"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Emergency<span className="text-blue-600">Credits</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary/80 focus:text-primary text-sm font-medium whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 min-w-0">
          <ThemeToggle />

          <div className="hidden lg:flex items-center gap-3 lg:gap-4 min-w-0">
            {user ? (
              <>
                {/* <Button variant="outline" className="min-w-[100px] truncate">
                  {user.name}
                </Button> */}
               <Link
  href={
    user?.type === '0'
      ? '/user/profile'
      : user?.type === '1'
      ? '/agent/profile'
      : user?.type === '2'
      ? '/crm/profile'
      : '#'
  }
>
  <Button
    variant="outline"
    className="min-w-[100px] max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap"
    title={user.name}
  >
    {user.name}
  </Button>
</Link>


             <Button
  onClick={logout}
  className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 flex items-center gap-2"
>
  <LogOut className="w-4 h-4" />
  Logout
</Button>

              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Signup</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6 p-6">
              <SheetHeader className="px-4 pt-4 pb-2">
                <SheetTitle className="text-base">Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-primary text-sm font-medium whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {!user && (
  <div className="flex flex-col gap-3 lg:hidden">
    <Button variant="outline" asChild className="w-full">
      <Link href="/login">Sign In</Link>
    </Button>
    <Button asChild className="w-full">
      <Link href="/signup">Signup</Link>
    </Button>
  </div>
)}


              {user && (
                <div className="mt-auto flex flex-col gap-3 lg:hidden">
                  {/* <Button variant="outline" className="w-full" disabled>
                    {user.name}
                  </Button> */}
                <Link
  href={
    user?.type === '0'
      ? '/user/profile'
      : user?.type === '1'
      ? '/agent/profile'
      : user?.type === '2'
      ? '/crm/profile'
      : '#'
  }
>
  <Button
    variant="outline"
    className="w-full max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap"
    title={user.name}
  >
    {user.name}
  </Button>
</Link>


                <Button
  className="w-full border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 flex items-center justify-center gap-2"
  onClick={logout}
>
  <LogOut className="w-4 h-4" />
  Logout
</Button>

                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
















