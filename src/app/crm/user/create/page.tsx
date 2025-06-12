'use client';

import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


type FormData = {
  name: string;
  email: string;
  mobile: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | '';
  type: 'user' | 'agent' | 'staff' | '';
  pan: string;
  password: string;
};

const initialData: FormData = {
  name: '',
  email: '',
  mobile: '',
  date_of_birth: '',
  gender: '',
  type: '',
  pan: '',
  password: '',
};

const CrmUserCreate = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<FormData>(initialData);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Handle input change
  const onChange = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
  setMounted(true);
  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
  }
  }, []);

   if (!mounted) return null; 

  // Validate current step before next
  const validateStep = () => {
    if (step === 1) {
      if (!data.name.trim()) return 'Name is required';
      if (!data.gender) return 'Gender is required';
      return '';
    }
    if (step === 2) {
      if (!data.email.trim()) return 'Email is required';
      if (!data.mobile.trim()) return 'Mobile is required';
      if (!data.date_of_birth) return 'Date of birth is required';
      return '';
    }
    if (step === 3) {
      if (!data.type) return 'User type is required';
      if (!data.pan.trim()) return 'PAN is required';
      if (!data.password.trim()) return 'Password is required';
      return '';
    }
    return '';
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const submit = async () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setProcessing(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token || ''}`,

        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      // const responseData = await res.json();
      toast.success('User saved successfully! 🎉');
      router.push('/crm/user');
      setData(initialData);
      setStep(1);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-slate-900 dark:text-slate-100">
            Create New User
          </h2>

          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-center font-medium">{error}</div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  Gender
                </label>
                <select
                  id="gender"
                  value={data.gender}
                  onChange={(e) => onChange('gender', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-gray-900 dark:text-slate-200"
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  Mobile
                </label>
                <Input
                  id="mobile"
                  type="tel"
                  value={data.mobile}
                  onChange={(e) => onChange('mobile', e.target.value)}
                  placeholder="9876543210"
                  required
                />
              </div>

              <div>
                <label htmlFor="dob" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <Input
                  id="dob"
                  type="date"
                  value={data.date_of_birth}
                  onChange={(e) => onChange('date_of_birth', e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Account Info */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="type" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  User Type
                </label>
                <select
                  id="type"
                  value={data.type}
                  onChange={(e) => onChange('type', e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-gray-900 dark:text-slate-200"
                  required
                >
                  <option value="" disabled>
                    Select user type
                  </option>
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div>
                <label htmlFor="pan" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  PAN
                </label>
                <Input
                  id="pan"
                  type="text"
                  value={data.pan}
                  onChange={(e) => onChange('pan', e.target.value)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => onChange('password', e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={processing}
                className="px-6"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep} disabled={processing} className="ml-auto px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-sm transition">
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submit}
                disabled={processing}
                className="ml-auto px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg transition flex items-center"
              >
                {processing && (
                  <svg
                    className="animate-spin mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                )}
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CrmUserCreate;
