'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import DateFormatter from '@/components/ui/date-formatter';
import { Button } from '@/components/ui/button';

type Bank = {
  id: number;
  name: string;
  slug: string;
  vendor_code: string;
  created_at: string;
};

export default function CrmBankListPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/bank`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setBanks(data.data || []);
      } catch (error) {
        console.error('Failed to fetch banks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const openDeleteModal = (bank: Bank) => {
    setSelectedBank(bank);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBank) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crm/bank/${selectedBank.slug}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error('Failed to delete bank');

      setBanks((prev) => prev.filter((b) => b.id !== selectedBank.id));
      setShowDeleteModal(false);
    } catch (error) {
      alert('Error deleting bank: ' + (error as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">CRM Banks</h1>
          <Link
            href="/crm/bank/create"
            className="inline-block rounded-full border border-slate-300 py-2 px-4 text-sm font-medium shadow-sm transition hover:shadow-lg text-slate-700 dark:text-slate-200 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-700"
          >
            Add Bank
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        ) : (
          <>
            {/* Mobile & Tablet View */}
            <div className="md:hidden space-y-4">
              {banks.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow"
                >
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{bank.name}</h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                    <strong>Vendor Code:</strong> {bank.vendor_code}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    <strong>Created:</strong> <DateFormatter date={bank.created_at} />
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/crm/bank/${bank.slug}/edit`}>
                      <Button size="sm" className="w-full">
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full text-red-600 dark:text-red-500"
                      onClick={() => openDeleteModal(bank)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Vendor Code</th>
                    <th className="p-4 text-left font-semibold">Created At</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((bank) => (
                    <tr
                      key={bank.id}
                      className="border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="p-4">{bank.name}</td>
                      <td className="p-4">{bank.vendor_code}</td>
                      <td className="p-4">
                        <DateFormatter date={bank.created_at} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/crm/bank/${bank.slug}/edit`}>
                            <Button size="sm">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-red-600 dark:text-red-500"
                            onClick={() => openDeleteModal(bank)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedBank && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Delete</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to delete the bank <strong>{selectedBank.name}</strong>? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
