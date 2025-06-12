'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';

interface Blog {
  title: string;
  summary: string;
  content: string;
  slug: string;
}

const EditBlogPage = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
  });

  useEffect(() => {
    if (!slug) return;

    const token = localStorage.getItem('token');

    async function fetchBlog() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/blogs/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load blog');

        const data = await res.json();

        setBlog(data.data || data); // adjust based on API shape
        setFormData({
          title: data.data?.title ?? data.title ?? '',
          summary: data.data?.summary ?? data.summary ?? '',
          content: data.data?.content ?? data.content ?? '',
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/blogs/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update blog');
      }

      router.push('/crm/blogs');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading blog...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!blog) return <div className="p-4">Blog not found.</div>;

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Edit Blog</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="mb-1 block font-medium">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={onChange}
                placeholder="Blog Title"
              />
            </div>

            <div>
              <Label htmlFor="summary" className="mb-1 block font-medium">
                Summary
              </Label>
              <textarea
                id="summary"
                name="summary"
                required
                value={formData.summary}
                onChange={onChange}
                placeholder="Blog Summary"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content" className="mb-1 block font-medium">
                Content
              </Label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={onChange}
                placeholder="Blog Content"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                rows={8}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={processing} className="w-40">
                {processing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                Update Blog
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </main>
  );
};

export default EditBlogPage;
