import Link from 'next/link';
import { Book } from '@/types/book';
import { DollarSign, Tag, Package } from 'lucide-react';

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`} className="group block">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30">
        {/* Cover */}
        <div className="h-52 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/20 flex items-center justify-center relative overflow-hidden shrink-0">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-25">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 right-3 transition-transform duration-300 group-hover:scale-105">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-sm border border-white/20">
              <Tag className="h-3 w-3" />
              {book.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground italic mb-3">by {book.author}</p>

          {/* Spacer */}
          <div className="mt-auto" />

          {/* Meta row */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-primary">
              <DollarSign className="h-4 w-4" />
              <span className="text-lg font-bold">{book.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{book.stock} in stock</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Skeleton version for loading state
export function BookCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-52 bg-muted shrink-0" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="mt-auto pt-3 border-t border-border/50 flex justify-between">
          <div className="h-6 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}
