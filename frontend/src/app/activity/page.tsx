"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { activityApi } from "@/services/api";
import { Activity, BookPlus, BookOpen, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ACTION_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  CREATE_BOOK: { label: "Book Added",   icon: BookPlus,  color: "text-green-500 bg-green-500/10" },
  UPDATE_BOOK: { label: "Book Updated", icon: BookOpen,   color: "text-blue-500 bg-blue-500/10"  },
  DELETE_BOOK: { label: "Book Deleted", icon: Trash2,     color: "text-red-500 bg-red-500/10"    },
};

interface ActivityItem {
  id: string;
  user_id: string;
  action: string;
  target: string;
  details: string;
  created_at: string;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(20);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data } = await activityApi.getRecent(limit);
      setActivities(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivities(); }, [limit]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Log</h2>
          <p className="text-muted-foreground mt-1">Audit trail of all book operations</p>
        </div>
        <Button variant="outline" onClick={fetchActivities} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Recent Events</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Activity className="h-10 w-10 text-muted-foreground/40" strokeWidth={1} />
              </div>
              <h3 className="font-semibold mb-1">No activity yet</h3>
              <p className="text-sm text-muted-foreground">Events will appear here as you add, edit, or delete books.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-0">
                {activities.map((act, idx) => {
                  const meta = ACTION_MAP[act.action] ?? {
                    label: act.action,
                    icon: Activity,
                    color: "text-muted-foreground bg-muted",
                  };
                  const Icon = meta.icon;

                  return (
                    <div key={act.id} className="flex gap-4 pl-8 pb-6 relative">
                      {/* Dot on timeline */}
                      <div className={`absolute left-0 top-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-sm font-semibold">{meta.label}</span>
                            <span className="text-muted-foreground text-sm"> — </span>
                            <span className="text-sm font-medium text-primary truncate">{act.target}</span>
                          </div>
                          <time className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                            {new Date(act.created_at).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </time>
                        </div>
                        {act.details && (
                          <p className="text-xs text-muted-foreground mt-0.5">{act.details}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {activities.length >= limit && (
                <div className="flex justify-center pt-2">
                  <Button variant="outline" size="sm" onClick={() => setLimit(l => l + 20)}>
                    Load more
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
