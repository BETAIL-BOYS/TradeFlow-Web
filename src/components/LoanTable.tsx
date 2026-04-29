<<<<<<< HEAD
/**
 * Loan Tracking Table Component.
 * Displays a list of active and historical loans associated with the user's invoices.
 * Includes interest calculation logic and repayment actions.
 */
=======
"use client";
>>>>>>> upstream/main

import React from 'react';
import { formatCurrency, formatDate } from '../lib/format';

/**
 * Valid states for a loan within the protocol.
 */
type LoanStatus = 'Active' | 'Overdue' | 'Repaid';

/**
 * Data structure representing an on-chain loan.
 */
interface Loan {
  /** Unique identifier for the loan record */
  id: string;
  /** The ID of the invoice used as collateral */
  invoiceId: string;
  /** Principal amount borrowed */
  amountBorrowed: number;
  /** Annual interest rate (e.g., 5 for 5%) */
  interestRate: number;
  /** ISO 8601 timestamp of when the loan was initiated */
  startDate: string;
  /** Current lifecycle status of the loan */
  status: LoanStatus;
}

/**
 * Simulated on-chain loan data for development.
 */
const MOCK_LOANS: Loan[] = [
  { id: 'L-001', invoiceId: 'INV-8821', amountBorrowed: 5000, interestRate: 10, startDate: '2026-01-10T00:00:00Z', status: 'Active' },
  { id: 'L-002', invoiceId: 'INV-9942', amountBorrowed: 12000, interestRate: 12, startDate: '2025-11-01T00:00:00Z', status: 'Overdue' },
  { id: 'L-003', invoiceId: 'INV-7731', amountBorrowed: 3500, interestRate: 8, startDate: '2026-02-01T00:00:00Z', status: 'Repaid' },
];

<<<<<<< HEAD
/**
 * Calculates the simple interest accrued based on time elapsed.
 * Formula: (Principal * AnnualRate) * (DaysElapsed / 365)
 * 
 * @param {number} amount - Principal amount borrowed.
 * @param {number} rate - Annual interest rate (percentage).
 * @param {string} startDateStr - ISO string of the loan start date.
 * @returns {string} Formatted interest amount as a string.
 */
const calculateInterest = (amount: number, rate: number, startDateStr: string) => {
=======
// --- Helper Functions ---

// Calculates interest based on time elapsed: (Amount * Rate) * (DaysElapsed / 365)
const calculateInterest = (amount: number, rate: number, startDateStr: string): number => {
>>>>>>> upstream/main
  const start = new Date(startDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const interest = (amount * (rate / 100)) * (diffDays / 365);
  return interest;
};

/**
 * Renders a stylized badge reflecting the loan status.
 */
const StatusBadge = ({ status }: { status: LoanStatus }) => {
  switch (status) {
    case 'Repaid':
<<<<<<< HEAD
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200" aria-label={`Status: ${status}`}>Repaid</span>;
    case 'Overdue':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200" aria-label={`Status: ${status}`}>Overdue</span>;
    case 'Active':
    default:
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200" aria-label={`Status: ${status}`}>Active</span>;
=======
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Repaid</span>;
    case 'Overdue':
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Overdue</span>;
    case 'Active':
    default:
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Active</span>;
>>>>>>> upstream/main
  }
};

/**
 * A responsive table component for managing loans.
 */
export default function LoanTable() {
  /**
   * Handles the initiation of a loan repayment.
   * @param {string} loanId - The ID of the loan to repay.
   */
  const handleRepay = (loanId: string) => {
<<<<<<< HEAD
    // TODO: Connect to the Soroban smart contract repayment method
    console.log(`[LoanTable] Initiating repayment flow for: ${loanId}`);
  };

  return (
    <div className="w-full overflow-hidden shadow-lg border border-slate-700/50 rounded-2xl bg-slate-900/50">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
            <tr>
              <th scope="col" className="px-6 py-5 font-bold tracking-wider">Invoice ID</th>
              <th scope="col" className="px-6 py-5 font-bold tracking-wider">Principal Borrowed</th>
              <th scope="col" className="px-6 py-5 font-bold tracking-wider">Interest Accrued</th>
              <th scope="col" className="px-6 py-5 font-bold tracking-wider">Status</th>
              <th scope="col" className="px-6 py-5 font-bold tracking-wider text-right">Actions</th>
=======
    console.log(`Initiating repayment for loan: ${loanId}`);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700/50">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">Invoice ID</th>
            <th scope="col" className="px-6 py-4 font-semibold">Amount Borrowed</th>
            <th scope="col" className="px-6 py-4 font-semibold">Interest Accrued</th>
            <th scope="col" className="px-6 py-4 font-semibold">Status</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {MOCK_LOANS.map((loan) => (
            <tr key={loan.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-medium text-blue-300 font-mono">
                {loan.invoiceId}
              </td>
              <td className="px-6 py-4 text-slate-200">
                {formatCurrency(loan.amountBorrowed, false)}
              </td>
              <td className="px-6 py-4 text-slate-200">
                {formatCurrency(calculateInterest(loan.amountBorrowed, loan.interestRate, loan.startDate), false)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={loan.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleRepay(loan.id)}
                  disabled={loan.status === 'Repaid'}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${loan.status === 'Repaid'
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-tradeflow-accent hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    }`}
                >
                  Repay
                </button>
              </td>
>>>>>>> upstream/main
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-transparent">
            {MOCK_LOANS.map((loan) => (
              <tr key={loan.id} className="hover:bg-slate-800/30 transition-all duration-200 group">
                <td className="px-6 py-4 font-mono text-blue-400 whitespace-nowrap">
                  {loan.invoiceId}
                </td>
                <td className="px-6 py-4 font-medium text-slate-100">
                  {formatCurrency(loan.amountBorrowed)}
                </td>
                <td className="px-6 py-4 text-emerald-400">
                  {formatCurrency(calculateInterest(loan.amountBorrowed, loan.interestRate, loan.startDate))}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={loan.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleRepay(loan.id)}
                    disabled={loan.status === 'Repaid'}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all transform active:scale-95 ${loan.status === 'Repaid'
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900'
                      }`}
                  >
                    Repay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {MOCK_LOANS.length === 0 && (
        <div className="p-12 text-center text-slate-500 italic">
          No active loans found in your history.
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
