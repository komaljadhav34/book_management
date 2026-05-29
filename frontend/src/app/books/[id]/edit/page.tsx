"use client";

import { useState, useEffect } from "react";
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

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters").max(13),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0),
  published_date: z.string(),
  description: z.string(),
  cover_image: z.string().optional(),
  stock: z.coerce.number().min(0),
});

type BookForm = z.infer<typeof bookSchema>;

export default function EditBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await booksApi.getById(params.id);
        const dateStr = data.published_date ? new Date(data.published_date).toISOString().split("T")[0] : "";
        reset({ ...data, published_date: dateStr });
      } catch (error) {
        toastError(error, "Failed to load book");
        router.push("/books");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchBook();
  }, [params.id, reset, router]);

  const onSubmit = async (values: BookForm) => {
    setIsLoading(true);
    try {
      await booksApi.update(params.id, {
        ...values,
        published_date: new Date(values.published_date).toISOString(),
      });
      toastSuccess("Book updated successfully");
      router.push(`/books/${params.id}`);
    } catch (error) {
      toastError(error, "Failed to update book. Admin access required.");
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return <DashboardLayout><Loader text="Loading book..." /></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center">
        <Link href={`/books/${params.id}`}>
          <Button variant="ghost" size="sm" className="mr-4"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit Book</h2>
      </div>
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Update Book Details</CardTitle></CardHeader>
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
                  <option value="">Select...</option>
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
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" {...register("stock")} className={errors.stock ? "border-destructive" : ""} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Published Date</label>
                <Input type="date" {...register("published_date")} />
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
                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Link href={`/books/${params.id}`}><Button variant="outline" type="button">Cancel</Button></Link>
              <Button type="submit" isLoading={isLoading}>Update Book</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
