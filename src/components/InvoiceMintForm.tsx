/**
 * Invoice Minting Form Component.
 * Provides a guided interface for users to upload invoice PDFs and 
 * define metadata for on-chain NFT minting.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
<<<<<<< HEAD
import { X, Upload, Calendar, DollarSign, FileText } from "lucide-react";
=======
import { X, Upload, Calendar, DollarSign, Building, FileText, Info } from "lucide-react";
import { useSession } from "next-auth/react";
>>>>>>> upstream/main
import Button from "./ui/Button";
import { useMintInvoice } from "@/hooks/useMintInvoice";
import Icon from "./ui/Icon";

// Enhanced validation schema with sanitization
const sanitizeString = (str: string) => str.trim().replace(/[<>"'&]/g, '');

<<<<<<< HEAD
/**
 * Zod validation schema for the invoice minting form.
 * Ensures data integrity before submission to the network.
 */
const invoiceSchema = z.object({
  /** Total value of the invoice in USD */
=======
const invoiceSchema = z.object({
  debtorName: z
    .string()
    .min(2, "Debtor name must be at least 2 characters")
    .max(100, "Debtor name cannot exceed 100 characters")
    .transform(sanitizeString),
>>>>>>> upstream/main
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount cannot exceed $1,000,000"),
  /** Expected payment date for the invoice */
  dueDate: z
    .string()
    .min(1, "Due date is required")
<<<<<<< HEAD
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      "Due date must be in the future"
    ),
  /** PDF document containing the invoice details */
  invoiceFile: z
    .instanceof(File)
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
      "File size must be less than 5MB"
    ),
=======
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today;
    }, "Due date must be in the future"),
  invoiceFile: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Only PDF files are allowed")
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .optional(),
  supportingDocumentUri: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
>>>>>>> upstream/main
});

/** TypeScript type inferred from the validation schema */
type InvoiceFormData = z.infer<typeof invoiceSchema>;

/**
 * Props for the InvoiceMintForm component.
 */
interface InvoiceMintFormProps {
  /** Callback to trigger when the form is closed/cancelled */
  onClose: () => void;
<<<<<<< HEAD
  /** Callback triggered on successful form validation */
  onSubmit: (data: InvoiceFormData) => void;
}

/**
 * A modal form component for minting new invoice-backed NFTs.
 */
export default function InvoiceMintForm({ onClose, onSubmit }: InvoiceMintFormProps) {
  // --- Component State ---
  /** Stores the name of the uploaded file for UI display */
=======
  onSuccess?: (txStatus: string) => void;
}

interface FeeEstimate {
  networkFee: number;
  protocolFee: number;
  totalFee: number;
}

export default function InvoiceMintForm({ onClose, onSuccess }: InvoiceMintFormProps) {
>>>>>>> upstream/main
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [feeEstimate, setFeeEstimate] = useState<FeeEstimate>({
    networkFee: 0,
    protocolFee: 0,
    totalFee: 0
  });
  const { data: session } = useSession();
  const { mint, loading: minting, error: mintError, txStatus } = useMintInvoice();

  // --- Form Initialization ---
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

<<<<<<< HEAD
  // --- Handlers ---
=======
  // Calculate fees whenever amount changes
  const watchedAmount = watch("amount");
  
  useEffect(() => {
    if (watchedAmount && watchedAmount > 0) {
      // Network fee: ~0.01 XLM per transaction (converted to USD)
      // Protocol fee: 0.5% of invoice amount
      const networkFeeXLM = 0.01;
      const xlmPrice = 0.10; // Approximate XLM price in USD (should come from oracle)
      const networkFeeUSD = networkFeeXLM * xlmPrice;
      const protocolFee = watchedAmount * 0.005; // 0.5% protocol fee
      
      setFeeEstimate({
        networkFee: networkFeeUSD,
        protocolFee: protocolFee,
        totalFee: networkFeeUSD + protocolFee
      });
    } else {
      setFeeEstimate({
        networkFee: 0,
        protocolFee: 0,
        totalFee: 0
      });
    }
  }, [watchedAmount]);
>>>>>>> upstream/main

  /**
   * Manually updates the file field in react-hook-form when a file is selected.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePreview(file.name);
      setValue("invoiceFile", file);
    }
  };

<<<<<<< HEAD
  /**
   * Internal submission handler that wraps the provided onSubmit callback.
   * 
   * @param {InvoiceFormData} data - The validated form data.
   */
  const onFormSubmit = (data: InvoiceFormData) => {
    console.log("[InvoiceMintForm] Validated data received:", data);
    onSubmit(data);
    reset();
    setFilePreview(null);
=======
  // Format payload for Soroban smart contract
  const formatContractPayload = (data: InvoiceFormData) => {
    const publicKey = (session?.user as any)?.publicKey;
    const amountInStroops = BigInt(Math.round(data.amount * 10_000_000));
    const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      invoiceId,
      amount: amountInStroops,
      recipient: publicKey,
      callerPublicKey: publicKey,
      metadata: {
        debtorName: data.debtorName,
        dueDate: data.dueDate,
        supportingDocumentUri: data.supportingDocumentUri || null,
        timestamp: Date.now()
      }
    };
>>>>>>> upstream/main
  };

  const onFormSubmit = async (data: InvoiceFormData) => {
    const publicKey = (session?.user as any)?.publicKey;
    if (!publicKey) {
      alert("Please connect your Stellar wallet first.");
      return;
    }

    // Validate that at least one document is provided
    if (!data.invoiceFile && !data.supportingDocumentUri) {
      alert("Please provide either an invoice file or a supporting document URI.");
      return;
    }

    try {
      const contractPayload = formatContractPayload(data);
      const status = await mint(contractPayload);

      reset();
      setFilePreview(null);
      onSuccess?.(status);
      onClose();
    } catch {
      // mintError state handles display below
    }
  };

  const busy = isSubmitting || minting;

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-slate-800 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <FileText size={20} />
            </div>
            <h2 id="modal-title" className="text-xl font-bold text-white tracking-tight">Mint Invoice NFT</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 ml-1">
              <DollarSign size={14} className="text-emerald-400" />
              Invoice Value (USD)
            </label>
            <div className="relative group">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
                className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-slate-600"
              />
            </div>
            {errors.amount && (
              <p className="px-1 text-xs font-medium text-rose-400 animate-in slide-in-from-top-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Due Date Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 ml-1">
              <Calendar size={14} className="text-blue-400" />
              Payment Due Date
=======
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Mint Invoice NFT</h2>
            <p className="text-sm text-slate-400 mt-1">Submit your invoice for factoring</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <Icon icon={X} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Debtor Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={Building} dense className="inline mr-1" />
              Debtor Name *
            </label>
            <input
              type="text"
              placeholder="Enter debtor company or individual name"
              {...register("debtorName")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.debtorName && <p className="mt-2 text-sm text-red-400">{errors.debtorName.message}</p>}
          </div>

          {/* Invoice Amount Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={DollarSign} dense className="inline mr-1" />
              Invoice Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.amount && <p className="mt-2 text-sm text-red-400">{errors.amount.message}</p>}
          </div>

          {/* Due Date Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={Calendar} dense className="inline mr-1" />
              Due Date *
>>>>>>> upstream/main
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
<<<<<<< HEAD
            {errors.dueDate && (
              <p className="px-1 text-xs font-medium text-rose-400 animate-in slide-in-from-top-1">{errors.dueDate.message}</p>
            )}
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 ml-1">
              <Upload size={14} className="text-indigo-400" />
              Verification Document (PDF)
=======
            {errors.dueDate && <p className="mt-2 text-sm text-red-400">{errors.dueDate.message}</p>}
          </div>

          {/* Invoice File Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={Upload} dense className="inline mr-1" />
              Invoice Document (PDF)
>>>>>>> upstream/main
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="invoice-file"
                aria-describedby="file-error"
              />
              <label
                htmlFor="invoice-file"
                className={`flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                  filePreview 
                  ? "bg-indigo-500/5 border-indigo-500/50" 
                  : "bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-900/80"
                }`}
              >
<<<<<<< HEAD
                <Upload size={24} className={`mb-2 ${filePreview ? "text-indigo-400" : "text-slate-500"}`} />
                <span className="text-sm font-medium text-slate-300 text-center px-4">
                  {filePreview || "Drop your PDF here or click to browse"}
                </span>
                {!filePreview && <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Max size: 5MB</span>}
              </label>
            </div>
            {errors.invoiceFile && (
              <p id="file-error" className="px-1 text-xs font-medium text-rose-400 animate-in slide-in-from-top-1">{errors.invoiceFile.message}</p>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-blue-500/10 active:scale-[0.98] transition-transform"
              isLoading={isSubmitting}
            >
              Mint Asset NFT
            </Button>
          </div>
=======
                <Icon icon={Upload} dense className="mr-2 text-slate-400" />
                <span className="text-slate-300">{filePreview || "Choose PDF file"}</span>
              </label>
            </div>
            {errors.invoiceFile && (
              <p className="mt-2 text-sm text-red-400">{errors.invoiceFile.message}</p>
            )}
          </div>

          {/* Supporting Document URI Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Icon icon={FileText} dense className="inline mr-1" />
              Supporting Document URI
            </label>
            <input
              type="url"
              placeholder="https://example.com/invoice-doc.pdf"
              {...register("supportingDocumentUri")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.supportingDocumentUri && (
              <p className="mt-2 text-sm text-red-400">{errors.supportingDocumentUri.message}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">Optional: Provide a link to additional documentation</p>
          </div>

          {/* Fee Breakdown */}
          {feeEstimate.totalFee > 0 && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Icon icon={Info} dense className="mr-2 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Fee Breakdown</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Network Fee:</span>
                  <span>${feeEstimate.networkFee.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Protocol Fee (0.5%):</span>
                  <span>${feeEstimate.protocolFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-200 pt-2 border-t border-slate-600">
                  <span className="font-medium">Total Fees:</span>
                  <span className="font-medium">${feeEstimate.totalFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Contract error feedback */}
          {mintError && (
            <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{mintError}</p>
          )}
          {txStatus && (
            <p className="text-sm text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">
              On-chain: {txStatus}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy || !watch("debtorName") || !watch("amount") || !watch("dueDate")}
            className="w-full py-3 px-4 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {busy ? "Submitting to Stellar..." : "Mint Invoice NFT"}
          </Button>
>>>>>>> upstream/main
        </form>
      </div>
    </div>
  );
}
<<<<<<< HEAD

=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
