"use client";

import { Sun, Moon, Search, Bell, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Generate breadcrumbs from pathname
  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
      
      {/* Search and Actions */}
      <div className="flex w-full md:w-auto items-center justify-end gap-4 flex-1">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search anywhere..." 
            className="w-full bg-muted/50 pl-9 rounded-full border-none focus-visible:ring-1 h-9"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Link href="/activity">
            <button 
              className="p-2 rounded-full text-muted-foreground hover:bg-muted/80 transition-colors relative"
              title="View Activity Log"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
            </button>
          </Link>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>
        
      </div>
    </header>
  );
}
