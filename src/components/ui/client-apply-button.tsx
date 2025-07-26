'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { Label } from '@radix-ui/react-label'
import { InputError } from '../input-error'
import { Input } from './input'

interface Props {
  slug: string
  applyLink: string
}

export const ClientApplyButton = ({ slug, applyLink }: Props) => {
  const [tokenAvailable, setTokenAvailable] = useState(false)
  const [applying, setApplying] = useState(false)
  const searchParams = useSearchParams()
  const [vendorCode, setVendorCode] = useState('')

  const vendor = searchParams.get('vendor_code') ?? '';

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setTokenAvailable(true)
    }
  }, [])

  const handleApply = async () => {
    const token = localStorage.getItem('token')

    setApplying(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: slug,
          agent: vendorCode,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error(data)
        alert('Application failed.')
      } else {
        window.open(applyLink, '_blank') // open redirect link after successful apply
      }
    } catch (err) {
      console.error('Apply error:', err)
      alert('Something went wrong.')
    }

    setApplying(false)
  }

  if (!tokenAvailable) {
    return (
      <a href={`/login?ref=${slug}`} rel="noopener noreferrer">
        <Button className="w-full" variant="outline">
          Login
        </Button>
      </a>
    )
  }

  function handleChange(arg0: string, value: string): void {

    const updateCode = value ?? vendor;

    setVendorCode(updateCode)
  
  }

  return (
    <>
      <div className="flex flex-col gap-1 mb-3">
        <Input
          id="code"
          onBlur={(e) => handleChange('code', e.target.value)}
          placeholder='code'
        />
      </div>
      <Button className="w-full" variant="outline" onClick={handleApply} disabled={applying}>
        {applying ? 'Applying...' : 'Apply Now'}
      </Button>
    </>

  )
}
