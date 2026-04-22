import React from 'react';
import Navbar from '../components/Navbar';
import TableSkeleton from '../components/TableSkeleton';
import CardSkeleton from '../components/ui/CardSkeleton';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      <Navbar address="" onConnect={() => {}} />

      <div className="flex-1 px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="h-9 w-48 bg-slate-800 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-slate-800/60 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-slate-800 rounded-xl animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-tradeflow-secondary border border-tradeflow-muted rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-tradeflow-muted">
                <div className="h-6 w-32 bg-slate-800 rounded animate-pulse"></div>
              </div>
              <TableSkeleton />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <CardSkeleton />
            <div className="bg-tradeflow-secondary border border-tradeflow-muted rounded-2xl p-6">
              <div className="h-6 w-40 bg-slate-800 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-slate-800/60 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
