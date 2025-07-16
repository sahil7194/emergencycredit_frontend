'use client'

import React, { useState, FormEvent, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { LoaderCircle } from 'lucide-react'
import { InputError } from '@/components/input-error'
import AppLayout from '@/layouts/app-layout'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const logo = {
  url: '/',
  src: '/images/shadcnblockscom-icon.svg',
  alt: 'Shadcnblocks',
}

const Login = () => {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { fetchUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/user')
    }
  }, [router])

  if (!mounted) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    const redirectUrl =  searchParams.get('ref') ? 'schemes/' + searchParams.get('ref') : '/user';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      })

      const data = await res.json()
      console.log('Login response:', data)

      if (!res.ok || !data.token) {
        setErrors(data.errors || { email: 'Invalid credentials' })
      } else {
        localStorage.setItem('token', data.token)
        await fetchUser()

        const userType = Number(data.user?.type)

        if (userType === 0) {
          router.push(redirectUrl)
        } else if (userType === 2) {
          router.push('/crm')
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Update error:', error)
      setErrors({ email: 'Something went wrong. Try again.' })
    }

    setProcessing(false)
  }

  return (
    <AppLayout>
      <Head>
        <title>Login</title>
      </Head>

      <section className="py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-sm rounded-md p-6 shadow md:max-w-md lg:max-w-lg">
              <div className="mb-6 flex flex-col items-center">
                <a href={logo.url} className="mb-6 flex items-center gap-2">
                  <div className="text-black dark:text-white w-8 h-8">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        d="M12 2L20 6V12C20 16.97 16.42 21.63 12 22C7.58 21.63 4 16.97 4 12V6L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        fill="none"
                      />
                      <path
                        d="M9 12L11 14L15 10"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <text
                        x="12"
                        y="19.5"
                        fontSize="8"
                        fill="currentColor"
                        fontFamily="Arial"
                        textAnchor="middle"
                      >
                        ₹
                      </text>
                    </svg>
                  </div>
                </a>
                <h1 className="text-xl font-bold md:text-2xl">Login</h1>
                <p className="text-muted-foreground">Welcome back</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="email" className="mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      tabIndex={1}
                      autoComplete="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputError message={errors.email} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label htmlFor="password" className="mb-2 block">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      tabIndex={2}
                      autoComplete="current-password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputError message={errors.password} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onClick={() => setRemember(!remember)}
                        tabIndex={3}
                        className="border-muted-foreground"
                      />
                      <label
                        htmlFor="remember"
                        className="cursor-pointer text-sm leading-none font-medium"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/forget-password"
                      className="text-primary text-sm hover:underline"
                    >
                      Forgot password
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="mt-4 w-full border rounded-md bg-black text-white"
                    tabIndex={4}
                    disabled={processing}
                  >
                    {processing && (
                      <LoaderCircle className="mr-2 inline-block h-4 w-4 animate-spin" />
                    )}
                    Log in
                  </Button>
                </div>
              </form>

              <div className="text-muted-foreground mt-8 flex justify-center gap-1 text-sm">
                <p>{`Don't have an account?`}</p>
                <Link href="/signup" className="text-primary font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default Login
