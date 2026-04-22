import React from 'react';
import Skeleton from './ui/Skeleton';

interface SkeletonRowProps {
  columns?: number;
}

const SkeletonRow = ({ columns = 4 }: SkeletonRowProps) => {
  return (
    <tr className="border-b border-slate-700/50">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton 
            className={i === columns - 1 ? "ml-auto h-4 w-16" : "h-4 w-24"} 
          />
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
