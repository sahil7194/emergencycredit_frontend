'use client';

import React, { useState, FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CrmBankCreatePage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ name, details }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create bank');
      }
      router.push('/crm/bank');
      setName('');
      setDetails('');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
          Create Bank
        </h1>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Create Bank</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Bank Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full dark:bg-slate-800 dark:text-white dark:border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="details" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Details
                </Label>
                <textarea
                  id="details"
                  placeholder="A quick detail about the bank..."
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 resize-y"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">Bank created successfully!</p>}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:w-48 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                  Save Bank
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter />
        </Card>
      </div>
    </AppLayout>
  );
}
