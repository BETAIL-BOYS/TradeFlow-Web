/**
 * Tab Navigation Component.
 * A reusable horizontal navigation bar for switching between different 
 * content views within a page.
 */
"use client";

import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = '' 
}: TabNavigationProps) {
  return (
    <div 
      className={`border-b border-slate-700/50 mb-8 ${className}`}
      role="tablist"
      aria-label="Navigation Tabs"
    >
      <nav className="flex space-x-10" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-2 border-b-2 font-bold text-xs uppercase tracking-widest transition-all duration-300 relative group ${
                isActive
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
            >
              <div className="flex items-center gap-2.5">
                {tab.icon && (
                  <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </div>
              
              {isActive && (
                <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
