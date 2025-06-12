'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// import { Label } from '@radix-ui/react-dropdown-menu'
import { Label } from '@/components/ui/label'
import { LoaderCircle } from 'lucide-react'
import React, { useState, FormEvent, Suspense } from 'react'

interface State {
  id: number
  name: string
}

interface City {
  id: number
  name: string
}

const CibilCheckPage = () => {
  const [processing, setProcessing] = useState(false)
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [data, setData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    pan_card_number: '',
    mobile: '',
    email: '',
    address: '',
    pin_code: '',
    state_id: '',
    city_id: '',
  })

  // Fetch states and cities on mount
  React.useEffect(() => {
    // Replace with your actual API endpoints
    const fetchStates = async () => {
      try {
        const res = await fetch('/api/states')
        if (res.ok) {
          const json = await res.json()
          setStates(json.data || [])
        }
      } catch {
        setStates([])
      }
    }
    const fetchCities = async () => {
      try {
        const res = await fetch('/api/cities')
        if (res.ok) {
          const json = await res.json()
          setCities(json.data || [])
        }
      } catch {
        setCities([])
      }
    }
    fetchStates()
    fetchCities()
  }, [])

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // Replace with your API POST endpoint
      const res = await fetch('/api/cibil-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Submission failed')
      setData({
        full_name: '',
        date_of_birth: '',
        gender: '',
        pan_card_number: '',
        mobile: '',
        email: '',
        address: '',
        pin_code: '',
        state_id: '',
        city_id: '',
      })
    } catch (error) {
      console.error(error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>CIBIL Check</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={data.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                  placeholder="Jon Doe"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={data.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  className="border-input h-9 w-full rounded-md border px-3 py-1"
                  value={data.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label>PAN Card Number</Label>
                <Input
                  value={data.pan_card_number}
                  onChange={(e) => handleChange('pan_card_number', e.target.value)}
                  required
                  placeholder="ABCDE1234F"
                />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input
                  value={data.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  required
                  placeholder="7083736757"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Address</Label>
                <textarea
                  className="w-full h-24 p-2 border border-gray-300 rounded-md"
                  value={data.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Pin Code</Label>
                <Input
                  value={data.pin_code}
                  onChange={(e) => handleChange('pin_code', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>State</Label>
                <select
                  className="border-input h-9 w-full rounded-md border px-3 py-1"
                  value={data.state_id}
                  onChange={(e) => handleChange('state_id', e.target.value)}
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>City</Label>
                <select
                  className="border-input h-9 w-full rounded-md border px-3 py-1"
                  value={data.city_id}
                  onChange={(e) => handleChange('city_id', e.target.value)}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="mt-4 w-48" disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                Save
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </Suspense>
  )
}

export default CibilCheckPage
