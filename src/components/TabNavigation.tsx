/**
 * Tab Navigation Component.
 * A reusable horizontal navigation bar for switching between different 
 * content views within a page.
 */

import React from 'react';

/**
 * Represents a single tab item in the navigation.
 */
interface Tab {
  /** Unique identifier for the tab (e.g., "overview") */
  id: string;
  /** Human-readable text label for the tab */
  label: string;
  /** Optional Lucide icon to display alongside the label */
  icon?: React.ReactNode;
}

/**
 * Props for the TabNavigation component.
 */
interface TabNavigationProps {
  /** Array of tab definitions to render */
  tabs: Tab[];
  /** The ID of the currently selected tab */
  activeTab: string;
  /** Callback triggered when a new tab is selected */
  onTabChange: (tabId: string) => void;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * A stylized tab bar with animated indicators and accessibility support.
 */
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
                {/* Optional Icon Rendering */}
                {tab.icon && (
                  <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </div>
              
              {/* Active Indicator Glow */}
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

