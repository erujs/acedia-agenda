"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DailyTasksSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            {/* Title + Date */}
            <div className="flex items-start justify-between">
              <Skeleton className="h-6 w-24 bg-background" />
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-20 ml-auto bg-background" />
                <Skeleton className="h-3 w-32 ml-auto bg-background" />
              </div>
            </div>

            {/* Quote */}
            <Skeleton className="h-4 w-2/3 mt-2 bg-background" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Task rows */}
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-border"
                >
                  <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 bg-background" />
                  <Skeleton className="h-4 bg-background" style={{ width: `${55 + (i % 4) * 10}%` }} />
                </div>
              ))}
            </div>

            {/* Progress section */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16 bg-background" />
                <Skeleton className="h-4 w-28 bg-background" />
              </div>

              <Skeleton className="h-3 w-full rounded-full bg-background" />

              <div className="flex justify-center">
                <Skeleton className="h-8 w-14 bg-background" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}