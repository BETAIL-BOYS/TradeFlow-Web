import React from 'react';
import Navbar from '../../components/Navbar';
import TableSkeleton from '../../components/TableSkeleton';
import MetricSkeleton from '../../components/ui/MetricSkeleton';

export default function PoolsLoading() {
  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      <Navbar address="" onConnect={() => {}} />

      <div className="flex-1 px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="h-9 w-64 bg-slate-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-slate-800/60 rounded animate-pulse"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>

        {/* Pools Table Skeleton */}
        <div className="bg-tradeflow-secondary border border-tradeflow-muted rounded-2xl overflow-hidden shadow-xl">
          <TableSkeleton />
        </div>
      </div>
    </div>
  );
}
