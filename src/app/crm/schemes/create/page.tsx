'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

type Bank = {
  id: number;
  name: string;
};

type FormData = {
  title: string;
  summary: string;
  description: string;
  max_amount: string;
  min_amount: string;
  max_cibil: string;
  min_cibil: string;
  max_interest_rate: string;
  min_interest_rate: string;
  max_tenure: string;
  min_tenure: string;
  redirection_link: string;
  bank_id: string;
};

export default function CreateCrmSchemePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    description: '',
    max_amount: '',
    min_amount: '',
    max_cibil: '',
    min_cibil: '',
    max_interest_rate: '',
    min_interest_rate: '',
    max_tenure: '',
    min_tenure: '',
    redirection_link: '',
    bank_id: '',
  });

  // Fetch token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      setMounted(true);
    }
  }, []);

  // Fetch banks once mounted and token is ready
  useEffect(() => {
    if (!mounted || !token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/bank`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBanks(data.data || []))
      .catch(() => {
        toast.error('Failed to load banks');
      });
  }, [mounted, token]);

  if (!mounted) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation per step
  const validateStep = (): string => {
    if (step === 1) {
      if (!formData.title.trim()) return 'Title is required';
      if (!formData.summary.trim()) return 'Summary is required';
      if (!formData.description.trim()) return 'Description is required';
      if (!formData.bank_id) return 'Bank selection is required';
    }
    if (step === 2) {
      if (
        formData.min_amount &&
        isNaN(Number(formData.min_amount))
      )
        return 'Min Amount must be a number';
      if (
        formData.max_amount &&
        isNaN(Number(formData.max_amount))
      )
        return 'Max Amount must be a number';
      if (
        formData.min_cibil &&
        isNaN(Number(formData.min_cibil))
      )
        return 'Min CIBIL must be a number';
      if (
        formData.max_cibil &&
        isNaN(Number(formData.max_cibil))
      )
        return 'Max CIBIL must be a number';
    }
    if (step === 3) {
      if (
        formData.min_interest_rate &&
        isNaN(Number(formData.min_interest_rate))
      )
        return 'Min Interest Rate must be a number';
      if (
        formData.max_interest_rate &&
        isNaN(Number(formData.max_interest_rate))
      )
        return 'Max Interest Rate must be a number';
      if (
        formData.min_tenure &&
        isNaN(Number(formData.min_tenure))
      )
        return 'Min Tenure must be a number';
      if (
        formData.max_tenure &&
        isNaN(Number(formData.max_tenure))
      )
        return 'Max Tenure must be a number';
      // Optional: Validate redirection_link as URL if you want
    }
    return '';
  };

  const goToNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goToPrev = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setError('');
    setProcessing(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crm/schemes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token || ''}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit');
      }

      toast.success('CRM Scheme created successfully! 🎉');
      router.push('/crm/schemes');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      toast.error(err.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">
          Create CRM Scheme
        </h1>

        {/* Step Indicator */}
        <div className="flex justify-center mb-10 space-x-4">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer font-semibold
                ${
                  step === s
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition'
                }`}
              aria-current={step === s ? 'step' : undefined}
              aria-label={`Step ${s}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-md flex items-center gap-2 text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-400"
            role="alert"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9z"
              />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="bg-white dark:bg-slate-900 shadow-md rounded-md p-8 space-y-6">
              <div>
                <Label htmlFor="title" className="mb-2">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter scheme title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="summary" className="mb-2">Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Brief summary of the scheme"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description"
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bank_id" className="mb-2">Bank</Label>
                <select
                  id="bank_id"
                  name="bank_id"
                  value={formData.bank_id}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 dark:bg-slate-800 dark:border-slate-700 text-gray-900 dark:text-slate-200"
                  required
                >
                  <option value="">Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Amount & CIBIL */}
          {step === 2 && (
            <div className="bg-white dark:bg-slate-900 shadow-md rounded-md p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="min_amount" className="mb-2">Min Amount</Label>
                  <Input
                    id="min_amount"
                    name="min_amount"
                    type="number"
                    min={0}
                    value={formData.min_amount}
                    onChange={handleChange}
                    placeholder="Minimum loan amount"
                  />
                </div>
                <div>
                  <Label htmlFor="max_amount" className="mb-2">Max Amount</Label>
                  <Input
                    id="max_amount"
                    name="max_amount"
                    type="number"
                    min={0}
                    value={formData.max_amount}
                    onChange={handleChange}
                    placeholder="Maximum loan amount"
                  />
                </div>

                <div>
                  <Label htmlFor="min_cibil" className="mb-2">Min CIBIL</Label>
                  <Input
                    id="min_cibil"
                    name="min_cibil"
                    type="number"
                    min={0}
                    max={900}
                    value={formData.min_cibil}
                    onChange={handleChange}
                    placeholder="Minimum CIBIL score"
                  />
                </div>
                <div>
                  <Label htmlFor="max_cibil" className="mb-2">Max CIBIL</Label>
                  <Input
                    id="max_cibil"
                    name="max_cibil"
                    type="number"
                    min={0}
                    max={900}
                    value={formData.max_cibil}
                    onChange={handleChange}
                    placeholder="Maximum CIBIL score"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interest & Tenure */}
          {step === 3 && (
            <div className="bg-white dark:bg-slate-900 shadow-md rounded-md p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="min_interest_rate" className="mb-2">Min Interest Rate (%)</Label>
                  <Input
                    id="min_interest_rate"
                    name="min_interest_rate"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.min_interest_rate}
                    onChange={handleChange}
                    placeholder="E.g. 5.5"
                  />
                </div>
                <div>
                  <Label htmlFor="max_interest_rate" className="mb-2">Max Interest Rate (%)</Label>
                  <Input
                    id="max_interest_rate"
                    name="max_interest_rate"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.max_interest_rate}
                    onChange={handleChange}
                    placeholder="E.g. 15.5"
                  />
                </div>
                <div>
                  <Label htmlFor="min_tenure" className="mb-2">Min Tenure (months)</Label>
                  <Input
                    id="min_tenure"
                    name="min_tenure"
                    type="number"
                    min={0}
                    value={formData.min_tenure}
                    onChange={handleChange}
                    placeholder="Minimum tenure in months"
                  />
                </div>
                <div>
                  <Label htmlFor="max_tenure" className="mb-2">Max Tenure (months)</Label>
                  <Input
                    id="max_tenure"
                    name="max_tenure"
                    type="number"
                    min={0}
                    value={formData.max_tenure}
                    onChange={handleChange}
                    placeholder="Maximum tenure in months"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="redirection_link" className="mb-2">Redirection Link</Label>
                <Input
                  id="redirection_link"
                  name="redirection_link"
                  type="url"
                  value={formData.redirection_link}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goToPrev}
                disabled={processing}
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={goToNext} disabled={processing}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={processing}>
                {processing && (
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                )}
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
