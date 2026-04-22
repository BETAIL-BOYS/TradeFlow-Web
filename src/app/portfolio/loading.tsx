import React from 'react';
import Navbar from '../../components/Navbar';
import ChartSkeleton from '../../components/ui/ChartSkeleton';
import MetricSkeleton from '../../components/ui/MetricSkeleton';

export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      {/* Header - Navbar doesn't usually need a skeleton as it's static/fast */}
      <Navbar address="" onConnect={() => {}} />

      {/* Main Content */}
      <div className="flex-1 px-8 py-8">
        <div className="mb-8">
          <div className="h-9 w-48 bg-slate-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-slate-800/60 rounded animate-pulse"></div>
        </div>

        {/* Portfolio Chart Skeleton */}
        <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6 mb-8">
          <ChartSkeleton />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
      </div>
    </div>
  );
}
