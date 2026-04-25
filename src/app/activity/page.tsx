"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  DollarSign, 
  ExternalLink,
  RefreshCw,
  Filter,
  ChevronDown
} from "lucide-react";
import { getTransactionHistory } from "../../lib/api";
// Define types locally to avoid import path issues
type TransactionType = 'mint' | 'buy' | 'repay' | 'sell' | 'transfer';

interface TransactionRecord {
  id: string;
  hash: string;
  type: TransactionType;
  timestamp: string;
  amount: string;
  asset: string;
  from?: string;
  to?: string;
  status: 'success' | 'failed' | 'pending';
  fee?: string;
  memo?: string;
  stellarExpertUrl?: string;
}
import { useWalletConnection } from "../../stores/useWeb3Store";
import toast from "react-hot-toast";

interface TransactionHistoryPageProps {}

const TRANSACTION_ICONS = {
  mint: Coins,
  buy: ArrowUpRight,
  repay: ArrowDownLeft,
  sell: ArrowDownLeft,
  transfer: ArrowUpRight,
};

const TRANSACTION_COLORS = {
  mint: "text-green-400",
  buy: "text-blue-400", 
  repay: "text-orange-400",
  sell: "text-red-400",
  transfer: "text-purple-400",
};

const TRANSACTION_LABELS = {
  mint: "Minted",
  buy: "Bought",
  repay: "Repaid",
  sell: "Sold",
  transfer: "Transferred",
};

export default function TransactionHistoryPage({}: TransactionHistoryPageProps) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Get wallet connection state
  const { isConnected, walletAddress } = useWalletConnection();

  const fetchTransactions = async (pageNum: number = 1, reset: boolean = false) => {
    if (!isConnected || !walletAddress) {
      setError("Please connect your wallet to view transaction history");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await getTransactionHistory(walletAddress, pageNum, 20);
      
      if (result.ok && result.data) {
        const newTransactions = result.data.transactions;
        
        if (reset) {
          setTransactions(newTransactions);
        } else {
          setTransactions(prev => [...prev, ...newTransactions]);
        }
        
        setHasMore(newTransactions.length === 20);
      } else {
        const errorMessage = !result.ok ? result.error?.message || "Failed to fetch transactions" : "Unknown error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchTransactions(1, true);
    } else {
      setLoading(false);
      setError("Please connect your wallet to view transaction history");
    }
  }, [isConnected, walletAddress]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(nextPage, false);
    }
  };

  const refresh = () => {
    setPage(1);
    fetchTransactions(1, true);
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.type === filter
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const TransactionRow = ({ transaction }: { transaction: TransactionRecord }) => {
    const IconComponent = TRANSACTION_ICONS[transaction.type as keyof typeof TRANSACTION_ICONS];
    const colorClass = TRANSACTION_COLORS[transaction.type as keyof typeof TRANSACTION_COLORS];
    const label = TRANSACTION_LABELS[transaction.type as keyof typeof TRANSACTION_LABELS];

    return (
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg bg-slate-700/50 ${colorClass}`}>
              <IconComponent size={20} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">{label}</span>
                <span className="text-slate-400 text-sm">
                  {transaction.amount} {transaction.asset}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{formatTimestamp(transaction.timestamp)}</span>
                </span>
                
                {transaction.from && transaction.from !== walletAddress && (
                  <span>From: {formatAddress(transaction.from)}</span>
                )}
                
                {transaction.to && transaction.to !== walletAddress && (
                  <span>To: {formatAddress(transaction.to)}</span>
                )}
                
                {transaction.fee && (
                  <span>Fee: {transaction.fee} XLM</span>
                )}
              </div>
              
              {transaction.memo && (
                <div className="mt-2 text-xs text-slate-500 italic">
                  Memo: {transaction.memo}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              transaction.status === 'success' 
                ? 'bg-green-500/20 text-green-400'
                : transaction.status === 'failed'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {transaction.status}
            </div>
            
            <a
              href={transaction.stellarExpertUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-slate-700/50 transition-colors"
              title="View on Stellar Expert"
            >
              <ExternalLink size={16} className="text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  const filterOptions: { value: TransactionType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Transactions' },
    { value: 'mint', label: 'Mint' },
    { value: 'buy', label: 'Buy' },
    { value: 'repay', label: 'Repay' },
    { value: 'sell', label: 'Sell' },
    { value: 'transfer', label: 'Transfer' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
          <p className="text-slate-400">
            Monitor your RWA transaction history and activity
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Filter size={16} />
                <span>
                  {filterOptions.find(opt => opt.value === filter)?.label}
                </span>
                <ChevronDown size={16} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors ${
                        filter === option.value ? 'bg-slate-700 text-blue-400' : 'text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-slate-400">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </div>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Content */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading && transactions.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-700 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
            <p className="text-slate-400">
              {filter === 'all' 
                ? "You haven't made any transactions yet" 
                : `No ${filter} transactions found`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
            
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
