import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ToasterProvider from "../components/general/ToasterProvider";
import { SlippageProvider } from "../contexts/SlippageContext";
import Footer from "../components/layout/Footer";
import NetworkCongestionBanner from "../components/NetworkCongestionBanner";
import ErrorBoundary from "../components/ErrorBoundary";

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SlippageProvider>
              <NetworkCongestionBanner />
              <div className="flex-1">
                {children}
              </div>
            </SlippageProvider>
            <Footer />
            <ToasterProvider />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
