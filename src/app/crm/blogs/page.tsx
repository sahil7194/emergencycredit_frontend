'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import DateFormatter from '@/components/ui/date-formatter';
import { Button } from '@/components/ui/button';

type Blog = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  status: string;
  created_at: string;
  user?: {
    name: string;
  };
};

export default function CrmBlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/blogs`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setBlogs(data.data || []);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

    const openDeleteModal = (blog: Blog) => {
  setSelectedBlog(blog);
  setShowDeleteModal(true);
};

const handleDelete = async () => {
  if (!selectedBlog) return;

  setDeleting(true);
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/crm/blogs/${selectedBlog.slug}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) throw new Error('Failed to delete scheme');

    // Remove deleted scheme from state list without refetch
    setBlogs((prev) => prev.filter((s) => s.id !== selectedBlog.id));
    setShowDeleteModal(false);
  } catch (error) {
    alert('Error deleting scheme: ' + (error as Error).message);
  } finally {
    setDeleting(false);
  }
};


  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">CRM Blogs</h1>
          <Link
            href="/crm/blogs/create"
            className="inline-block rounded-full border border-slate-300 py-2 px-4 text-sm font-medium shadow-sm transition hover:shadow-lg text-slate-700 dark:text-slate-200 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-700"
          >
            Add Blog
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        ) : (
          <>
            {/* Mobile & Tablet View */}
            <div className="md:hidden space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">{blog.summary}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                    <strong>Status:</strong> {blog.status}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                    <strong>User:</strong> {blog.user?.name}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    <strong>Created:</strong> <DateFormatter date={blog.created_at} />
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Link href={`/crm/blogs/${blog.slug}`}>
                        <Button size="sm" variant="secondary" className="w-full">
                          <EyeIcon className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                    </div>
                    <div>
                        <Link href={`/crm/blogs/${blog.slug}/edit`}>
                      <Button size="sm" className="w-full">
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </Link>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full text-red-600 dark:text-red-500"
                        onClick={() => openDeleteModal(blog)}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                     
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-4 text-left font-semibold">Title</th>
                    <th className="p-4 text-left font-semibold">Slug</th>
                    <th className="p-4 text-left font-semibold">Summary</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">User</th>
                    <th className="p-4 text-left font-semibold">Created At</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="p-4">{blog.title}</td>
                      <td className="p-4">{blog.slug}</td>
                      <td className="p-4">{blog.summary}</td>
                      <td className="p-4">{blog.status}</td>
                      <td className="p-4">{blog.user?.name}</td>
                      <td className="p-4">
                        <DateFormatter date={blog.created_at} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <Link href={`/crm/blogs/${blog.slug}`}>
                              <Button size="sm" variant="secondary">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                          <div>
                            <Link href={`/crm/blogs/${blog.slug}/edit`}>
                              <Button size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                          <div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-red-600 dark:text-red-500"
                              onClick={() => openDeleteModal(blog)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                           
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
       {showDeleteModal && selectedBlog && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full space-y-4 shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Confirm Delete
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete the scheme{" "}
                    <strong>{selectedBlog.title}</strong>? This action cannot be
                    undone.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowDeleteModal(false)}
                      disabled={deleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className='bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white'
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
    </AppLayout>
  );
}
