import React from 'react';
import { formatCurrency, formatDate } from '../lib/format';

// --- Types & Interfaces ---
type LoanStatus = 'Active' | 'Overdue' | 'Repaid';

interface Loan {
  id: string;
  invoiceId: string;
  amountBorrowed: number;
  interestRate: number; // Annual rate in percentage (e.g., 5 for 5%)
  startDate: string;    // ISO string date
  status: LoanStatus;
}

// --- Mock Data ---
const MOCK_LOANS: Loan[] = [
  { id: 'L-001', invoiceId: 'INV-8821', amountBorrowed: 5000, interestRate: 10, startDate: '2026-01-10T00:00:00Z', status: 'Active' },
  { id: 'L-002', invoiceId: 'INV-9942', amountBorrowed: 12000, interestRate: 12, startDate: '2025-11-01T00:00:00Z', status: 'Overdue' },
  { id: 'L-003', invoiceId: 'INV-7731', amountBorrowed: 3500, interestRate: 8, startDate: '2026-02-01T00:00:00Z', status: 'Repaid' },
];

// --- Helper Functions ---

// Calculates interest based on time elapsed: (Amount * Rate) * (DaysElapsed / 365)
const calculateInterest = (amount: number, rate: number, startDateStr: string) => {
  const start = new Date(startDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const interest = (amount * (rate / 100)) * (diffDays / 365);
  return interest.toFixed(2);
};

// Returns the correct Tailwind classes based on the status
const StatusBadge = ({ status }: { status: LoanStatus }) => {
  switch (status) {
    case 'Repaid':
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Repaid</span>;
    case 'Overdue':
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Overdue</span>;
    case 'Active':
    default:
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Active</span>;
  }
};

// --- Main Component ---
export default function LoanTable() {
  const handleRepay = (loanId: string) => {
    // TODO: Wire this up to your API or a payment modal
    console.log(`Initiating repayment for loan: ${loanId}`);
  };

  return (
    <div className="w-full overflow-x-auto shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold">Invoice ID</th>
            <th scope="col" className="px-6 py-4 font-semibold">Amount Borrowed</th>
            <th scope="col" className="px-6 py-4 font-semibold">Interest Accrued</th>
            <th scope="col" className="px-6 py-4 font-semibold">Status</th>
            <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {MOCK_LOANS.map((loan) => (
            <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {loan.invoiceId}
              </td>
              <td className="px-6 py-4">
                {formatCurrency(loan.amountBorrowed)}
              </td>
              <td className="px-6 py-4">
                {formatCurrency(calculateInterest(loan.amountBorrowed, loan.interestRate, loan.startDate))}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={loan.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleRepay(loan.id)}
                  disabled={loan.status === 'Repaid'}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${loan.status === 'Repaid'
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
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
  );
}