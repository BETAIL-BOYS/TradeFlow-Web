"use client";

import React, { useState } from "react";
import RiskBreakdownModal from "./RiskBreakdownModal";
import { RiskFactor } from "../types/api";

interface RiskScoreBadgeProps {
  invoiceId: string;
  riskScore: number;
  breakdown?: RiskFactor[];
}

export default function RiskScoreBadge({
  invoiceId,
  riskScore,
  breakdown = [],
}: RiskScoreBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine color based on score (Lower is better in this context, or higher? 
  // Usually Risk Score 0-100 where 100 is high risk. 
  // Let's assume 0-30 Green, 31-70 Yellow, 71-100 Red)
  const getScoreColor = (score: number) => {
    if (score < 30) return "bg-green-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBadgeStyles = (score: number) => {
    if (score < 30) return "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20";
    if (score < 70) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20";
  };

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer group ${getBadgeStyles(riskScore)}`}
        >
          <span>{riskScore}</span>
          <span className="opacity-60 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="9 5l7 7-7 7"
              />
            </svg>
          </span>
        </button>
        
        {/* Mini progress bar under the badge */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-[80px]">
          <div
            className={`${getScoreColor(riskScore)} h-full rounded-full transition-all duration-500`}
            style={{ width: `${riskScore}%` }}
          ></div>
        </div>
      </div>

      <RiskBreakdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoiceId={invoiceId}
        riskScore={riskScore}
        breakdown={breakdown}
      />
    </>
  );
}
