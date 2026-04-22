import React from 'react';
import Skeleton from './Skeleton';

export default function ChartSkeleton() {
  return (
    <div className="w-full h-64 flex flex-col space-y-4">
      <div className="flex-1 w-full relative overflow-hidden bg-slate-900/20 rounded-lg p-4">
        {/* Simulating a chart with lines/bars */}
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
          {[...Array(12)].map((_, i) => (
            <Skeleton 
              key={i} 
              className={`w-4 bg-slate-700/30 rounded-t-sm`} 
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-8 bg-slate-700/50" />
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-12 right-4 bottom-2 flex justify-between">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-10 bg-slate-700/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
