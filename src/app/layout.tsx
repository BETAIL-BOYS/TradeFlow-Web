import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ToasterProvider from "../components/general/ToasterProvider";
import { SettingsProvider } from "../lib/context/SettingsContext";
import NetworkGuard from "../components/general/NetworkGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "TradeFlow",
  description: "TradeFlow RWA Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col">
        <SettingsProvider>
          <NetworkGuard>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <ToasterProvider />
            </ThemeProvider>
          </NetworkGuard>
        </SettingsProvider>
      </body>
    </html>
  );
}