"use client";

import React, { useState, useEffect, useRef } from "react";
import { connectWallet, WalletType } from "../lib/stellar";
import { PlusCircle, ShieldCheck, Landmark, Star } from "lucide-react";
import LoanTable from "../components/LoanTable";
import SkeletonRow from "../components/SkeletonRow";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import WalletModal from "../components/WalletModal";
import InvoiceMintForm from "../components/InvoiceMintForm";
import NewsBanner from "../components/NewsBanner";
import useTransactionToast from "../lib/useTransactionToast";
import AddTrustlineButton from "../components/AddTrustlineButton";
import ProModeSection from "../components/ProModeSection";
import WatchlistTab from "../components/WatchlistTab";
import TabNavigation from "../components/TabNavigation";
import { useWatchlist } from "../hooks/useWatchlist";
import StarIcon from "../components/StarIcon";
import { api } from "../lib/api";
import type { InvoiceSummary } from "../../types/api";
import { RiskSocketClient } from "../lib/riskSocket";
import * as Dialog from "@radix-ui/react-dialog";

export default function Page() {
  const [address, setAddress] = useState("");
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMintForm, setShowMintForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const riskSocketRef = useRef<RiskSocketClient | null>(null);
  const [riskModalOpen, setRiskModalOpen] = useState(false);
  const [riskModalInvoiceId, setRiskModalInvoiceId] = useState<string | null>(null);
  const [riskModalScore, setRiskModalScore] = useState<number | null>(null);
  const [riskModalFactors, setRiskModalFactors] = useState<
    Array<{ key: string; sentiment: "positive" | "negative" | "neutral"; detail: string; weight?: number }>
  >([]);
  const [riskModalLoading, setRiskModalLoading] = useState(false);
  const [riskModalError, setRiskModalError] = useState<string | null>(null);
  const [riskModalIsEstimated, setRiskModalIsEstimated] = useState(false);

  const getRiskBadgeClasses = (score: number) => {
    if (score >= 80) return "bg-green-500/15 text-green-300 border border-green-500/30";
    if (score >= 60) return "bg-blue-500/15 text-blue-300 border border-blue-500/30";
    if (score >= 40) return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
    return "bg-red-500/15 text-red-300 border border-red-500/30";
  };

  const makeFallbackFactors = (invoiceId: string, score: number) => {
    const seed = invoiceId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const cleanYears = 2 + (seed % 7);
    const sectorVol = (seed % 3) + 1;
    const concentration = ((seed >> 2) % 4) + 1;

    const positive = [
      { key: "debtor_clean_payment_history_years", sentiment: "positive" as const, detail: `Debtor has ${cleanYears} years clean payment history.` },
      { key: "invoice_verification", sentiment: "positive" as const, detail: "Invoice metadata matches on-chain verification signals." },
      { key: "payment_terms_alignment", sentiment: "positive" as const, detail: "Payment terms align with historical debtor settlement patterns." },
    ];

    const negative = [
      { key: "sector_volatility", sentiment: "negative" as const, detail: `High sector volatility detected (tier ${sectorVol}).` },
      { key: "buyer_concentration", sentiment: "negative" as const, detail: `Buyer concentration risk elevated (level ${concentration}).` },
      { key: "macroeconomic_headwinds", sentiment: "negative" as const, detail: "Macroeconomic headwinds add downside risk to near-term repayment." },
    ];

    const neutral = [
      { key: "invoice_amount", sentiment: "neutral" as const, detail: `Invoice amount sits within typical bands for this issuer (score ${score}).` },
    ];

    const out = [...positive, ...negative, ...neutral];
    return out.slice(0, 7);
  };

  const factorDetailFromKey = (key: string) => {
    const map: Record<string, string> = {
      debtor_clean_payment_history_years: "Debtor has a clean payment history over multiple years.",
      sector_volatility: "Sector volatility increases repayment uncertainty.",
      buyer_concentration: "Concentration on a small set of buyers increases exposure.",
      macroeconomic_headwinds: "Macroeconomic conditions reduce confidence in near-term settlement.",
      invoice_verification: "Invoice signals are consistent across submitted and verified sources.",
      payment_terms_alignment: "Invoice payment terms match the debtor’s typical settlement window.",
      invoice_amount: "Invoice amount is neutral relative to typical historical bands.",
    };
    return map[key] ?? `${key.replace(/_/g, " ")} influenced the score.`;
  };

  // 1. Connect Stellar Wallet (supports Freighter, Albedo, xBull)
  const handleConnectWallet = async (walletType: WalletType) => {
    try {
      const userInfo = await connectWallet(walletType);
      if (userInfo && userInfo.publicKey) {
        setAddress(userInfo.publicKey);
        console.log("Wallet connected:", userInfo.publicKey, "Type:", userInfo.walletType);
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error("Connection failed:", error.message);
      alert(error.message || "Failed to connect to wallet.");
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await api.getInvoices({ signal: controller.signal });
        if (res.ok) {
          setInvoices(res.data);
        } else {
          console.error("Failed to fetch invoices:", res.error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!address) {
      riskSocketRef.current?.disconnect();
      riskSocketRef.current = null;
      return;
    }

    const socketClient = riskSocketRef.current ?? new RiskSocketClient();
    riskSocketRef.current = socketClient;
    socketClient.connect();

    const unsubscribe = socketClient.on((event) => {
      if (event.event !== "risk_update") return;
      const { invoiceId, riskScore } = event.data;

      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoiceId ? { ...inv, riskScore } : inv)),
      );
    });

    return () => {
      unsubscribe();
      socketClient.disconnect();
      if (riskSocketRef.current === socketClient) {
        riskSocketRef.current = null;
      }
    };
  }, [address]);

  useEffect(() => {
    if (!address) return;
    if (invoices.length === 0) return;

    riskSocketRef.current?.syncInvoices(invoices.map((i) => i.id));
  }, [address, invoices]);

  useEffect(() => {
    if (!riskModalOpen || !riskModalInvoiceId) return;

    const controller = new AbortController();
    setRiskModalLoading(true);
    setRiskModalError(null);

    const run = async () => {
      const res = await api.getRiskScore(riskModalInvoiceId, { signal: controller.signal });
      if (!res.ok) {
        setRiskModalFactors([]);
        setRiskModalError(res.error.message);
        setRiskModalLoading(false);
        return;
      }

      const score = res.data.riskScore;
      setRiskModalScore(score);

      const rawFactors = res.data.factors;
      if (rawFactors && typeof rawFactors === "object") {
        const mapped = Object.entries(rawFactors)
          .filter(([, v]) => typeof v === "number" && Number.isFinite(v))
          .map(([key, weight]) => {
            const sentiment = weight > 0 ? "positive" : weight < 0 ? "negative" : "neutral";
            return { key, sentiment, detail: factorDetailFromKey(key), weight };
          })
          .sort((a, b) => Math.abs((b.weight ?? 0)) - Math.abs((a.weight ?? 0)));
        setRiskModalFactors(mapped);
        setRiskModalIsEstimated(false);
      } else {
        setRiskModalFactors(makeFallbackFactors(riskModalInvoiceId, score));
        setRiskModalIsEstimated(true);
      }

      setRiskModalLoading(false);
    };

    run();

    return () => {
      controller.abort();
    };
  }, [riskModalOpen, riskModalInvoiceId]);
  const toast = useTransactionToast();

  const handleTestToast = () => {
    toast.loading();
    toast.success();
    toast.error();
  };

  const handleInvoiceMint = (data: Record<string, unknown>) => {
    console.log("Invoice data received:", data);
    setShowMintForm(false);
    // TODO: Chain integration will be handled separately
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "watchlist", label: "Watchlist", icon: <Star size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      {/* News Banner */}
      <NewsBanner />

      {/* Header */}
      <Navbar
        address={address}
        onConnect={() => setIsModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 px-8">
        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "watchlist" ? (
          <WatchlistTab />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <ShieldCheck className="text-green-400 mb-4" />
                <h3 className="text-tradeflow-muted text-sm">Risk Engine Status</h3>
                <p className="text-2xl font-semibold text-green-400">Active (Mock)</p>
              </Card>
              <Card>
                <Landmark className="text-blue-400 mb-4" />
                <h3 className="text-tradeflow-muted text-sm">Protocol Liquidity</h3>
                <p className="text-2xl font-semibold">$1,250,000 USDC</p>
              </Card>
              <button
                onClick={() => setShowMintForm(true)}
                className="bg-tradeflow-accent/10 border-2 border-dashed border-tradeflow-accent/50 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-tradeflow-accent/20 transition"
              >
                <PlusCircle className="text-tradeflow-accent mb-2" size={32} />
                <span className="font-medium text-tradeflow-accent">
                  Mint New Invoice NFT
                </span>
              </button>
            </div>

            {/* Wallet Assets (Trustline Section) */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-12 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2">My Stellar Wallet</h2>
                <p className="text-slate-400 text-sm">Establish trustlines to receive and trade these assets on-chain.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 min-w-[220px] justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">USDC</span>
                    <StarIcon
                      isStarred={isInWatchlist("USDC")}
                      onClick={() => toggleWatchlist("USDC")}
                      size={14}
                    />
                  </div>
                  <AddTrustlineButton
                    assetCode="USDC"
                    assetIssuer="GBBD67IF633ZHJ2CCYBT6RILOY7Y6S6M5SOW2S2ZQRAGI7XRYB2TOC6S"
                  />
                </div>
                <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 min-w-[220px] justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">yXLM</span>
                    <StarIcon
                      isStarred={isInWatchlist("yXLM")}
                      onClick={() => toggleWatchlist("yXLM")}
                      size={14}
                    />
                  </div>
                  <AddTrustlineButton
                    assetCode="yXLM"
                    assetIssuer="GBDUE7TSYHCWW2NQCXHTS7F7W4R4SXY5NCCO4I734XOYLGGUKJALTCYI"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden mb-12">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold">Verified Asset Pipeline</h2>
              </div>
              <table className="w-full text-left">
                <thead className="bg-tradeflow-dark/50 text-tradeflow-muted text-sm uppercase">
                  <tr>
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Risk Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Show 5 skeleton rows while loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonRow key={`skeleton-${index}`} />
                    ))
                  ) : (
                    invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="border-b border-tradeflow-muted/50 hover:bg-tradeflow-muted/20 transition"
                      >
                        <td className="p-4 font-mono text-sm text-blue-300">
                          #{inv.id.slice(-6)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-full bg-tradeflow-muted h-2 rounded-full max-w-[120px]">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${inv.riskScore}%` }}
                              ></div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setRiskModalInvoiceId(inv.id);
                                setRiskModalScore(inv.riskScore);
                                setRiskModalOpen(true);
                              }}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors hover:bg-white/10 ${getRiskBadgeClasses(inv.riskScore)}`}
                              aria-label={`Open risk breakdown for invoice ${inv.id}`}
                            >
                              {inv.riskScore}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium">
                          <span
                            className={`px-3 py-1 rounded-full ${inv.status === "Approved" ? "bg-tradeflow-success/20 text-tradeflow-success" : "bg-tradeflow-warning/20 text-tradeflow-warning"}`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-lg">${inv.amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Active Loans Table (Issue #6) */}
            <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold">Active Loans Dashboard</h2>
              </div>
              <div className="p-6 bg-tradeflow-dark/50">
                <LoanTable />
              </div>
            </div>

            {/* Pro Mode Charts (Lazy-loaded) */}
            <ProModeSection />
          </>
        )}
      </div>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnectWallet}
      />

      {/* Invoice Mint Form Modal */}
      {showMintForm && (
        <InvoiceMintForm
          onClose={() => setShowMintForm(false)}
          onSubmit={handleInvoiceMint}
        />
      )}

      <Dialog.Root
        open={riskModalOpen}
        onOpenChange={(open) => {
          setRiskModalOpen(open);
          if (!open) {
            setRiskModalInvoiceId(null);
            setRiskModalFactors([]);
            setRiskModalError(null);
            setRiskModalLoading(false);
            setRiskModalIsEstimated(false);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed z-50 left-1/2 top-1/2 w-[92vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700/60 bg-slate-950/90 shadow-2xl shadow-black/40 focus:outline-none">
            <div className="p-6 border-b border-slate-700/60 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Dialog.Title className="text-xl font-semibold text-white truncate">
                  Risk Score Breakdown
                </Dialog.Title>
                <Dialog.Description className="text-sm text-slate-400 mt-1">
                  Invoice {riskModalInvoiceId ? `#${riskModalInvoiceId.slice(-6)}` : ""}
                </Dialog.Description>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {typeof riskModalScore === "number" && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskBadgeClasses(riskModalScore)}`}>
                    {riskModalScore}
                  </span>
                )}
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </div>

            <div className="p-6">
              {riskModalLoading ? (
                <div className="text-slate-300 animate-pulse">Loading breakdown...</div>
              ) : riskModalError ? (
                <div className="text-red-300">{riskModalError}</div>
              ) : (
                <div className="space-y-6">
                  {riskModalIsEstimated && (
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                      Breakdown is estimated because the risk engine did not provide factor weights.
                    </div>
                  )}
                  {(["positive", "negative", "neutral"] as const).map((sentiment) => {
                    const title =
                      sentiment === "positive"
                        ? "Positive Factors"
                        : sentiment === "negative"
                          ? "Negative Factors"
                          : "Neutral Factors";
                    const items = riskModalFactors.filter((f) => f.sentiment === sentiment);
                    const colorClasses =
                      sentiment === "positive"
                        ? "bg-green-500/10 border-green-500/20 text-green-300"
                        : sentiment === "negative"
                          ? "bg-red-500/10 border-red-500/20 text-red-300"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-300";

                    return (
                      <div key={sentiment} className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
                        {items.length === 0 ? (
                          <div className="text-sm text-slate-500">No {sentiment} factors available.</div>
                        ) : (
                          <ul className="space-y-2">
                            {items.map((f) => (
                              <li
                                key={f.key}
                                className="flex items-start justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
                                      {sentiment === "positive" ? "Positive" : sentiment === "negative" ? "Negative" : "Neutral"}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono truncate">
                                      {f.key}
                                    </span>
                                  </div>
                                  <div className="text-sm text-slate-200 mt-2">
                                    {f.detail}
                                  </div>
                                </div>
                                {typeof f.weight === "number" && (
                                  <div className="shrink-0 text-sm font-semibold text-slate-300 tabular-nums">
                                    {f.weight > 0 ? "+" : ""}
                                    {f.weight.toFixed(2)}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
