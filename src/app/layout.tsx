import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import ToasterProvider from "../components/general/ToasterProvider";
import { SlippageProvider } from "../contexts/SlippageContext";

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
      <body className="font-sans">
        <SlippageProvider>
          {children}
        </SlippageProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
