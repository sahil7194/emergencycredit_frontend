'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

type State = {
  id: string | number;
  name: string;
};

type City = {
  id: string | number;
  name: string;
};

const CrmUserEdit = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    date_of_birth: '',
    email: '',
    mobile: '',
    type: '',
    password: '',
    address: '',
    state_id: '',
    city_id: '',
    pin_code: '',
  });

  // Fetch existing user data + states
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [userRes, statesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users/${slug}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/states`),
        ]);

        const userData = await userRes.json();
        const user = userData.data;

        const statesData = await statesRes.json();
        const parsedStates = Array.isArray(statesData)
          ? statesData
          : statesData.data || [];

        setStates(parsedStates);

        setFormData({
          name: user.name || '',
          gender: user.gender || '',
          date_of_birth: user.date_of_birth || '',
          email: user.email || '',
          mobile: user.mobile || '',
          type: user.type !== null && user.type !== undefined ? String(user.type) : '',
          password: '',
          address: user.address?.address || '',
          state_id: user.address?.state_id || '',
          city_id: user.address?.city_id || '',
          pin_code: user.address?.pin_code || '',
        });

        if (user.address?.state_id) {
          const citiesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities?state_id=${user.address.state_id}`);
          const citiesData = await citiesRes.json();
          const parsedCities = Array.isArray(citiesData)
            ? citiesData
            : citiesData.data || [];
          setCities(parsedCities);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch user or states');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchInitialData();
  }, [slug]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    setFormData((prev) => ({ ...prev, state_id: stateId, city_id: '' }));

    if (stateId) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities?state_id=${stateId}`);
        const data = await res.json();
        const parsedCities = Array.isArray(data) ? data : data.data || [];
        setCities(parsedCities);
      } catch {
        toast.error('Error fetching cities');
        setCities([]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/users/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const messages = Object.values(data.errors).flat();
          messages.forEach((msg) => toast.error(String(msg)));
        } else {
          toast.error(data.message || 'Failed to update user');
        }
        return;
      }

      toast.success('User updated successfully');
      router.push('/crm/user');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                <LoaderCircle className="animate-spin inline-block mr-2" />
                Loading user data...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Name" value={formData.name} onChange={(val) => handleChange('name', val)} />
                  <SelectField
                    label="Gender"
                    value={formData.gender}
                    options={[{ value: 'male' }, { value: 'female' }, { value: 'other' }]}
                    onChange={(val) => handleChange('gender', val)}
                  />
                  <InputField label="Date of Birth" type="date" value={formData.date_of_birth} onChange={(val) => handleChange('date_of_birth', val)} />
                  <SelectField
                    label="User Type"
                    value={formData.type}
                    options={[
                      { value: '0', label: 'User' },
                      { value: '1', label: 'Agent' },
                      { value: '2', label: 'Staff' },
                    ]}
                    onChange={(val) => handleChange('type', val)}
                  />
                  <InputField label="Email" type="email" value={formData.email} onChange={(val) => handleChange('email', val)} />
                  <InputField label="Mobile" value={formData.mobile} onChange={(val) => handleChange('mobile', val)} />
                  <InputField label="Password" type="password" value={formData.password} onChange={(val) => handleChange('password', val)} placeholder="Leave blank to keep unchanged" />
                  <textarea
                    className="sm:col-span-2 p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                  />
                  <InputField label="Pin Code" value={formData.pin_code} onChange={(val) => handleChange('pin_code', val)} />
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      value={formData.state_id}
                      onChange={handleStateChange}
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      value={formData.city_id}
                      onChange={(e) => handleChange('city_id', e.target.value)}
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-6 flex justify-end">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium px-6 py-2 shadow-sm transition"
                  >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </AppLayout>
  );
};

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={type !== 'password'}
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label?: string }[];
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">-- Select {label} --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label || opt.value}
        </option>
      ))}
    </select>
  </div>
);

export default CrmUserEdit;

