'use client'

import React, { useEffect, useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { LoaderCircle, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface Bank {
  name: string
  vendor_code: string
}

interface Scheme {
  id: number
  title: string
  summary: string
  app_url: string
  bank: Bank
}

export default function AgentReferSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchemes = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('User not authenticated')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/refer/schemes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        const data = await res.json()
        if (res.ok && data.success && Array.isArray(data.applications)) {
          setSchemes(data.applications)
        } else {
          toast.error(data.message || 'Failed to load schemes')
        }
      } catch (err) {
        console.error('Update error:', err);
        toast.error('Error fetching schemes')
      } finally {
        setLoading(false)
      }
    }

    fetchSchemes()
  }, [])

  const handleCopy = (scheme: Scheme) => {
    
    const vendor_code = localStorage.getItem('agent_slug');

    const referUrl = `${scheme.app_url}?vendor_code=${vendor_code}`
    navigator.clipboard.writeText(referUrl)
      .then(() => toast.success(`Copied ${scheme.title} scheme URL`))
      .catch(() => toast.error('Failed to copy URL'))
  }

  return (
    <AppLayout>
      <section className="px-4 py-10 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Refer Schemes</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoaderCircle className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-300" />
            </div>
          ) : schemes.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No schemes found.</p>
          ) : (
            <>
              {/* Mobile / Card view */}
              <div className="grid grid-cols-1 gap-6 sm:hidden">
                {schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 shadow-sm"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {scheme.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{scheme.summary}</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <strong>Bank:</strong> {scheme.bank.name}
                    </p>
                    <div className="mt-4 text-right">
                      <Button onClick={() => handleCopy(scheme)} variant="outline" className="gap-2">
                        <Copy className="w-4 h-4" />
                        Refer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table view for tablet & desktop */}
              <div className="hidden sm:block overflow-x-auto rounded-lg shadow ring-1 ring-black/5 dark:ring-white/10 mt-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      <th className="p-4">Title</th>
                      <th className="p-4">Summary</th>
                      <th className="p-4">Bank</th>
                      <th className="p-4 text-center">Refer</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {schemes.map((scheme) => (
                      <tr key={scheme.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white max-w-sm">{scheme.title}</td>
                        <td className="p-4 text-sm text-gray-700 dark:text-gray-300 max-w-md break-words">{scheme.summary}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{scheme.bank.name}</td>
                        <td className="p-4 text-center">
                          <Button onClick={() => handleCopy(scheme)} variant="outline" className="gap-2">
                            <Copy className="w-4 h-4" />
                            Refer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </AppLayout>
  )
}
