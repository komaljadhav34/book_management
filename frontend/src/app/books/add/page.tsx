"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { booksApi, uploadApi } from "@/services/api";
import { toastSuccess, toastError } from "@/utils/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ✅ FIXED SCHEMA (NO coerce) */
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(10).max(13),
  category: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().min(0),
  published_date: z.string(),
  description: z.string(),
  cover_image: z.string().optional(),
});

type BookForm = z.infer<typeof bookSchema>;

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      price: 0,
      stock: 0,
      published_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: BookForm) => {
    setLoading(true);
    try {
      await booksApi.create({
        ...values,
        published_date: new Date(values.published_date).toISOString(),
      });

      toastSuccess("Book added successfully");
      router.push("/books");
    } catch (error) {
      toastError(error, "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center">
        <Link href="/books">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Add New Book</h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
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
              <Link href="/books">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" isLoading={loading}>
                Save Book
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
