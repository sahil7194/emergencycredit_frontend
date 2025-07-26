"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DateFormatter from "@/components/ui/date-formatter";
import { PencilIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


const SchemeShowPage = () => {
  const { slug } = useParams();
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/crm/schemes/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          router.push("/404");
          return;
        }

        const data = await res.json();
        setScheme(data.data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchScheme();
  }, [slug, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-3 text-gray-700 dark:text-gray-300">Loading...</span>
      </div>
    );

  if (!scheme)
    return (
      <div className="text-center p-10 text-gray-700 dark:text-gray-300">
        <p className="text-xl font-semibold mb-2">Scheme Not Found</p>
        <p>Please check the URL or try again later.</p>
      </div>
    );

  const handleDelete = async () => {
  

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/crm/schemes/${scheme.slug}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      toast.error(`Failed to delete: ${errorData.message || "Unknown error"}`);
      return;
    }

    toast.success("Scheme deleted successfully!");
    router.push("/crm/schemes");
  } catch (err) {
    console.error("Delete error", err);
    toast.error("Something went wrong while deleting the scheme.");
  }
};


  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
      <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold dark:text-white">
            {scheme.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Slug: {scheme.slug}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {scheme.image && (
            <img
            
              src={scheme.image}
              alt={scheme.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          )}

          <div>
            <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
              Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{scheme.summary}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
              Description
            </h2>
            <p className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
              {scheme.description}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Interest Rate
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {scheme.min_interest_rate}% - {scheme.max_interest_rate}%
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                CIBIL Score
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {scheme.min_cibil} - {scheme.max_cibil}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Tenure (Months)
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {scheme.min_tenure} - {scheme.max_tenure}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Loan Amount
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                ₹{scheme.min_amount} - ₹{scheme.max_amount}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Redirection Link
            </h3>
            <a
              href={scheme.redirection_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline break-all"
            >
              {scheme.redirection_link}
            </a>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground dark:text-gray-400 space-y-1">
            <p>Status: {scheme.status}</p>
            <p>Bank: {scheme.bank?.name ?? "N/A"}</p>
            <p>Created By: {scheme.user?.name ?? "Unknown"}</p>
            <p>
              Created At: <DateFormatter date={scheme.created_at} />
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href = `/crm/schemes/${scheme.slug}/edit`)
            }
          >
            <PencilIcon className="h-4 w-4 mr-1" /> Edit
          </Button>

         <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="destructive" className="text-red-700 dark:text-red-400">
      <TrashIcon className="h-4 w-4 mr-1" /> Delete
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
    </DialogHeader>
    <p>Are you sure you want to delete this scheme? This action cannot be undone.</p>
    <DialogFooter className="flex justify-end gap-2">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        className="text-red-700 dark:text-red-400"
       onClick={handleDelete}

      >
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

        </CardFooter>
      </Card>
    </main>
  );
};

export default SchemeShowPage;
