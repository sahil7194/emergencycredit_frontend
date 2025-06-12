'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import DateFormatter from '@/components/ui/date-formatter';

const CrmCibilLogPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/crm/cibil-log`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        setLogs(result.data || []);
      } catch (error) {
        console.error('Error fetching CIBIL logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          CRM CIBIL Log
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No logs found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {['Name', 'Email', 'Mobile', 'PAN Card', 'Score', 'Vendor', 'Created At'].map(
                    (heading, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{log.name}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{log.email}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{log.mobile}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{log.pan_card}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{log.score}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{log.vendor}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      <DateFormatter date={log.created_at} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CrmCibilLogPage;
