"use client";

import React from "react";
import StickyHeader from "../../../components/StickyHeader";
import { ArrowLeft, ExternalLink, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useInvoice } from "@/hooks/useInvoice";

const INVOICE_ID = "INV-00123";

export default function InvoiceDetailPage() {
  const { invoice, loading, error } = useInvoice(INVOICE_ID);

  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans">
      <StickyHeader
        title="INV-123"
        subtitle="Real World Asset token details and performance metrics"
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/marketplace"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <ExternalLink size={16} />
              Trade
            </button>
          </div>
        }
      />

      <div className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Overview */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Invoice Overview</h2>

              {loading && (
                <p className="text-slate-400 text-sm animate-pulse">Loading on-chain data...</p>
              )}
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg mb-4">
                  Could not load contract data: {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Invoice ID</p>
                  <p className="font-mono text-blue-300">
                    {invoice?.id ?? "INV-00123"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Token ID</p>
                  <p className="font-mono text-green-300">TKN-0x1234...5678</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Principal Amount</p>
                  <p className="text-xl font-bold">
                    {invoice
                      ? `$${(Number(invoice.amount) / 10_000_000).toLocaleString()}`
                      : "$50,000"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Recipient</p>
                  <p className="font-mono text-sm truncate text-slate-300">
                    {invoice?.recipient ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Issuer</p>
                  <p className="font-mono text-sm truncate text-slate-300">
                    {invoice?.issuer ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm font-medium">
                    {invoice?.status ?? "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart — unchanged */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Performance</h2>
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp size={20} />
                  <span className="font-medium">+12.5%</span>
                </div>
              </div>
              <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
                <p className="text-slate-400">Chart visualization would go here</p>
              </div>
            </div>

            {/* Transaction History — unchanged */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              <div className="space-y-3">
                {[
                  { date: "2024-01-15", type: "Payment", amount: "$2,125", status: "Completed" },
                  { date: "2024-01-01", type: "Payment", amount: "$2,125", status: "Completed" },
                  { date: "2023-12-15", type: "Initial", amount: "$50,000", status: "Completed" },
                ].map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="font-medium">{tx.type}</p>
                      <p className="text-slate-400 text-sm">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tx.amount}</p>
                      <p className="text-green-400 text-sm">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — unchanged */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-blue-400" size={20} />
                <h2 className="text-xl font-semibold">Risk Assessment</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Credit Score", value: "A+", width: "85%", color: "bg-green-500" },
                  { label: "Collateral Ratio", value: "150%", width: "75%", color: "bg-blue-500" },
                  { label: "Liquidity Score", value: "High", width: "90%", color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Buy More Tokens
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  View Documents
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}