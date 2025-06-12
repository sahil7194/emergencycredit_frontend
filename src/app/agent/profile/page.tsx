'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'

const AgentProfilePage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.data)
        } else {
          localStorage.removeItem('token')
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch profile', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    )
  }

  if (!user) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-300">No user data found.</div>
  }

  return (
    <AppLayout>
      <motion.div
        className="w-full max-w-5xl mx-auto p-4 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
      >
        <Card className="shadow-2xl rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-800">
          <CardContent className="p-8 space-y-10">

            {/* Basic Info */}
            <section>
              <h2 className="text-4xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                👤 Agent Basic Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Name', value: user.name },
                  { label: 'Email', value: user.email },
                  { label: 'Mobile Number', value: user.mobile },
                  { label: 'Gender', value: user.gender },
                  { label: 'Date of Birth', value: user.date_of_birth },
                ].map((item, idx) => (
                  <div key={idx} className="min-w-0 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">{item.label}</Label>
                    <p className="mt-1 text-base font-medium text-gray-800 dark:text-gray-100 break-words">
                      {item.value || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Address Info */}
            <section>
              <h2 className="text-4xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                🏠 Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.address ? (
                  [
                    { label: 'Address', value: user.address.address },
                    { label: 'City', value: user.address.city?.name },
                    { label: 'State', value: user.address.state?.name },
                    { label: 'Pincode', value: user.address.pin_code }
                  ].map((item, idx) => (
                    <div key={idx} className="min-w-0 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <Label className="text-sm text-gray-600 dark:text-gray-400">{item.label}</Label>
                      <p className="mt-1 text-base font-medium text-gray-800 dark:text-gray-100 break-words">
                        {item.value || 'N/A'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">No address available</p>
                )}
              </div>
            </section>
          </CardContent>

          <CardFooter className="flex justify-center p-8">
            <Button
              variant="outline"
              className="w-full sm:w-1/3 py-3 text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => router.push('/agent/edit-profile')}
            >
              ✏️ Edit Profile
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AppLayout>
  )
}

export default AgentProfilePage
