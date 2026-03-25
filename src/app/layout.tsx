import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import ToasterProvider from "../components/general/ToasterProvider";
import { SlippageProvider } from "../contexts/SlippageContext";
import Footer from "../components/layout/Footer";
import NetworkCongestionBanner from "../components/NetworkCongestionBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "TradeFlow",
  description: "TradeFlow RWA Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen flex flex-col overflow-hidden">
        <SlippageProvider>

          <NetworkCongestionBanner />
          <div className="flex-1">
            {children}
          </div>
        </SlippageProvider>
        <Footer />
        <ToasterProvider />

        {/* TradeFlow Watermark */}
        <div className="fixed bottom-0 right-0 -z-10 pointer-events-none w-[800px] h-[800px] opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="800" height="800" className="w-full h-full">
            <rect width="32" height="32" fill="#0f172a" rx="6" />
            <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="#3b82f6" />
            <circle cx="24" cy="20" r="2" fill="#10b981" />
          </svg>
        </div>
      </body>
    </html>
  );
}
