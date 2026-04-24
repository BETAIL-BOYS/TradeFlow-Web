"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#18181b",
          color: "#fff",
          border: "1px solid #3f3f46",
          padding: "16px 20px",
          borderRadius: "12px",
          fontSize: "15px",
        },
        success: {
          style: {
            background: "#22c55e",
            color: "#fff",
            border: "none",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#22c55e",
          },
        },
        error: {
          style: {
            background: "#ef4444",
            color: "#fff",
            border: "none",
          },
        },
        loading: {
          style: {
            background: "#3b82f6",
            color: "#fff",
          },
        },
      }}
    />
  );
}