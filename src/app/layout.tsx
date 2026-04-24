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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var finalTheme = theme || systemPreference;
                  if (finalTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
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