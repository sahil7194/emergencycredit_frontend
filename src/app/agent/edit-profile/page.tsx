'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'react-hot-toast';

type State = {
  id: string | number;
  name: string;
};

type City = {
  id: string | number;
  name: string;
};

const AgentEditProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    date_of_birth: '',
    address: '',
    state_id: '',
    city_id: '',
    pin_code: '',
  });

 const fetchInitialData = async () => {
  try {
    const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const statesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/states`);
    const statesData = Array.isArray(statesRes.data) ? statesRes.data : statesRes.data.data || [];

    setStates(statesData);

    const user = profileRes.data.data;

    setForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      gender: user.gender || '',
      date_of_birth: user.date_of_birth || '',
      address: user.address?.address || '',
      state_id: user.address?.state_id || '',
      city_id: user.address?.city_id || '',
      pin_code: user.address?.pin_code || '',
    });

    if (user.address?.state_id) {
     const citiesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities?state_id=${user.address.state_id}`);
const citiesData = Array.isArray(citiesRes.data)
  ? citiesRes.data
  : Array.isArray(citiesRes.data.data)
  ? citiesRes.data.data
  : [];
setCities(citiesData);

    }
  } catch (error) {
    console.error('Error fetching profile/states:', error);
    toast.error('Failed to load data');
    setStates([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    setForm({ ...form, state_id: stateId, city_id: '' });
    if (stateId) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities?state_id=${stateId}`);
        const citiesData = Array.isArray(res.data)
  ? res.data
  : Array.isArray(res.data.data)
  ? res.data.data
  : [];
setCities(citiesData);

      } catch {
        toast.error('Error fetching cities');
      }
    } else {
      setCities([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      // If Laravel returns validation errors (422)
      if (res.status === 422 && data.errors) {
        const messages = Object.values(data.errors).flat();
        messages.forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
      return;
    }

    toast.success('Profile updated successfully');
    router.push('/agent/profile');
  } catch (err) {
    console.error('Update error:', err);
    toast.error('Something went wrong');
  } finally {
    setSubmitting(false);
  }
};



  return (
   <AppLayout>
  <Card className="w-full max-w-4xl mx-auto mt-10 px-4 sm:px-6 md:px-8">
    <CardHeader>
      <CardTitle className="text-xl sm:text-2xl dark:text-white">Edit Profile</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex justify-center py-10">
          <LoaderCircle className="animate-spin w-6 h-6 text-gray-500 dark:text-gray-300" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="dark:text-gray-300 mb-2">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="email" className="dark:text-gray-300 mb-2">Email</Label>
              <Input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="mobile" className="dark:text-gray-300 mb-2">Mobile</Label>
              <Input
                id="mobile"
                value={form.mobile}
                onChange={handleChange}
                required
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="gender" className="dark:text-gray-300 mb-2">Gender</Label>
              <select
                id="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full h-10 border rounded-md px-3 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="date_of_birth" className="dark:text-gray-300 mb-2">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
                required
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="address" className="dark:text-gray-300 mb-2">Address</Label>
              <textarea
                id="address"
                value={form.address}
                onChange={handleChange}
                className="w-full h-24 p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="pin_code" className="dark:text-gray-300 mb-2">Pin Code</Label>
              <Input
                id="pin_code"
                value={form.pin_code}
                onChange={handleChange}
                required
                className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="state_id" className="dark:text-gray-300 mb-2">State</Label>
              <select
                id="state_id"
                value={form.state_id}
                onChange={handleStateChange}
                className="w-full h-10 border rounded-md px-3 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="city_id" className="dark:text-gray-300 mb-2">City</Label>
              <select
                id="city_id"
                value={form.city_id}
                onChange={handleChange}
                className="w-full h-10 border rounded-md px-3 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
  type="submit"
  disabled={submitting}
  className="w-full sm:w-48 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold rounded-md px-4 py-2 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
>
  {submitting && <LoaderCircle className="w-4 h-4 animate-spin mr-2" />}
  Update
</Button>

          </div>
        </form>
      )}
    </CardContent>
    <CardFooter />
  </Card>
</AppLayout>

  );
};

export default AgentEditProfilePage;
