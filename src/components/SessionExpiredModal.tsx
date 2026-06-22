'use client';

import React from 'react';
import { Clock, Wallet } from 'lucide-react';
import { useWeb3Store } from '../stores/useWeb3Store';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onReconnect: () => void;
}

export default function SessionExpiredModal({ isOpen, onReconnect }: SessionExpiredModalProps) {
  const connectWallet = useWeb3Store((state) => state.connectWallet);
  const walletType = useWeb3Store((state) => state.walletType);
  const isConnecting = useWeb3Store((state) => state.isConnecting);

  if (!isOpen) return null;

  const handleReconnect = async () => {
    await connectWallet(walletType ?? undefined);
    onReconnect();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-expired-title"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 id="session-expired-title" className="text-xl font-semibold text-white">
              Session Expired
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your session has been locked after 15 minutes of inactivity. Please reconnect your
              wallet to continue.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-left">
            <p className="text-xs text-amber-300/80 leading-relaxed">
              For your security, your wallet connection and authentication tokens have been cleared.
              You will need to re-sign a message to restore your session.
            </p>
          </div>

          <button
            onClick={handleReconnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? 'Reconnecting…' : 'Reconnect Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
}
