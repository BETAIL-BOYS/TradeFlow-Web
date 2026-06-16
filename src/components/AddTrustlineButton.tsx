"use client";

import React, { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";
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
    const toastId = showLoading(`Requesting ${assetCode} trustline...`);

    try {
      // 1. Trigger the Stellar SDK / Wallet transaction
      await addTrustline(assetCode, assetIssuer);

      setStatus("success");
      dismissToast(toastId);
      showSuccess(`${assetCode} Trustline Established!`);

      // Revert to idle after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
      console.log(`[AddTrustline] Successfully added ${assetCode} from ${assetIssuer}`);
    } catch (error: any) {
      console.error(`[AddTrustline] Failed to add ${assetCode}:`, error);
      setStatus("error");

      // Handle rejection vs generic error
      const errorMsg = error.message?.includes("denied")
        ? "Access Denied by User"
        : `Failed to add ${assetCode}`;

      dismissToast(toastId);
      showError(errorMsg);

      // Revert to idle after 3 seconds to allow retry
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleAddTrustline}
      disabled={status === "loading" || status === "success"}
      className={`flex items-center gap-2 text-xs py-1.5 px-3 h-auto transition-all duration-200 ${status === "success" ? "bg-green-600/20 text-green-400 border-green-600/50" : ""
        }`}
    >
      {/* Dynamic Icon State */}
      {status === "loading" ? (
        <Icon icon={Loader2} dense className="animate-spin" />
      ) : status === "success" ? (
        <Icon icon={Check} dense />
      ) : (
        <Icon icon={Plus} dense />
      )}

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

// Inconsequential change for repo health

// Maintenance: minor update
