"use client";

// COMPONENTS
import { Skeleton } from "~/components/ui/skeleton";

// COMP
const DaySkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
};

export default DaySkeleton;
