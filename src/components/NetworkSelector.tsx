/**
 * Network Selector Component.
 * Allows users to toggle between Stellar Mainnet and Testnet environments.
 * Persists the selection in local state and notifies parent components of changes.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
<<<<<<< HEAD
import { ChevronDown, AlertTriangle, Globe, FlaskConical } from "lucide-react";
=======
import { ChevronDown, AlertTriangle } from "lucide-react";
import Icon from "./ui/Icon";
>>>>>>> upstream/main

/** Supported Stellar network types */
export type Network = "mainnet" | "testnet";

/**
 * Props for the NetworkSelector component.
 */
interface NetworkSelectorProps {
  /** Optional callback triggered when the network is changed */
  onNetworkChange?: (network: Network) => void;
}

/**
 * A dropdown component for selecting the active Stellar network.
 */
export default function NetworkSelector({ onNetworkChange }: NetworkSelectorProps) {
  // --- Component State ---
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("mainnet");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Available network configurations.
   */
  const networks = [
    {
      id: "mainnet" as Network,
      name: "Stellar Mainnet",
      description: "Production assets",
      icon: <Globe size={14} className="text-blue-400" />
    },
    {
      id: "testnet" as Network,
      name: "Stellar Testnet", 
      description: "Development assets",
      icon: <FlaskConical size={14} className="text-yellow-400" />
    }
  ];

  // --- Handlers ---

  /**
   * Effect: Closes the dropdown when clicking outside the component.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Updates the selected network and propagates the change.
   * 
   * @param {Network} network - The new network ID.
   */
  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setIsOpen(false);
    if (onNetworkChange) {
      onNetworkChange(network);
    }
  };

  const selectedNetworkData = networks.find(n => n.id === selectedNetwork);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl px-4 py-2 transition-all min-w-[160px] justify-between shadow-sm active:scale-[0.98]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select Stellar Network"
      >
        <div className="flex items-center gap-2">
          {/* Network-specific Icon */}
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900/50">
            {selectedNetworkData?.icon}
          </div>
          <span className="font-bold text-white text-xs uppercase tracking-wider">
            {selectedNetworkData?.name.replace("Stellar ", "")}
          </span>
        </div>
<<<<<<< HEAD
        <ChevronDown 
          size={14} 
          className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
=======
        <Icon icon={ChevronDown} dense className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
>>>>>>> upstream/main
      </button>

      {/* Testnet Warning Badge */}
      {selectedNetwork === "testnet" && (
<<<<<<< HEAD
        <div 
          className="absolute -top-2.5 -right-2 bg-yellow-500 text-slate-900 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg shadow-yellow-500/20"
          title="You are using the test network"
        >
          <AlertTriangle size={10} strokeWidth={3} />
=======
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1">
          <Icon icon={AlertTriangle} dense />
>>>>>>> upstream/main
          Testnet
        </div>
      )}

      {/* Dropdown List */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
        >
          <div className="p-2 space-y-1">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => handleNetworkSelect(network.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  network.id === selectedNetwork
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "hover:bg-white/5 text-slate-300 hover:text-white border border-transparent"
                }`}
                role="option"
                aria-selected={network.id === selectedNetwork}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    network.id === selectedNetwork ? "bg-blue-500/20" : "bg-slate-900/50"
                  }`}>
                    {network.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xs uppercase tracking-tight">{network.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{network.description}</div>
                  </div>
                  {network.id === selectedNetwork && (
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                  )}
                </div>
              </button>
            ))}
          </div>
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
