"use client";

import React from "react";
import DataMetric from "../../components/ui/DataMetric";
import Navbar from "../../components/Navbar";

const metrics = [
  { title: "Total Volume (24h)", value: "$4,821,093", trend: "+12.4%" },
  { title: "Active Traders", value: "3,204", trend: "+5.1%" },
  { title: "Liquidity Pool TVL", value: "$18,450,000", trend: "-2.3%" },
  { title: "Average Slippage", value: "0.08%", trend: "+0.01%" },
  { title: "Protocol Revenue", value: "$9,310", trend: "+31.7%" },
  { title: "Failed Transactions", value: "17", trend: "-8.9%" },
  { title: "Network Fee (avg)", value: "0.00001 XLM" },
  { title: "Supported Assets", value: "42" },
];

export default function MetricsDemoPage() {
  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      <Navbar address="" onConnect={() => {}} />

      <div className="flex-1 px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            DataMetric Component Demo
          </h1>
          <p className="text-slate-400">
            Showcasing the reusable{" "}
            <code className="text-blue-400">DataMetric</code> card across
            various analytics scenarios.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <DataMetric
                key={m.title}
                title={m.title}
                value={m.value}
                trend={m.trend}
              />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">
            Portfolio Snapshot
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DataMetric
              title="Total Portfolio Value"
              value="$24,580.00"
              trend="+8.2%"
            />
            <DataMetric
              title="Unrealised P&L"
              value="$1,940.50"
              trend="+3.5%"
            />
            <DataMetric
              title="Best Performer"
              value="XLM / USDC"
              trend="+22.1%"
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-300 mb-4">
            No Trend Variant
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DataMetric title="Total Swaps Executed" value="128,441" />
            <DataMetric title="Supported Networks" value="5" />
            <DataMetric title="Uptime (30d)" value="99.98%" />
          </div>
        </section>
      </div>
    </div>
  );
}
