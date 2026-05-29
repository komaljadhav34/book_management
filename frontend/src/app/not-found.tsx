import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <BookX className="h-16 w-16 text-primary" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! The page or book you are looking for doesn&apos;t seem to exist. It might have been moved or deleted.
      </p>
      <Link href="/">
        <Button size="lg" className="px-8">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
