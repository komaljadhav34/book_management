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

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters").max(13),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  published_date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  cover_image: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

type BookForm = z.infer<typeof bookSchema>;

export default function AddBookPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      published_date: new Date().toISOString().split("T")[0],
      price: 0, stock: 0,
    },
  });

  const onSubmit = async (values: BookForm) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center">
        <Link href="/books">
          <Button variant="ghost" size="sm" className="mr-4"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Add New Book</h2>
      </div>
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Book Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...register("title")} className={errors.title ? "border-destructive" : ""} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input {...register("author")} className={errors.author ? "border-destructive" : ""} />
                {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ISBN</label>
                <Input {...register("isbn")} className={errors.isbn ? "border-destructive" : ""} />
                {errors.isbn && <p className="text-sm text-destructive">{errors.isbn.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  {...register("category")}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.category ? "border-destructive" : "border-input"}`}
                >
                  <option value="">Select category...</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="History">History</option>
                </select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($)</label>
                <Input type="number" step="0.01" {...register("price")} className={errors.price ? "border-destructive" : ""} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" {...register("stock")} className={errors.stock ? "border-destructive" : ""} />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Published Date</label>
                <Input type="date" {...register("published_date")} className={errors.published_date ? "border-destructive" : ""} />
                {errors.published_date && <p className="text-sm text-destructive">{errors.published_date.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image Upload</label>
                <div className="flex gap-2 items-center">
                  <Input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      toastSuccess("Uploading image...");
                      const { data } = await uploadApi.uploadImage(file);
                      setValue("cover_image", data.url, { shouldValidate: true });
                      toastSuccess("Image uploaded!");
                    } catch {
                      toastError("Failed to upload image");
                    }
                  }} />
                </div>
                <Input {...register("cover_image")} placeholder="Or paste URL here..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.description ? "border-destructive" : "border-input"}`}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <div className="flex justify-end gap-3">
              <Link href="/books"><Button variant="outline" type="button">Cancel</Button></Link>
              <Button type="submit" isLoading={isLoading}>Save Book</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
