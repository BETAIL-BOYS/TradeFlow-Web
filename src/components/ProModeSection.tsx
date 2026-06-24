/**
 * Pro Mode Section Component.
 * Handles the logic for toggling advanced trading features,
 * including token-gated access to high-resolution charts.
 */

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Toggle from '../app/Toggle';
import { useTokenStore } from '../stores/tokenStore';
import PremiumUnlockModal from './PremiumUnlockModal';
import { Zap, Crown, Lock } from 'lucide-react';
import SkeletonCard from './ui/SkeletonCard';

const LivePriceChart = dynamic(() => import('../components/LivePriceChart'), {
  ssr: false,
  loading: () => (
    <SkeletonCard height="h-96" className="flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
          Hydrating Pro Engine...
        </p>
      </div>
    </SkeletonCard>
  ),
});

export default function ProModeSection() {
  const [isProMode, setIsProMode] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const { tfTokenBalance, isConnected, hasProModeAccess } = useTokenStore();

  const handleProModeToggle = () => {
    if (!isProMode) {
      if (!isConnected) {
        alert('Please connect your Stellar wallet to access Pro Mode features.');
        return;
      }

      if (!hasProModeAccess()) {
        setShowPaywall(true);
        return;
      }
    }

    setIsProMode(!isProMode);
  };

  return (
    <>
      <section
        className="bg-slate-800/30 rounded-3xl border border-slate-700/50 p-8 mt-12 group transition-all duration-500 hover:bg-slate-800/50"
        aria-labelledby="pro-mode-title"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl transition-colors duration-500 ${isProMode ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-700 text-slate-400'}`}
              >
                {isProMode ? <Zap size={20} /> : <Crown size={20} />}
              </div>
              <h3 id="pro-mode-title" className="text-xl font-bold text-white tracking-tight">
                Pro Mode Analytics
              </h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
              Unlock advanced technical indicators and sub-second price feeds.
              {!isConnected && (
                <span className="flex items-center gap-1.5 mt-2 text-rose-400/80 font-medium">
                  <Lock size={12} /> Connect wallet to unlock
                </span>
              )}
              {isConnected && !hasProModeAccess() && (
                <span className="flex items-center gap-1.5 mt-2 text-blue-400/80 font-medium">
                  <Zap size={12} /> Requires 1,000+ TF utility tokens
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isProMode ? 'text-blue-400' : 'text-slate-600'}`}
            >
              {isProMode ? 'Active' : 'Inactive'}
            </span>
            <Toggle
              isOn={isProMode}
              onToggle={handleProModeToggle}
              disabled={!isConnected || (!hasProModeAccess() && !isProMode)}
            />
          </div>
        </div>

        {isProMode && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <LivePriceChart symbol="TF" />
          </div>
        )}
      </section>

      <PremiumUnlockModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        currentBalance={tfTokenBalance}
      />
    </>
  );
}
