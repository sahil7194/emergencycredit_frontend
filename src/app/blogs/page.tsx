// 'use client'

// import { Card } from '@/components/ui/card'
// import AppLayout from '@/layouts/app-layout'
// import { ArrowRight } from 'lucide-react'
// import React, { useEffect, useState } from 'react'

// const heading = "Blog Posts"
// const description = "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture."

// interface Blog {
//   id: number
//   title: string
//   slug: string
//   summary: string
//   created_at: string
//   image: string
//   user: { name: string }
// }

// export default function BlogListPage() {
//   const [blogs, setBlogs] = useState<Blog[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function fetchBlogs() {
//       try {
       
//         const res = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`)
//         if (!res.ok) {
//           throw new Error(`Error: ${res.status}`)
//         }
//         const data = await res.json()
//         // If your API returns { data: [...] }, use setBlogs(data.data)
//         setBlogs(data.data)
//       } catch (err: any) {
//         setError(err.message || 'Failed to fetch blogs')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchBlogs()
//   }, [])

//   if (loading) {
//     return (
//       <AppLayout>
//         <div className="flex justify-center items-center py-24 text-lg">Loading blogs...</div>
//       </AppLayout>
//     )
//   }

//   if (error) {
//     return (
//       <AppLayout>
//         <div className="flex justify-center items-center py-24 text-red-600">Error: {error}</div>
//       </AppLayout>
//     )
//   }

//   return (
//     <AppLayout>
//       <section className="py-16 sm:py-24">
//         <div className="container flex flex-col items-center gap-16">
//           <div className="text-center">
//             <h2 className="mx-auto mb-6 text-3xl font-semibold md:text-4xl lg:max-w-3xl">{heading}</h2>
//             <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">{description}</p>
//           </div>

//           <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20 w-full">
//             {blogs.map((blog) => (
//               <Card key={blog.id} className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2">
//                 <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 md:items-center md:gap-x-8 lg:gap-x-12">
//                   <div className="sm:col-span-5">
//                     <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
//                       <a href={`/blogs/${blog.slug}`} className="hover:underline">{blog.title}</a>
//                     </h3>
//                     <p className="mt-4 text-muted-foreground md:mt-5">{blog.summary}</p>
//                     <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
//                       <span className="text-muted-foreground">{blog?.user?.name}</span>
//                       <span className="text-muted-foreground">•</span>
//                       <span className="text-muted-foreground">
//                         {new Date(blog.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
//                       </span>
//                     </div>
//                     <div className="mt-6 flex items-center space-x-2 md:mt-8">
//                       <a href={`/blogs/${blog.slug}`} className="inline-flex items-center font-semibold hover:underline md:text-base">
//                         <span>Read more</span>
//                         <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
//                       </a>
//                     </div>
//                   </div>
//                   <div className="order-first sm:order-last sm:col-span-5">
//                     <a href={`/blogs/${blog.slug}`} className="block">
//                       <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border">
//                         <img
//                           src={blog.image}
//                           alt={blog.title}
//                           className="h-full w-full object-cover transition-opacity duration-200 hover:opacity-70"
//                         />
//                       </div>
//                     </a>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//     </AppLayout>
//   )
// }







'use client'

import { Card } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Pagination from '@/components/pagination'

const heading = "Blog Posts"
const description = "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture."

interface Blog {
  id: number
  title: string
  slug: string
  summary: string
  created_at: string
  image: string
  user: { name: string }
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?page=${currentPage}`)
        if (!res.ok) throw new Error(`Error: ${res.status}`)
        const data = await res.json()
        setBlogs(data.data)
        setLastPage(data.meta.last_page)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blogs')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [currentPage])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-24 text-lg">Loading blogs...</div>
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
      <section className="py-16 sm:py-24">
        <div className="container flex flex-col items-center gap-16">
          <div className="text-center">
            <h2 className="mx-auto mb-6 text-3xl font-semibold md:text-4xl lg:max-w-3xl">{heading}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">{description}</p>
          </div>

          <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20 w-full">
            {blogs.map((blog) => (
              <Card key={blog.id} className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2">
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 md:items-center md:gap-x-8 lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                      <a href={`/blogs/${blog.slug}`} className="hover:underline">{blog.title}</a>
                    </h3>
                    <p className="mt-4 text-muted-foreground md:mt-5">{blog.summary}</p>
                    <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                      <span className="text-muted-foreground">{blog?.user?.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center space-x-2 md:mt-8">
                      <a href={`/blogs/${blog.slug}`} className="inline-flex items-center font-semibold hover:underline md:text-base">
                        <span>Read more</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
                      </a>
                    </div>
                  </div>
                  <div className="order-first sm:order-last sm:col-span-5">
                    <a href={`/blogs/${blog.slug}`} className="block">
                      <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border">
                      {/* // eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-opacity duration-200 hover:opacity-70"
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














