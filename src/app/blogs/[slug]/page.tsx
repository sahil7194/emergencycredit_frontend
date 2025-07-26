import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { notFound } from 'next/navigation'

interface Blog {
  id: number
  slug: string
  title: string
  image: string
  user: { name: string; slug: string }
  content: string
  created_at: string
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`)
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  } catch (error) {
    console.error('Failed to fetch blog:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  return {
    title: blog?.title || 'Blog not found',
    description: blog?.content?.slice(0, 100) || '',
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) return notFound()

  return (
    <AppLayout>
      <Card className="overflow-hidden lg:max-w-[1250px] mx-auto w-full">
        <CardContent>
          <div className="mb-10">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full object-cover object-center rounded-md"
            />
          </div>
          <div className="mx-auto w-full max-w-[770px] text-center px-4 sm:px-6 lg:px-0">
            <h1 className="mb-5 text-[28px] font-semibold leading-tight sm:text-[32px]">
              {blog.title}
            </h1>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm">
              <span>By {blog.user?.name ?? 'Unknown author'}</span>
              <span>•</span>
              <span>
                {new Date(blog.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[770px] text-left px-4 sm:px-6 lg:px-0">
            <p className="mb-9 text-base leading-6 text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {blog.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}




