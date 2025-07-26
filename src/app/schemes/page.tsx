
'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Pagination from '@/components/pagination'
import AppLayout from '@/layouts/app-layout' // optional if you want layout wrapper

interface Scheme {
  id: number
  title: string
  slug: string
  image: string
  created_at: string
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    async function fetchSchemes() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schemes?page=${currentPage}`)
        if (!res.ok) throw new Error(`Failed to fetch schemes: ${res.status}`)
        const data = await res.json()
        setSchemes(data.data)
        setLastPage(data.meta?.last_page || 1)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch schemes')
      } finally {
        setLoading(false)
      }
    }
    fetchSchemes()
  }, [currentPage])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-24 text-lg">Loading schemes...</div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-24 text-red-600">Error: {error}</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <section className="py-12">
        <div className="container mx-auto flex flex-col items-center gap-16 px-4 md:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-semibold md:text-4xl">Schemes</h2>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Find medical loan options that match your need. Quick checks, instant apply.
            </p>
          </div>

          <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20 w-full">
            {schemes.map((scheme) => (
              <Card
                key={scheme.id}
                className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">{scheme.title}</h3>
                    <p className="mt-4 text-muted-foreground md:mt-5">
                      {/* Placeholder summary if not in API */}
                      Discover more details about this scheme and its benefits.
                    </p>
                    <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                      <span className="text-muted-foreground">
                        {new Date(scheme.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center space-x-2 md:mt-8">
                      <a
                        href={`/schemes/${scheme.slug}`}
                        className="inline-flex items-center font-semibold hover:underline md:text-base"
                      >
                        <span>Read more</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
                      </a>
                    </div>
                  </div>

                  <div className="order-first sm:order-last sm:col-span-5">
                    <a href={`/schemes/${scheme.slug}`} className="block">
                      <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border">
                        <Image
                          src={scheme.image}
                          alt={scheme.title}
                          width={800}
                          height={450}
                          className="h-full w-full object-cover transition-opacity duration-200 hover:opacity-70"
                          unoptimized
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />
        </div>
      </section>
    </AppLayout>
  )
}
