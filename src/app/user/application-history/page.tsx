// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';

// interface Application {
//   id: number;
//   application_id: string;
//   status: string;
//   remarks: string;
//   created_at: string;
//   scheme: {
//     title: string;
//     image: string;
//     app_url: string;
//   };
//   agent: {
//     name: string;
//     email: string;
//     mobile: string;
//   };
// }

// const statusMap: { [key: string]: string } = {
//   '0': 'Pending',
//   '1': 'Approved',
//   '2': 'Rejected',
//   '3': 'Processing',
// };

// export default function ApplicationHistory() {
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     console.log('Token:', token); 
//    axios
//   .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/application-history`, {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//   .then((res) => {
//     console.log('API response data:', res.data);
//     setApplications(res.data.applications || []);
//   })
//   .catch((err) => {
//     console.error('Error fetching applications:', err);
//   })
//   .finally(() => setLoading(false));

//   }, []);

//   if (loading) return <div className="p-4 text-center">Loading...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-4 space-y-6">
//       <h1 className="text-3xl font-semibold">Application History</h1>

//       {applications.length === 0 ? (
//         <div className="text-gray-500">No applications found.</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {applications.map((app) => (
//             <motion.div
//               key={app.id}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//               className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col space-y-3"
//             >
//               <img
//                 src={app.scheme.image}
//                 alt={app.scheme.title}
//                 className="w-full h-40 object-cover rounded-xl"
//               />
//               <div>
//                 <h2 className="text-xl font-bold">{app.scheme.title}</h2>
//                 <p className="text-sm text-gray-500">Application ID: {app.application_id}</p>
//               </div>
//               <div className="text-sm">
//                 <p>
//                   <span className="font-semibold">Agent:</span> {app.agent.name}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Mobile:</span> {app.agent.mobile}
//                 </p>
//               </div>
//               <div className="text-sm">
//                 <p>
//                   <span className="font-semibold">Status:</span>{' '}
//                   <span
//                     className={`font-medium ${
//                       app.status === '1'
//                         ? 'text-green-600'
//                         : app.status === '2'
//                         ? 'text-red-600'
//                         : 'text-yellow-600'
//                     }`}
//                   >
//                     {statusMap[app.status] || 'Unknown'}
//                   </span>
//                 </p>
//                 <p>
//                   <span className="font-semibold">Remarks:</span> {app.remarks}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Applied On:</span>{' '}
//                   {new Date(app.created_at).toLocaleDateString()}
//                 </p>
//               </div>
//               <a
//                 href={app.scheme.app_url}
//                 target="_blank"
//                 className="mt-auto text-blue-600 hover:underline text-sm font-medium"
//               >
//                 View Scheme Details →
//               </a>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Application {
  id: number;
  application_id: string;
  status: string;
  remarks: string;
  created_at: string;
  scheme: {
    title: string;
    image: string;
    app_url: string;
  } | null; // scheme may be null
  agent: {
    name: string;
    email: string;
    mobile: string;
  };
}

const statusMap: { [key: string]: string } = {
  '0': 'Pending',
  '1': 'Approved',
  '2': 'Rejected',
  '3': 'Processing',
};

export default function ApplicationHistory() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/application-history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setApplications(res.data.applications || []);
      })
      .catch((err) => {
        console.error('Error fetching applications:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-semibold">Application History</h1>

      {applications.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No applications found.</div>
      ) : (
        <>
          {/* Card view for small and medium screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
            {applications.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col space-y-3"
              >
                {app.scheme && app.scheme.image ? (
                  <img
                    src={app.scheme.image}
                    alt={app.scheme.title || 'Scheme Image'}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                    No image available
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold">{app.scheme?.title || 'Untitled Scheme'}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Application ID: {app.application_id}
                  </p>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Agent:</strong> {app.agent.name}</p>
                  <p><strong>Mobile:</strong> {app.agent.mobile}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={
                      app.status === '1' ? 'text-green-600' :
                      app.status === '2' ? 'text-red-600' :
                      'text-yellow-600'
                    }>
                      {statusMap[app.status] || 'Unknown'}
                    </span>
                  </p>
                  <p><strong>Remarks:</strong> {app.remarks}</p>
                  <p><strong>Applied On:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
                {app.scheme?.app_url ? (
                  <a
                    href={app.scheme.app_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Scheme Details →
                  </a>
                ) : (
                  <span className="mt-auto text-gray-400 text-sm">No scheme link</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Table view for large screens */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <th className="p-3">Application ID</th>
                  <th className="p-3">Scheme</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Remarks</th>
                  <th className="p-3">Applied On</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 dark:text-gray-300">
                {applications.map((app) => (
                  <tr key={app.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">{app.application_id}</td>
                    <td className="p-3">{app.scheme?.title || 'Untitled Scheme'}</td>
                    <td className="p-3">{app.agent.name}</td>
                    <td className="p-3">{app.agent.mobile}</td>
                    <td className="p-3 font-medium">
                      <span className={
                        app.status === '1' ? 'text-green-600' :
                        app.status === '2' ? 'text-red-600' :
                        'text-yellow-600'
                      }>
                        {statusMap[app.status] || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-3">{app.remarks}</td>
                    <td className="p-3">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      {app.scheme?.app_url ? (
                        <a
                          href={app.scheme.app_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

