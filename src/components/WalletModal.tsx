import React from "react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <button
            className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 flex items-center gap-3 transition-colors"
            onClick={() => {
              console.log("Freighter wallet selected");
              onClose();
            }}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Freighter</div>
              <div className="text-sm text-slate-400">Stellar ecosystem wallet</div>
            </div>
          </button>

          <button
            className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 flex items-center gap-3 transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-slate-400">MetaMask</div>
              <div className="text-sm text-slate-500">Coming soon</div>
            </div>
          </button>

          <button
            className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 flex items-center gap-3 transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-slate-400">WalletConnect</div>
              <div className="text-sm text-slate-500">Coming soon</div>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
          <p className="text-sm text-slate-400">
            By connecting a wallet, you agree to the Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
