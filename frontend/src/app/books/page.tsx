"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BookCard, BookCardSkeleton } from "@/components/BookCard";
import { booksApi } from "@/services/api";
import { toastError } from "@/utils/toast";
import { Book } from "@/types/book";
import { Plus, Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const size = 8;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await booksApi.getAll({
        page, size,
        search: search || undefined,
        category: category || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setBooks(data.items as unknown as Book[]);
      setTotal(data.total);
    } catch (error) {
      toastError(error, "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, sortOrder, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchBooks, 400);
    return () => clearTimeout(debounce);
  }, [fetchBooks]);

  const totalPages = Math.ceil(total / size);

  const [exporting, setExporting] = useState(false);

  const exportCSV = async () => {
    setExporting(true);
    try {
      // Fetch all books (up to 100 as per API limit) for export
      const { data } = await booksApi.getAll({ page: 1, size: 100, search: search || undefined, category: category || undefined, sort_by: sortBy, sort_order: sortOrder });
      const booksToExport = data.items;
      
      if (booksToExport.length === 0) {
        toastError("No books to export");
        return;
      }
      
      const headers = ["Title", "Author", "ISBN", "Category", "Price", "Stock", "Published Date"];
      const csvData = booksToExport.map((b: any) => 
        `"${b.title}","${b.author}","${b.isbn}","${b.category}",${b.price},${b.stock},"${b.published_date}"`
      );
      
      const csv = [headers.join(","), ...csvData].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `books_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toastError(error, "Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Books Library</h2>
          <p className="text-muted-foreground mt-1">
            {loading ? "Loading..." : `${total} book${total !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} isLoading={exporting}>
            Export CSV
          </Button>
          <Link href="/books/add">
            <Button><Plus className="mr-2 h-4 w-4" /> Add Book</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="flex h-10 w-full md:w-44 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="Technology">Technology</option>
          <option value="History">History</option>
        </select>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split(":");
            setSortBy(s); setSortOrder(o); setPage(1);
          }}
          className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="created_at:desc">Newest first</option>
          <option value="created_at:asc">Oldest first</option>
          <option value="price:asc">Price: Low → High</option>
          <option value="price:desc">Price: High → Low</option>
          <option value="title:asc">Title A → Z</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        /* Skeleton Loaders */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length > 0 ? (
        <>
          {/* Book Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-muted-foreground text-sm">…</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-8 border border-primary/10">
              <BookOpen className="h-16 w-16 text-primary/40" strokeWidth={1} />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            {search || category
              ? "Try adjusting your search or filter criteria to find what you're looking for."
              : "Your library is empty. Start building your collection by adding your first book."
            }
          </p>
          {search || category ? (
            <Button
              variant="outline"
              onClick={() => { setSearch(""); setCategory(""); }}
            >
              Clear filters
            </Button>
          ) : (
            <Link href="/books/add">
              <Button><Plus className="mr-2 h-4 w-4" /> Add your first book</Button>
            </Link>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
