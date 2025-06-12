'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import DateFormatter from '@/components/ui/date-formatter';

const CrmApplicationHistoryPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/crm/application-history`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setApplications(result.data || []);
      } catch (err) {
        console.error('Error fetching application history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const titles = [
    'Application ID',
    'User Name',
    'Agent Name',
    'Scheme Title',
    'Bank Name',
    'Status',
    'Remark',
    'Created At',
    'Updated At',
  ];

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          CRM Application History
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No applications found.</div>
        ) : (
          <>
            {/* Desktop / Tablet Table */}
            <div className="hidden md:block overflow-auto bg-white dark:bg-gray-900 rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    {titles.map((title, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-2">{application.application_id}</td>
                      <td className="px-4 py-2">{application?.applicant?.name || '-'}</td>
                      <td className="px-4 py-2">{application?.agent?.name || '-'}</td>
                      <td className="px-4 py-2 max-w-xs break-words">{application?.scheme?.title || '-'}</td>
                      <td className="px-4 py-2">{application?.scheme?.bank?.name || '-'}</td>
                      <td className="px-4 py-2 capitalize">{application.status}</td>
                      <td className="px-4 py-2 max-w-xs break-words">{application.remarks || '-'}</td>
                      <td className="px-4 py-2">
                        <DateFormatter date={application.created_at} />
                      </td>
                      <td className="px-4 py-2">
                        <DateFormatter date={application.updated_at} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow space-y-2 border border-gray-100 dark:border-gray-800"
                >
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Application ID:</strong>{' '}
                    {application.application_id}
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">User Name:</strong>{' '}
                    {application?.applicant?.name || '-'}
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Agent Name:</strong>{' '}
                    {application?.agent?.name || '-'}
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Scheme Title:</strong>{' '}
                    {application?.scheme?.title || '-'}
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Bank Name:</strong>{' '}
                    {application?.scheme?.bank?.name || '-'}
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Status:</strong>{' '}
                    <span className="capitalize">{application.status}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Remarks:</strong>{' '}
                    {application.remarks || '-'}
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Created At:</strong>{' '}
                    <DateFormatter date={application.created_at} />
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Updated At:</strong>{' '}
                    <DateFormatter date={application.updated_at} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default CrmApplicationHistoryPage;
