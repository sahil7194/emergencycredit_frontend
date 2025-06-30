// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type User = {
  id: number
  slug: string
  name: string
  email: string
  mobile: string
  type: string
  [key: string]: any
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>  // <-- add this
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  fetchUser: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user from token
  // const fetchUser = async () => {
  //   const token = localStorage.getItem('token')
  //   if (!token) {
  //     setUser(null)
  //     setLoading(false)
  //     return
  //   }

  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         Accept: 'application/json',
  //       },
  //     })

  //     if (!res.ok) {
  //       setUser(null)
  //     } else {
  //       const data = await res.json()
  //       setUser(data)
  //     }
  //   } catch {
  //     setUser(null)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    setUser(null)
    setLoading(false)
    return
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      // Token invalid or expired, remove it from localStorage
      localStorage.removeItem('token')
      setUser(null)
    } else {
      const data = await res.json()
      
      if(data.type == 1){

        localStorage.setItem("agent_slug", data.slug);
      }
      setUser(data)
    }
  } catch {
    // In case of network error or other issues, clear user and token
    localStorage.removeItem('token')
    setUser(null)
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

