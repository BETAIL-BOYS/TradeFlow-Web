"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { RiskFactor } from "../../types/api";

interface RiskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
  riskScore: number;
  breakdown: RiskFactor[];
}

export default function RiskBreakdownModal({
  isOpen,
  onClose,
  invoiceId,
  riskScore,
  breakdown,
}: RiskBreakdownModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white">Risk Analysis Breakdown</h2>
            <p className="text-slate-400 text-xs font-mono mt-1">Invoice: #{invoiceId.slice(-8)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary Score */}
          <div className="flex items-center gap-6 mb-8 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={226}
                  strokeDashoffset={226 - (226 * riskScore) / 100}
                  className={`${
                    riskScore < 30
                      ? "text-green-500"
                      : riskScore < 70
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                />
              </svg>
              <span className="absolute text-xl font-bold text-white">{riskScore}</span>
            </div>
            <div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Overall Risk Score</div>
              <div className={`text-lg font-bold ${
                riskScore < 30 ? "text-green-400" : riskScore < 70 ? "text-yellow-400" : "text-red-400"
              }`}>
                {riskScore < 30 ? "Low Risk" : riskScore < 70 ? "Medium Risk" : "High Risk"}
              </div>
            </div>
          </div>

          {/* Factors List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Contributing Factors</h3>
            {breakdown.length > 0 ? (
              breakdown.map((factor, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 rounded-xl border transition-all hover:bg-slate-800/40 ${
                    factor.type === "positive"
                      ? "bg-green-500/5 border-green-500/20"
                      : factor.type === "negative"
                      ? "bg-red-500/5 border-red-500/20"
                      : "bg-yellow-500/5 border-yellow-500/20"
                  }`}
                >
                  <div className="mt-0.5">
                    {factor.type === "positive" ? (
                      <CheckCircle2 className="text-green-500" size={18} />
                    ) : factor.type === "negative" ? (
                      <AlertTriangle className="text-red-500" size={18} />
                    ) : (
                      <Info className="text-yellow-500" size={18} />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${
                      factor.type === "positive"
                        ? "text-green-400"
                        : factor.type === "negative"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}>
                      {factor.label}
                    </div>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {factor.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 italic">
                No detailed factor data available for this invoice.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
