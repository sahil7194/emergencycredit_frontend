'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';

const CrmBlogCreatePage = () => {
  const router = useRouter();

  const [data, setData] = useState({
    title: '',
    summary: '',
    content: '',
  });

  const [processing, setProcessing] = useState(false);

  const handleChange = (field: keyof typeof data) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [field]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        router.push('/crm/blogs');
      } else {
        alert(json.message || 'Blog creation failed.');
      }
    } catch (err) {
      console.error('Submit Error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6">
        <Card className="max-w-4xl mx-auto w-full shadow-lg border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Create New Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="mb-2">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  required
                  value={data.title}
                  onChange={handleChange("title")}
                  placeholder="Top 5 Investment Tips for 2025"
                />
              </div>

              {/* Summary */}
              <div>
                <Label htmlFor="summary" className="mb-2">
                  Summary
                </Label>
                <textarea
                  id="summary"
                  required
                  value={data.summary}
                  onChange={handleChange("summary")}
                  placeholder="Short summary..."
                  className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content" className="mb-2">
                  Content
                </Label>
                <textarea
                  id="content"
                  rows={8}
                  required
                  value={data.content}
                  onChange={handleChange("content")}
                  placeholder="Full blog content here..."
                  className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={processing}
                >
                  {processing && (
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2 inline-block" />
                  )}
                  Save Blog
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </AppLayout>
  );
};

export default CrmBlogCreatePage;
