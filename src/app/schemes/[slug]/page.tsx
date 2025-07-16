import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface Scheme {
  id: number
  slug: string
  title: string
  summary: string
  description: string
  image: string
  redirection_link: string
  min_interest_rate: string
  max_interest_rate: string
  min_cibil: string
  max_cibil: string
  min_tenure: string
  max_tenure: string
  min_amount: string
  max_amount: string
  created_at: string
  user: {
    name: string
  }
  bank: {
    name: string
    image: string
  }
}

async function getSchemeBySlug(slug: string): Promise<Scheme | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schemes/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null

    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const scheme = await getSchemeBySlug(slug)
  if (!scheme) {
    return {
      title: 'Scheme Not Found',
    }
  }

  return {
    title: scheme.title,
    description: scheme.summary,
  }
}

export default async function SchemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {

  const user = false;

  const { slug } = await params
  const scheme = await getSchemeBySlug(slug)
  if (!scheme) return notFound()

  const redirectUnAuthUser = "/login?ref="+ slug;

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto p-6">
        <CardHeader className="mb-10">
          <div className="relative w-full h-72">
            <Image
              src={scheme.image}
              alt={scheme.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              unoptimized
            />
          </div>
        </CardHeader>

        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-white text-center">
            {scheme.title}
          </CardTitle>
          <CardDescription className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            Posted by {scheme.user?.name ?? 'Unknown'} on{' '}
            {new Date(scheme.created_at).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-7 whitespace-pre-line">
            {scheme.description}
          </p>

          <div className="mt-10 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Interest Rates</Label>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Min: {scheme.min_interest_rate}% | Max: {scheme.max_interest_rate}%
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">CIBIL Score</Label>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Min: {scheme.min_cibil} | Max: {scheme.max_cibil}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Tenure</Label>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Min: {scheme.min_tenure} months | Max: {scheme.max_tenure} months
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</Label>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  ₹{Number(scheme.min_amount).toLocaleString()} - ₹{Number(scheme.max_amount).toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600 dark:text-gray-400">Bank</Label>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{scheme.bank?.name}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center mt-10">

          {
            user ? (
              <>

                <div className="w-full max-w-sm">
                  <a href={scheme.redirection_link} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">
                      Apply Now
                    </Button>
                  </a>
                </div>

              </>) : (
              <>

                <div className="w-full max-w-sm">
                  <a href={redirectUnAuthUser}  rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">
                      Login 
                    </Button>
                  </a>
                </div>
              </>
            )
          }


        </CardFooter>
      </Card>
    </section>
  )
}

