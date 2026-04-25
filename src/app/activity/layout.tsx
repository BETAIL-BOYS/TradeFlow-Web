"use client";

import React, { useState, useEffect } from "react";
import { connectWallet, WalletType } from "../../lib/stellar";
import Sidebar from "../../components/Sidebar";
import WalletModal from "../../components/WalletModal";

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectWallet = async (walletType: WalletType) => {
    try {
      const userInfo = await connectWallet(walletType);
      if (userInfo && userInfo.publicKey) {
        setAddress(userInfo.publicKey);
        console.log(
          "Wallet connected:",
          userInfo.publicKey,
          "Type:",
          userInfo.walletType,
        );
      }
    } catch (e: any) {
      console.error("Connection failed:", e.message);
      alert(e.message || "Failed to connect to wallet.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex">
      {/* Sidebar */}
      <Sidebar address={address} onConnect={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnectWallet}
      />
    </div>
  );
}
