/**
 * Skeleton Row Component.
 * A loading placeholder for table rows, providing visual feedback while 
 * asynchronous data (like invoice lists) is being fetched.
 */

import React from 'react';

/**
 * Renders a set of pulsing placeholder elements that mimic the layout 
 * of a standard table row.
 */
const SkeletonRow = () => {
  return (
    <tr 
      className="border-b border-slate-700/50 bg-slate-900/20"
      aria-hidden="true"
    >
      {/* 1. Asset ID Placeholder */}
      <td className="px-6 py-5">
        <div className="h-3 w-16 bg-slate-800 rounded-full animate-pulse"></div>
      </td>
      
      {/* 2. Amount Placeholder */}
      <td className="px-6 py-5">
        <div className="h-4 w-24 bg-slate-800 rounded-lg animate-pulse"></div>
      </td>
      
      {/* 3. Interest/Badge Placeholder */}
      <td className="px-6 py-5">
        <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse opacity-60"></div>
      </td>
      
      {/* 4. Status Placeholder */}
      <td className="px-6 py-5">
        <div className="h-3 w-14 bg-slate-800 rounded-full animate-pulse"></div>
      </td>
      
      {/* 5. Action Button Placeholder */}
      <td className="px-6 py-5 text-right">
        <div className="h-9 w-20 bg-slate-800 rounded-xl animate-pulse ml-auto"></div>
      </td>
    </tr>
  );
};

export default SkeletonRow;

