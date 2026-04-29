/**
 * Add Trustline Button Component.
 * Encapsulates the logic for establishing a Stellar trustline for a specific asset.
 * A trustline is mandatory before an account can hold non-native assets.
 */

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, Check, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { addTrustline } from "../lib/stellar";
import Button from "./ui/Button";

/**
 * Props for the AddTrustlineButton component.
 */
interface AddTrustlineButtonProps {
  /** The 1-12 character asset code (e.g., "USDC") */
  assetCode: string;
  /** The public Stellar address of the asset issuer */
  assetIssuer: string;
}

/**
 * A specialized button that handles the 'change_trust' operation flow.
 */
export default function AddTrustlineButton({ assetCode, assetIssuer }: AddTrustlineButtonProps) {
  // --- Component State ---
  /** Current status of the asynchronous trustline operation */
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  /**
   * Initiates the trustline transaction flow.
   */
  const handleAddTrustline = async () => {
    // Prevent redundant clicks
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    const toastId = toast.loading(`Establishing ${assetCode} trustline...`);

    try {
      // 1. Trigger the Stellar SDK / Wallet transaction
      await addTrustline(assetCode, assetIssuer);
      
      setStatus("success");
      toast.success(`${assetCode} Trustline Active`, { 
        id: toastId,
        icon: '🛡️'
      });
      
      // 2. Revert to idle after 5 seconds to reset UI
      setTimeout(() => setStatus("idle"), 5000);
      console.log(`[AddTrustline] Successfully added ${assetCode} from ${assetIssuer}`);
    } catch (error: any) {
      console.error(`[AddTrustline] Failed to add ${assetCode}:`, error);
      setStatus("error");
      
      // User-friendly error mapping
      const errorMsg = error.message?.toLowerCase().includes("denied") 
        ? "Transaction rejected by user" 
        : `Network error adding ${assetCode}`;
        
      toast.error(errorMsg, { id: toastId });
      
      // 3. Revert to idle after a short delay to allow retry
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleAddTrustline}
      disabled={status === "loading" || status === "success"}
      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-2 px-4 h-auto transition-all duration-300 border ${
        status === "success" 
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
          : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
      }`}
      aria-label={`Add trustline for ${assetCode}`}
    >
      {/* Dynamic Icon State */}
      {status === "loading" ? (
        <Loader2 size={12} className="animate-spin text-blue-400" />
      ) : status === "success" ? (
        <ShieldCheck size={12} className="text-emerald-400" />
      ) : status === "error" ? (
        <AlertCircle size={12} className="text-rose-400" />
      ) : (
        <Plus size={12} className="group-hover:rotate-90 transition-transform" />
      )}
      
      {/* Dynamic Label State */}
      <span>
        {status === "loading" 
          ? "Signing..." 
          : status === "success" 
            ? "Established" 
            : status === "error"
              ? "Retry"
              : `Add ${assetCode}`
        }
      </span>
    </Button>
  );
}

