"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";

interface Bank {
  id: number;
  name: string;
}

interface Scheme {
  title: string;
  summary: string;
  description: string;
  max_amount: number;
  min_amount: number;
  max_cibil: number;
  min_cibil: number;
  max_interest_rate: number;
  min_interest_rate: number;
  max_tenure: number;
  min_tenure: number;
  redirection_link: string;
  bank_id: number;
  slug: string;
}

const EditSchemePage = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    max_amount: "",
    min_amount: "",
    max_cibil: "",
    min_cibil: "",
    max_interest_rate: "",
    min_interest_rate: "",
    max_tenure: "",
    min_tenure: "",
    redirection_link: "",
    bank_id: "",
  });

  // Fetch scheme and banks on load
  useEffect(() => {
    if (!slug) return;

    const token = localStorage.getItem("token");

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch scheme
        const schemeRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/crm/schemes/${slug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!schemeRes.ok) throw new Error("Failed to load scheme");

        const schemeData = await schemeRes.json();
        setScheme(schemeData.data);

        // Prefill form data
        setFormData({
          title: schemeData.data.title ?? "",
          summary: schemeData.data.summary ?? "",
          description: schemeData.data.description ?? "",
          max_amount: schemeData.data.max_amount?.toString() ?? "",
          min_amount: schemeData.data.min_amount?.toString() ?? "",
          max_cibil: schemeData.data.max_cibil?.toString() ?? "",
          min_cibil: schemeData.data.min_cibil?.toString() ?? "",
          max_interest_rate: schemeData.data.max_interest_rate?.toString() ?? "",
          min_interest_rate: schemeData.data.min_interest_rate?.toString() ?? "",
          max_tenure: schemeData.data.max_tenure?.toString() ?? "",
          min_tenure: schemeData.data.min_tenure?.toString() ?? "",
          redirection_link: schemeData.data.redirection_link ?? "",
          bank_id: schemeData.data.bank_id?.toString() ?? "",
        });

        // Fetch banks list
        const banksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm/bank`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (banksRes.ok) {
          const banksData = await banksRes.json();
          setBanks(banksData.data || []);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Handle input change
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit form
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crm/schemes/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            max_amount: Number(formData.max_amount),
            min_amount: Number(formData.min_amount),
            max_cibil: Number(formData.max_cibil),
            min_cibil: Number(formData.min_cibil),
            max_interest_rate: Number(formData.max_interest_rate),
            min_interest_rate: Number(formData.min_interest_rate),
            max_tenure: Number(formData.max_tenure),
            min_tenure: Number(formData.min_tenure),
            bank_id: Number(formData.bank_id),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update scheme");
      }

      // After success, redirect to scheme detail or list page
      router.push(`/crm/schemes`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!scheme) return <div className="p-4">Scheme not found.</div>;

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Edit Scheme</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="col-span-1 sm:col-span-2">
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
                placeholder="Scheme Title"
              />
            </div>

            {/* Summary */}
            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="summary" className="mb-1 block font-medium">
                Summary
              </Label>
              <textarea
                id="summary"
                name="summary"
                required
                value={formData.summary}
                onChange={onChange}
                placeholder="Scheme Summary"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                rows={3}
              />
            </div>

            {/* Description */}
            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="description" className="mb-1 block font-medium">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={onChange}
                placeholder="Scheme Description"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                rows={5}
              />
            </div>

            {/* Bank */}
            <div>
              <Label htmlFor="bank_id" className="mb-1 block font-medium">
                Bank
              </Label>
              <select
                id="bank_id"
                name="bank_id"
                required
                value={formData.bank_id}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Numeric inputs */}
            {[
              { id: "max_amount", label: "Max Amount", type: "number" },
              { id: "min_amount", label: "Min Amount", type: "number" },
              { id: "max_cibil", label: "Max CIBIL", type: "number" },
              { id: "min_cibil", label: "Min CIBIL", type: "number" },
              {
                id: "max_interest_rate",
                label: "Max Interest Rate (%)",
                type: "number",
                step: "0.01",
              },
              {
                id: "min_interest_rate",
                label: "Min Interest Rate (%)",
                type: "number",
                step: "0.01",
              },
              { id: "max_tenure", label: "Max Tenure (Months)", type: "number" },
              { id: "min_tenure", label: "Min Tenure (Months)", type: "number" },
            ].map(({ id, label, type, step }) => (
              <div key={id}>
                <Label htmlFor={id} className="mb-1 block font-medium">
                  {label}
                </Label>
                <Input
                  id={id}
                  name={id}
                  type={type}
                  step={step}
                  required
                  value={(formData as any)[id]}
                  onChange={onChange}
                  placeholder={label}
                />
              </div>
            ))}

            {/* Redirection Link */}
            <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="redirection_link" className="mb-1 block font-medium">
                Redirection Link
              </Label>
              <Input
                id="redirection_link"
                name="redirection_link"
                type="url"
                required
                value={formData.redirection_link}
                onChange={onChange}
                placeholder="Redirection URL"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={processing} className="w-48">
                {processing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                Update Scheme
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default EditSchemePage;
