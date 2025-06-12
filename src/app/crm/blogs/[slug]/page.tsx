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

const CrmBlogShowPage = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/crm/blogs/${slug}`,
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
        setBlog(data.data);
      } catch (error) {
        console.error("Fetch blog error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-3 text-gray-700 dark:text-gray-300">Loading...</span>
      </div>
    );

  if (!blog)
    return (
      <div className="text-center p-10 text-gray-700 dark:text-gray-300">
        <p className="text-xl font-semibold mb-2">Blog Not Found</p>
        <p>Please check the URL or try again later.</p>
      </div>
    );

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crm/blogs/${blog.slug}`,
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

      toast.success("Blog deleted successfully!");
      router.push("/crm/blogs");
    } catch (error) {
      console.error("Delete blog error:", error);
      toast.error("Something went wrong while deleting the blog.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
      <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold dark:text-white">
            {blog.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Slug: {blog.slug}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          )}

          <div>
            <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
              Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{blog.summary}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
              Content
            </h2>
            <p className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
              {blog.content}
            </p>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground dark:text-gray-400 space-y-1">
            <p>Status: {blog.status ?? "Draft"}</p>
            <p>Author: {blog.user?.name ?? "Unknown"}</p>
            <p>Created At: {new Date(blog.created_at).toLocaleString()}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 flex-wrap">
          <Button
            variant="secondary"
            onClick={() => router.push(`/crm/blogs/${blog.slug}/edit`)}
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
              <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
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

export default CrmBlogShowPage;
