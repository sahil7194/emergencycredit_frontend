'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import DateFormatter from '@/components/ui/date-formatter';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

type Scheme = {
  id: number;
  title: string;
  summary: string;
  slug: string;
  created_at: string;
  bank?: {
    name: string;
    vendor_code: string;
  };
};

export default function CrmSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/schemes`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch schemes');
        const data = await res.json();
        setSchemes(data.data || []);
      } catch (err: any) {
        console.error(err);
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const openDeleteModal = (scheme: Scheme) => {
  setSelectedScheme(scheme);
  setShowDeleteModal(true);
};

const handleDelete = async () => {
  if (!selectedScheme) return;

  setDeleting(true);
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/crm/schemes/${selectedScheme.slug}`,
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
    setSchemes((prev) => prev.filter((s) => s.id !== selectedScheme.id));
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            CRM Schemes
          </h1>
          <Link
            href="/crm/schemes/create"
            className="inline-block rounded-full border border-slate-300 py-2 px-4 text-sm font-medium shadow-sm transition hover:shadow-lg text-slate-700 dark:text-slate-200 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-700"
          >
            Add Scheme
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        ) : (
          <>
            {/* Mobile & Tablet View */}
            <div className="md:hidden space-y-4">
              {schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow"
                >
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    {scheme.title}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                    {scheme.summary}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                    <strong>Bank:</strong> {scheme?.bank?.name} (
                    {scheme?.bank?.vendor_code})
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    <strong>Created:</strong>{" "}
                    <DateFormatter date={scheme.created_at} />
                  </p>
                <div className="grid grid-cols-3 gap-2">
  <div>
    <Link href={`/crm/schemes/${scheme.slug}`}>
      <Button size="sm" variant="secondary" className="w-full">
        <EyeIcon className="h-4 w-4 mr-1" /> View
      </Button>
    </Link>
  </div>
  <div>
    <Link href={`/crm/schemes/${scheme.slug}/edit`}>
      <Button size="sm" className="w-full">
        <PencilIcon className="h-4 w-4 mr-1" /> Edit
      </Button>
    </Link>
  </div>
  <div>
    <Button
      size="sm"
      variant="destructive"
      className="w-full"
      onClick={() => openDeleteModal(scheme)}
    >
      <TrashIcon className="h-4 w-4 mr-1 text-red-600 dark:text-red-500" /> Delete
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
                    <th className="p-4 text-left font-semibold">Summary</th>
                    <th className="p-4 text-left font-semibold">Bank</th>
                    <th className="p-4 text-left font-semibold">Vendor ID</th>
                    <th className="p-4 text-left font-semibold">Created At</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.map((scheme) => (
                    <tr
                      key={scheme.id}
                      className="border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="p-4">{scheme.title}</td>
                      <td className="p-4">{scheme.summary}</td>
                      <td className="p-4">{scheme?.bank?.name}</td>
                      <td className="p-4">{scheme?.bank?.vendor_code}</td>
                      <td className="p-4">
                        <DateFormatter date={scheme.created_at} />
                      </td>
                      <td className="p-4">
                       <div className="flex items-center space-x-2">
  <div>
    <Link href={`/crm/schemes/${scheme.slug}`}>
      <Button size="sm" variant="secondary">
        <EyeIcon className="h-4 w-4" />
      </Button>
    </Link>
  </div>
  <div>
    <Link href={`/crm/schemes/${scheme.slug}/edit`}>
      <Button size="sm">
        <PencilIcon className="h-4 w-4" />
      </Button>
    </Link>
  </div>
  <div>
    <Button
      size="sm"
      variant="destructive"
      onClick={() => openDeleteModal(scheme)}
    >
      <TrashIcon className="h-4 w-4 text-red-600 dark:text-red-500" />
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
      {showDeleteModal && selectedScheme && (
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
              <strong>{selectedScheme.title}</strong>? This action cannot be
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

