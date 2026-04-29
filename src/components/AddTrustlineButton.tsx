<<<<<<< HEAD
/**
 * Add Trustline Button Component.
 * Encapsulates the logic for establishing a Stellar trustline for a specific asset.
 * A trustline is mandatory before an account can hold non-native assets.
 */

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, Check, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
=======
"use client";

import React, { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
>>>>>>> upstream/main
import { addTrustline } from "../lib/stellar";
import { dismissToast, showError, showLoading, showSuccess } from "../lib/toast";
import Button from "./ui/Button";
import Icon from "./ui/Icon";

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
<<<<<<< HEAD
    const toastId = toast.loading(`Establishing ${assetCode} trustline...`);
=======
    const toastId = showLoading(`Requesting ${assetCode} trustline...`);
>>>>>>> upstream/main

    try {
      // 1. Trigger the Stellar SDK / Wallet transaction
      await addTrustline(assetCode, assetIssuer);

      setStatus("success");
<<<<<<< HEAD
      toast.success(`${assetCode} Trustline Active`, { 
        id: toastId,
        icon: '🛡️'
      });
      
      // 2. Revert to idle after 5 seconds to reset UI
=======
      dismissToast(toastId);
      showSuccess(`${assetCode} Trustline Established!`);

      // Revert to idle after 5 seconds
>>>>>>> upstream/main
      setTimeout(() => setStatus("idle"), 5000);
      console.log(`[AddTrustline] Successfully added ${assetCode} from ${assetIssuer}`);
    } catch (error: any) {
      console.error(`[AddTrustline] Failed to add ${assetCode}:`, error);
      setStatus("error");
<<<<<<< HEAD
      
      // User-friendly error mapping
      const errorMsg = error.message?.toLowerCase().includes("denied") 
        ? "Transaction rejected by user" 
        : `Network error adding ${assetCode}`;
        
      toast.error(errorMsg, { id: toastId });
      
      // 3. Revert to idle after a short delay to allow retry
=======

      // Handle rejection vs generic error
      const errorMsg = error.message?.includes("denied")
        ? "Access Denied by User"
        : `Failed to add ${assetCode}`;

      dismissToast(toastId);
      showError(errorMsg);

      // Revert to idle after 3 seconds to allow retry
>>>>>>> upstream/main
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleAddTrustline}
      disabled={status === "loading" || status === "success"}
<<<<<<< HEAD
      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-2 px-4 h-auto transition-all duration-300 border ${
        status === "success" 
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
          : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
      }`}
      aria-label={`Add trustline for ${assetCode}`}
=======
      className={`flex items-center gap-2 text-xs py-1.5 px-3 h-auto transition-all duration-200 ${status === "success" ? "bg-green-600/20 text-green-400 border-green-600/50" : ""
        }`}
>>>>>>> upstream/main
    >
      {/* Dynamic Icon State */}
      {status === "loading" ? (
<<<<<<< HEAD
        <Loader2 size={12} className="animate-spin text-blue-400" />
      ) : status === "success" ? (
        <ShieldCheck size={12} className="text-emerald-400" />
      ) : status === "error" ? (
        <AlertCircle size={12} className="text-rose-400" />
      ) : (
        <Plus size={12} className="group-hover:rotate-90 transition-transform" />
      )}
      
      {/* Dynamic Label State */}
=======
        <Icon icon={Loader2} dense className="animate-spin" />
      ) : status === "success" ? (
        <Icon icon={Check} dense />
      ) : (
        <Icon icon={Plus} dense />
      )}

>>>>>>> upstream/main
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

<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
