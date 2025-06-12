// 'use client';

// import React, { useEffect, useState } from 'react';
// import AppLayout from '@/layouts/app-layout';
// import DateFormatter from '@/components/ui/date-formatter';
// import Link from 'next/link';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   mobile: string;
//   slug: string;
//   type: number | string;
//   created_at: string;
// }

// const CrmUserList = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//  useEffect(() => {
//   const fetchUsers = async () => {
//     try {
       
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users`, {
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//   },
// });

//       if (!res.ok) throw new Error('Failed to fetch users');
//       const data = await res.json();
//       setUsers(data.data || []); // Corrected here ✅
//     } catch (err: any) {
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchUsers();
// }, []);


//   return (
//     <AppLayout>
//       <div className="px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-slate-800">CRM User List</h1>
//           <Link
//             href="/crm/users/create"
//             className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-full hover:bg-slate-700 shadow transition"
//           >
//             + Add User
//           </Link>
//         </div>

//         {loading ? (
//           <div className="text-center text-slate-500">Loading users...</div>
//         ) : error ? (
//           <div className="text-red-500 text-center">{error}</div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg shadow">
//             <table className="min-w-full divide-y divide-gray-200 bg-white">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {users.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.mobile}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.type}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <DateFormatter date={user.created_at} />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
//                       <Link href={`/crm/users/${user.slug}/edit`} className="text-slate-600 hover:text-slate-900">
//                         Edit
//                       </Link>
//                       <Link href={`/crm/users/${user.slug}/delete`} className="text-red-500 hover:text-red-700">
//                         Delete
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </AppLayout>
//   );
// };

// export default CrmUserList;




// 'use client';

// import React, { useEffect, useState } from 'react';
// import AppLayout from '@/layouts/app-layout';
// import DateFormatter from '@/components/ui/date-formatter';
// import Link from 'next/link';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import { useCallback } from 'react';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   mobile: string;
//   slug: string;
//   type: number | string;
//   created_at: string;
// }

// const userTypeLabels: Record<string | number, { label: string; color: string }> = {
//   1: { label: 'Admin', color: 'bg-blue-500 text-white' },
//   2: { label: 'User', color: 'bg-green-500 text-white' },
//   // Add more mappings here as per your app
// };

// const CrmUserList = () => {
//   const router = useRouter();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
// const [selectedUserSlug, setSelectedUserSlug] = useState<string | null>(null);
// const [processingDelete, setProcessingDelete] = useState(false);


//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         if (!res.ok) throw new Error('Failed to fetch users');
//         const data = await res.json();
//         setUsers(data.data || []);
//       } catch (err: any) {
//         setError(err.message || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//    const fetchUserData = async (slug: string) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users/${slug}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (!res.ok) throw new Error('Failed to fetch user');

//       const data = await res.json();
//       console.log(data.data);

//       // Redirect to edit page
//       router.push(`/crm/user/${slug}/edit`);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleDeleteClick = (slug: string) => {
//   setSelectedUserSlug(slug);
//   setShowDeleteModal(true);
// };

// const confirmDelete = async () => {
//   if (!selectedUserSlug) return;

//   setProcessingDelete(true);
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users/${selectedUserSlug}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     if (!res.ok) throw new Error('Delete failed');

//     // Remove the deleted user from the state to update UI immediately
//     setUsers((prevUsers) => prevUsers.filter(user => user.slug !== selectedUserSlug));

//     setShowDeleteModal(false);
//     setSelectedUserSlug(null);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setProcessingDelete(false);
//   }
// };





  


//   return (
//     <AppLayout>
//       <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">CRM User List</h1>
//           <Link
//             href="/crm/user/create"
//             className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-slate-800 rounded-full hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 shadow transition"
//           >
//             + Add User
//           </Link>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <svg
//               className="animate-spin h-10 w-10 text-slate-600 dark:text-slate-300"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               aria-label="Loading spinner"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"
//               ></path>
//             </svg>
//           </div>
//         ) : error ? (
//           <div className="text-center text-red-500 font-semibold py-10">{error}</div>
//         ) : users.length === 0 ? (
//           <div className="text-center text-gray-600 dark:text-gray-400 py-10">No users found.</div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//               <thead className="bg-gray-50 dark:bg-gray-900">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                   >
//                     Name
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                   >
//                     Email
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                   >
//                     Mobile
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                   >
//                     User Type
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                   >
//                     Created At
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                 {users.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {user.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                       {user.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                       {user.mobile}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {/* User type badge */}
//                       {(() => {
//                         const typeKey = user.type.toString();
//                         const typeInfo = userTypeLabels[typeKey];
//                         return typeInfo ? (
//                           <span
//                             className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}
//                             title={typeInfo.label}
//                           >
//                             {typeInfo.label}
//                           </span>
//                         ) : (
//                           <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
//                             Unknown
//                           </span>
//                         );
//                       })()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
//                       <DateFormatter date={user.created_at} />
//                     </td>
//                     {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
//                       <Button
//                         onClick={() => fetchUserData(user.slug)}
//                         aria-label="Edit user"
//                         title="Edit user"
//                         className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
//                       >
//                       <PencilIcon className="h-5 w-5 inline" />
//                       </Button>
//                       <Link
//                         href={`/crm/users/${user.slug}/delete`}
//                         aria-label="Delete user"
//                         title="Delete user"
//                         className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
//                       >
//                        <TrashIcon className="h-5 w-5 inline" />
//                       </Link>
//                     </td> */}
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//   <div className="flex items-center space-x-4">
//     <Button
//       onClick={() => fetchUserData(user.slug)}
//       aria-label="Edit user"
//       title="Edit user"
//       className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
//     >
//       <PencilIcon className="h-5 w-5" />
//     </Button>

//     <Button
//   onClick={() => handleDeleteClick(user.slug)}
//   aria-label="Delete user"
//   title="Delete user"
//   className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
// >
//   <TrashIcon className="h-5 w-5" />
// </Button>

//   </div>
// </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {showDeleteModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
//       <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Confirm Deletion</h2>
//       <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this user?</p>
//       <div className="flex justify-end space-x-4">
//         <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={processingDelete}>
//           Cancel
//         </Button>
//         <Button
//           onClick={confirmDelete}
//           disabled={processingDelete}
//           className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
//         >
//           {processingDelete ? "Deleting..." : "Yes, Delete"}
//         </Button>
//       </div>
//     </div>
//   </div>
// )}

//     </AppLayout>
//   );
// };

// export default CrmUserList;



'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import DateFormatter from '@/components/ui/date-formatter';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  slug: string;
  type: number | string;
  created_at: string;
}

const userTypeLabels: Record<string | number, { label: string; color: string }> = {
  1: { label: 'Admin', color: 'bg-blue-500 text-white' },
  2: { label: 'User', color: 'bg-green-500 text-white' },
  // Add more mappings here as needed
};

const CrmUserList = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserSlug, setSelectedUserSlug] = useState<string | null>(null);
  const [processingDelete, setProcessingDelete] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserData = async (slug: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users/${slug}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user');

      const data = await res.json();
      console.log(data.data);

      router.push(`/crm/user/${slug}/edit`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteClick = (slug: string) => {
    setSelectedUserSlug(slug);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserSlug) return;

    setProcessingDelete(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users/${selectedUserSlug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');

      setUsers((prevUsers) => prevUsers.filter(user => user.slug !== selectedUserSlug));

      setShowDeleteModal(false);
      setSelectedUserSlug(null);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingDelete(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">CRM User List</h1>
          <Link
            href="/crm/user/create"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-slate-800 rounded-full hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 shadow transition"
          >
            + Add User
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg
              className="animate-spin h-10 w-10 text-slate-600 dark:text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading spinner"
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
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold py-10">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-10">No users found.</div>
        ) : (
          <>
            {/* Desktop & tablet: table view */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Mobile
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      User Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {user.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {(() => {
                          const typeKey = user.type.toString();
                          const typeInfo = userTypeLabels[typeKey];
                          return typeInfo ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}
                              title={typeInfo.label}
                            >
                              {typeInfo.label}
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                              Unknown
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <DateFormatter date={user.created_at} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <Button
                            onClick={() => fetchUserData(user.slug)}
                            aria-label="Edit user"
                            title="Edit user"
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Button>

                          <Button
                            onClick={() => handleDeleteClick(user.slug)}
                            aria-label="Delete user"
                            title="Delete user"
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & small tablet: card view */}
            <div className="md:hidden space-y-4">
              {users.map((user) => {
                const typeKey = user.type.toString();
                const typeInfo = userTypeLabels[typeKey];
                return (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {user.name}
                      </h2>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          typeInfo ? typeInfo.color : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                        title={typeInfo ? typeInfo.label : 'Unknown'}
                      >
                        {typeInfo ? typeInfo.label : 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Mobile:</strong> {user.mobile}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      <strong>Created At:</strong> <DateFormatter date={user.created_at} />
                    </p>
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => fetchUserData(user.slug)}
                        aria-label="Edit user"
                        title="Edit user"
                        className="flex-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        <PencilIcon className="h-5 w-5 inline mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(user.slug)}
                        aria-label="Delete user"
                        title="Delete user"
                        variant="destructive"
                        className="flex-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5 inline mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={processingDelete}>
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={processingDelete}
                className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                {processingDelete ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default CrmUserList;

