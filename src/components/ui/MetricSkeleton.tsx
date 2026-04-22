import React from 'react';
import Skeleton from './Skeleton';

export default function MetricSkeleton() {
  return (
    <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-32 mb-1.5" />
      <Skeleton className="h-3 w-12" />
    </div>
  );
}
