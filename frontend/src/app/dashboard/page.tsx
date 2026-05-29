"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Book, Users, TrendingUp, Library, Activity } from "lucide-react";
import { booksApi, activityApi } from "@/services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ total_books: 0, unique_categories: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actRes] = await Promise.all([
          booksApi.getStats(),
          activityApi.getRecent(5)
        ]);
        setStats(statsRes.data);
        setActivities(actRes.data);
      } catch {
        // silently fail for dashboard stats
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your book management system</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden border-blue-500/20 dark:border-blue-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 dark:from-blue-500/20 to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Library className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-foreground">
              {loading ? (
                <div className="h-8 w-16 bg-blue-500/20 animate-pulse rounded" />
              ) : (
                stats.total_books
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Books in the database</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden border-purple-500/20 dark:border-purple-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 dark:from-purple-500/20 to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Book className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-foreground">
              {loading ? (
                <div className="h-8 w-16 bg-purple-500/20 animate-pulse rounded" />
              ) : (
                stats.unique_categories
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unique book categories</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden border-emerald-500/20 dark:border-emerald-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 dark:from-emerald-500/20 to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <a href="/books/add" className="inline-flex items-center text-sm text-foreground hover:text-emerald-500 hover:underline font-medium">
              + Add a new book
            </a>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-6">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-4">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{act.details || act.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(act.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
