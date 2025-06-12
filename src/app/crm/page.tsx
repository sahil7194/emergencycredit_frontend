'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Emergency Credit Instantly
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Check your CIBIL score and apply for instant credit based on your profile. Fast, secure, and hassle-free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
            <Link href="/cibil-check">
              <Button className="text-white bg-white/10 hover:bg-white/20">Check CIBIL</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">1. Check Your CIBIL</h3>
                <p>Get your credit score instantly with just a few details.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">2. Apply for Credit</h3>
                <p>Based on your score, apply for suitable emergency credit schemes.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">3. Get Approval</h3>
                <p>Track your application and receive funds quickly and securely.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Why Emergency Credit?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Emergencies don’t wait. We make credit fast, simple, and transparent.
          </p>
          <Link href="/schemes">
            <Button size="lg">Explore Schemes</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}