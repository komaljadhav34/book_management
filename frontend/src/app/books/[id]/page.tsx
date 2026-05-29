"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader } from "@/components/Loader";
import { booksApi } from "@/services/api";
import { toastSuccess, toastError } from "@/utils/toast";
import { Book } from "@/types/book";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Edit } from "lucide-react";

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await booksApi.getById(params.id);
        setBook(data);
      } catch (error) {
        toastError(error, "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    setDeleting(true);
    try {
      await booksApi.delete(params.id);
      toastSuccess("Book deleted successfully");
      router.push("/books");
    } catch (error) {
      toastError(error, "Failed to delete book. Admin access required.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <DashboardLayout><Loader text="Loading book details..." /></DashboardLayout>;
  }

  if (!book) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center py-20 text-center">
          <h3 className="text-lg font-semibold mb-2">Book not found</h3>
          <Link href="/books"><Button variant="outline">Back to books</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href="/books">
            <Button variant="ghost" size="sm" className="mr-4"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Book Details</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/books/${params.id}/edit`}>
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} isLoading={deleting}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-[300px] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
            {book.cover_image ? (
              <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
                <span className="text-xs">No Cover</span>
              </div>
            )}
          </div>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">{book.title}</h1>
              <p className="text-lg text-muted-foreground">by {book.author}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-border">
              <div><p className="text-xs text-muted-foreground mb-1">Category</p><p className="font-medium">{book.category}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">ISBN</p><p className="font-medium font-mono text-sm">{book.isbn}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Price</p><p className="font-bold text-primary text-xl">${book.price.toFixed(2)}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Stock</p><p className="font-medium">{book.stock} available</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Published</p><p className="font-medium">{new Date(book.published_date).toLocaleDateString()}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Added</p><p className="font-medium">{new Date(book.created_at).toLocaleDateString()}</p></div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{book.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
