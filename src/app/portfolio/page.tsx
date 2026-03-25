"use client";

import React, { useState, useEffect } from "react";
import { connectWallet, WalletType } from "../../lib/stellar";
import Navbar from "../../../Navbar";
import WalletModal from "../../components/WalletModal";
import PortfolioChart from "../../components/PortfolioChart";

export default function PortfolioPage() {
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectWallet = async (walletType: WalletType) => {
    try {
      const userInfo = await connectWallet(walletType);
      if (userInfo && userInfo.publicKey) {
        setAddress(userInfo.publicKey);
        console.log("Wallet connected:", userInfo.publicKey, "Type:", userInfo.walletType);
      }
    } catch (e: any) {
      console.error("Connection failed:", e.message);
      alert(e.message || "Failed to connect to wallet.");
    }
  };

  return (
    <div className="min-h-screen bg-tradeflow-dark text-white font-sans flex flex-col">
      {/* Header */}
      <Navbar
        address={address}
        onConnect={() => setIsModalOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-tradeflow-muted">Track your wealth growth over time</p>
        </div>

        {/* Portfolio Chart */}
        <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6 mb-8">
          <PortfolioChart />
        </div>

        {/* Additional portfolio content can go here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-green-400">$0.00</p>
            <p className="text-sm text-tradeflow-muted mt-1">+0% (24h)</p>
          </div>
          <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Assets</h3>
            <p className="text-2xl font-bold text-blue-400">0</p>
            <p className="text-sm text-tradeflow-muted mt-1">Total positions</p>
          </div>
          <div className="bg-tradeflow-secondary rounded-2xl border border-tradeflow-muted p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Best Performer</h3>
            <p className="text-2xl font-bold text-purple-400">-</p>
            <p className="text-sm text-tradeflow-muted mt-1">No data yet</p>
          </div>
        </div>
      </div>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnectWallet}
      />
    </div>
  );
}
