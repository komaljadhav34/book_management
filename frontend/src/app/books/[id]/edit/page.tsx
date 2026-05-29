"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader } from "@/components/Loader";
import { booksApi, uploadApi } from "@/services/api";
import { toastSuccess, toastError } from "@/utils/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ✅ FIXED SCHEMA (NO coerce) */
const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(10).max(13),
  category: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().min(0),
  published_date: z.string(),
  description: z.string(),
  cover_image: z.string().optional(),
});

type BookForm = z.infer<typeof bookSchema>;

export default function EditBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    const loadBook = async () => {
      try {
        const { data } = await booksApi.getById(params.id);

        reset({
          ...data,
          price: Number(data.price),
          stock: Number(data.stock),
          published_date: new Date(data.published_date)
            .toISOString()
            .split("T")[0],
        });
      } catch {
        toastError("Failed to load book");
        router.push("/books");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [params.id, reset, router]);

  const onSubmit = async (values: BookForm) => {
    setSaving(true);
    try {
      await booksApi.update(params.id, {
        ...values,
        published_date: new Date(values.published_date).toISOString(),
      });

      toastSuccess("Book updated successfully");
      router.push(`/books/${params.id}`);
    } catch {
      toastError("Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader text="Loading book..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center">
        <Link href={`/books/${params.id}`}>
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit Book</h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Book</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("title")} placeholder="Title" />
            <Input {...register("author")} placeholder="Author" />
            <Input {...register("isbn")} placeholder="ISBN" />

            <select {...register("category")} className="w-full border p-2 rounded">
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
            </select>

            {/* ✅ valueAsNumber FIX */}
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="Price"
            />

            <Input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="Stock"
            />

            <Input type="date" {...register("published_date")} />

            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  const { data } = await uploadApi.uploadImage(file);
                  setValue("cover_image", data.url);
                  toastSuccess("Image uploaded");
                } catch {
                  toastError("Image upload failed");
                }
              }}
            />

            <textarea
              {...register("description")}
              rows={4}
              className="w-full border rounded p-2"
              placeholder="Description"
            />

            <div className="flex justify-end gap-3">
              <Link href={`/books/${params.id}`}>
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" isLoading={saving}>Update</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
