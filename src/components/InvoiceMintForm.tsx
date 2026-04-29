/**
 * Invoice Minting Form Component.
 * Provides a guided interface for users to upload invoice PDFs and 
 * define metadata for on-chain NFT minting.
 */

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Calendar, DollarSign, FileText } from "lucide-react";
import Button from "./ui/Button";

/**
 * Zod validation schema for the invoice minting form.
 * Ensures data integrity before submission to the network.
 */
const invoiceSchema = z.object({
  /** Total value of the invoice in USD */
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount cannot exceed $1,000,000"),
  /** Expected payment date for the invoice */
  dueDate: z
    .string()
    .min(1, "Due date is required")
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
});

/** TypeScript type inferred from the validation schema */
type InvoiceFormData = z.infer<typeof invoiceSchema>;

/**
 * Props for the InvoiceMintForm component.
 */
interface InvoiceMintFormProps {
  /** Callback to trigger when the form is closed/cancelled */
  onClose: () => void;
  /** Callback triggered on successful form validation */
  onSubmit: (data: InvoiceFormData) => void;
}

/**
 * A modal form component for minting new invoice-backed NFTs.
 */
export default function InvoiceMintForm({ onClose, onSubmit }: InvoiceMintFormProps) {
  // --- Component State ---
  /** Stores the name of the uploaded file for UI display */
  const [filePreview, setFilePreview] = useState<string | null>(null);

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

  // --- Handlers ---

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
  };

  return (
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
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.dueDate && (
              <p className="px-1 text-xs font-medium text-rose-400 animate-in slide-in-from-top-1">{errors.dueDate.message}</p>
            )}
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 ml-1">
              <Upload size={14} className="text-indigo-400" />
              Verification Document (PDF)
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
        </form>
      </div>
    </div>
  );
}

