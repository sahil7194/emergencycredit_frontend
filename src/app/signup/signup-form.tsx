'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle } from 'lucide-react'
import { InputError } from '@/components/input-error'
import AppLayout from '@/layouts/app-layout'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const [mounted, setMounted] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/user')
    }
    setMounted(true);
  }, []);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    type: 0,  // <-- added here
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [processing, setProcessing] = useState(false)

  if (!mounted) return null

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }


  const validateEmail  = async (email: string) =>{
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/validate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({email:email}),
      })

      console.log('Response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        
        if(!data.success){

           setErrors({ email: 'This email ID is already registered.' })
        }
    
        
      }
      
    } catch (err) {
      console.error('Update error:', err);
      setErrors({ email: 'Something went wrong. Please try again.' })
    }
    console.log(email+"validate email");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      })

      console.log('Response status:', res.status);
      if (!res.ok) {
        const data = await res.json();
        console.log('Error response:', data);
        setErrors(data.errors || { email: 'Signup failed' });
      }
      else {
        router.push('/login')
      }
    } catch (err) {
      console.error('Update error:', err);
      setErrors({ email: 'Something went wrong. Please try again.' })
    }

    setProcessing(false)
  }

  return (
    <AppLayout>
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-sm rounded-md p-6 shadow md:max-w-md lg:max-w-lg">
              <div className="mb-6 flex flex-col items-center">
                <a
                  href="https://www.shadcnblocks.com"
                  className="mb-6 flex items-center gap-2"
                >
                  {/* // eslint-disable-next-line @next/next/no-img-element */}
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
                <h1 className="text-xl font-bold md:text-2xl">Signup</h1>
                <p className="text-muted-foreground">Create a new account</p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Jon Doe"
                    required
                    autoComplete="name"
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    value={form.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="9999999999"
                    required
                    autoComplete="tel"
                  />
                  <InputError message={errors.mobile} />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                    required
                    type="email"
                    autoComplete="email"
                    onBlur={(e) => { validateEmail(e.target.value)}}
                  />
                  <InputError message={errors.email} />
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Password"
                    required
                    type="password"
                    autoComplete="new-password"
                  />
                  <InputError message={errors.password} />
                </div>

                <Button type="submit" className="mt-4 w-full bg-black rounded-md text-white border" disabled={processing}>
                  {processing && <LoaderCircle className="mr-2 inline-block h-4 w-4 animate-spin" />}
                  Create an account
                </Button>
              </form>

              <div className="text-muted-foreground mt-8 flex justify-center gap-1 text-sm">
                <p>Already have an account?</p>
                <Link href="/login" className="text-primary font-medium">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}
