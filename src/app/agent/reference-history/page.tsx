'use client'

import React, { useEffect, useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { LoaderCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Application {
  id: number
  application_id: string
  status: string
  remarks: string
  created_at: string
  updated_at: string
  applicant: {
    name: string
  }
  scheme: {
    title: string
    bank: {
      name: string
    }
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function AgentReferenceHistoryPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('User not authenticated')
        setLoading(false)
        return
      }

      try {
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/reference-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        })

        const data = await res.json()
        if (res.ok && data.success && Array.isArray(data.applications)) {
          setApplications(data.applications)
        } else {
          toast.error(data.message || 'Failed to load reference history')
        }
      } catch (error) {
        console.error('Update error:', error);
        toast.error('Error fetching reference history')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <AppLayout>
      <section className="px-4 py-10 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Reference History</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoaderCircle className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : applications.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">No applications found.</p>
          ) : (
            <>
              {/* Mobile: Grid cards */}
              <div className="grid gap-4 sm:hidden">
                {applications.map((app) => (
                  <div key={app.id} className="border p-4 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <p><span className="font-semibold">Application ID:</span> {app.application_id}</p>
                    <p><span className="font-semibold">User:</span> {app.applicant?.name}</p>
                    <p><span className="font-semibold">Scheme:</span> {app.scheme?.title}</p>
                    <p><span className="font-semibold">Bank:</span> {app.scheme?.bank?.name}</p>
                    <p><span className="font-semibold">Status:</span> {app.status}</p>
                    <p><span className="font-semibold">Remark:</span> {app.remarks}</p>
                    <p><span className="font-semibold">Created:</span> {formatDate(app.created_at)}</p>
                    <p><span className="font-semibold">Updated:</span> {formatDate(app.updated_at)}</p>
                  </div>
                ))}
              </div>

              {/* Tablet & Desktop: Table */}
              <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
                <table className="min-w-full table-auto text-sm text-left text-gray-700 dark:text-gray-200">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium uppercase">
                    <tr>
                      <th className="p-4">Application ID</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Scheme</th>
                      <th className="p-4">Bank</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Remark</th>
                      <th className="p-4">Created</th>
                      <th className="p-4">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-4">{app.application_id}</td>
                        <td className="p-4">{app.applicant?.name}</td>
                        <td className="p-4 max-w-sm break-words">{app.scheme?.title}</td>
                        <td className="p-4">{app.scheme?.bank?.name}</td>
                        <td className="p-4">{app.status}</td>
                        <td className="p-4 max-w-sm break-words">{app.remarks}</td>
                        <td className="p-4">{formatDate(app.created_at)}</td>
                        <td className="p-4">{formatDate(app.updated_at)}</td>
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
