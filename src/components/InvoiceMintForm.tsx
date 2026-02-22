"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Calendar, DollarSign } from "lucide-react";

// Form validation schema
const invoiceSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount cannot exceed $1,000,000"),
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
  invoiceFile: z
    .instanceof(File)
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      "File size must be less than 5MB"
    ),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceMintFormProps {
  onClose: () => void;
  onSubmit: (data: InvoiceFormData) => void;
}

export default function InvoiceMintForm({ onClose, onSubmit }: InvoiceMintFormProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null);

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

  const watchedFile = watch("invoiceFile");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePreview(file.name);
      setValue("invoiceFile", file);
    }
  };

  const onFormSubmit = (data: InvoiceFormData) => {
    console.log("Invoice minting data:", data);
    onSubmit(data);
    reset();
    setFilePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Mint Invoice NFT</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Invoice Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.amount && (
              <p className="mt-2 text-sm text-red-400">{errors.amount.message}</p>
            )}
          </div>

          {/* Due Date Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-400">{errors.dueDate.message}</p>
            )}
          </div>

          {/* File Upload Field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Upload size={16} className="inline mr-1" />
              Invoice Document (PDF)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="invoice-file"
              />
              <label
                htmlFor="invoice-file"
                className="flex items-center justify-center w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
              >
                <Upload size={16} className="mr-2 text-slate-400" />
                <span className="text-slate-300">
                  {filePreview || "Choose PDF file"}
                </span>
              </label>
            </div>
            {errors.invoiceFile && (
              <p className="mt-2 text-sm text-red-400">{errors.invoiceFile.message}</p>
            )}
            {filePreview && (
              <p className="mt-2 text-sm text-slate-400">
                Selected: {filePreview}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {isSubmitting ? "Processing..." : "Mint Invoice NFT"}
          </button>
        </form>
      </div>
    </div>
  );
}
