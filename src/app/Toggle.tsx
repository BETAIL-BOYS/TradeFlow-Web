import React from "react";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function Toggle({ isOn, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        isOn ? "bg-blue-600" : "bg-slate-700"
      }`}
      role="switch"
      aria-checked={isOn}
    >
      <span
        className={`${
          isOn ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
}