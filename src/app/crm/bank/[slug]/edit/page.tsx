'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function CrmBankEditPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [, setBank] = useState<{ name: string; details: string } | null>(null);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/bank/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to load bank data');
        const data = await res.json();
        setBank(data.data);
        setName(data.data.name);
        setDetails(data.data.details);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBank();
  }, [slug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crm/bank/${slug}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, details }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update bank');
      }
      router.push('/crm/bank');

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
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          Edit Bank
        </h1>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Edit Bank Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bank Name"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="details">Details</Label>
                  <textarea
                    id="details"
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Quick details about the bank..."
                    className="w-full min-h-[120px] rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-1 focus:ring-slate-500"
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && (
                  <p className="text-green-600 text-sm">Bank updated successfully!</p>
                )}

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:w-48 flex items-center justify-center"
                >
                  {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                  Update Bank
                </Button>
              </form>
            </CardContent>
            <CardFooter />
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
