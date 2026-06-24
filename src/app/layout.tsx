import './globals.css';
import React from 'react';
import { Inter } from 'next/font/google';

import ToasterProvider from '../components/general/ToasterProvider';
import { SlippageProvider } from '../contexts/SlippageContext';
import { NetworkCongestionProvider } from '../contexts/NetworkCongestionContext';
import { BackendHealthProvider } from '../contexts/BackendHealthContext';
import Footer from '../components/layout/Footer';
import NetworkCongestionBanner from '../components/NetworkCongestionBanner';
import DegradedPerformanceBanner from '../components/DegradedPerformanceBanner';
import ErrorBoundary from '../components/ErrorBoundary';
import PageTransition from '../components/PageTransition';
import QueryProvider from '../providers/QueryClientProvider';
import { SettingsProvider } from '../lib/context/SettingsContext';
import { ThemeProvider } from '../lib/context/ThemeContext';
import NetworkGuard from '../components/general/NetworkGuard';
import SignatureOverlay from '../components/SignatureOverlay';
import { NetworkMismatchWarning } from '../components/NetworkMismatchWarning';
import SessionTimeoutProvider from '../components/SessionTimeoutProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'TradeFlow',
  description: 'TradeFlow RWA Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-primary"
        >
          Skip to Content
        </a>
        <ErrorBoundary>
          <ThemeProvider>
            <SettingsProvider>
              <QueryProvider>
                <BackendHealthProvider>
                  <NetworkGuard>
                    <NetworkCongestionProvider>
                      <SlippageProvider>
                        <ToasterProvider />
                        <NetworkCongestionBanner />
                        <DegradedPerformanceBanner />
                        <NetworkMismatchWarning />
                        <PageTransition>{children}</PageTransition>
                        <SignatureOverlay />
                        <SessionTimeoutProvider />
                        <main id="main-content">
                          <PageTransition>{children}</PageTransition>
                        </main>
                        <SignatureOverlay />
                        <Footer />
                      </SlippageProvider>
                    </NetworkCongestionProvider>
                  </NetworkGuard>
                </BackendHealthProvider>
              </QueryProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
// Inconsequential change for repo health

// Maintenance: minor update
