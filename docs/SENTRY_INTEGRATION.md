# Sentry Integration for TradeFlow-Web

This document outlines the Sentry integration implemented for frontend error tracking and crash reporting.

## Overview

Sentry has been integrated to automatically capture:
- Uncaught JavaScript exceptions
- React render errors
- Failed API promises
- Performance traces
- Session replays for debugging

## Files Added/Modified

### New Files Created:
- `sentry.server.config.ts` - Server-side Sentry configuration
- `sentry.client.config.ts` - Client-side Sentry configuration
- `src/components/ErrorBoundary.tsx` - React error boundary component
- `src/app/error.tsx` - Next.js 500 error page
- `src/middleware.ts` - Middleware for request tracing

### Modified Files:
- `package.json` - Added @sentry/nextjs dependency
- `.env.example` - Added NEXT_PUBLIC_SENTRY_DSN environment variable
- `src/app/layout.tsx` - Wrapped app with ErrorBoundary

## Environment Variables

Add the following to your `.env.local` file:

```bash
# Sentry DSN for error tracking
# Get this from your Sentry project settings
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

## Setup Instructions

1. **Create a Sentry Project:**
   - Go to https://sentry.io
   - Create a new project for "Next.js"
   - Copy the DSN from your project settings

2. **Configure Environment:**
   - Add the DSN to your `.env.local` file
   - Reference `.env.example` for the required format

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Test the Integration:**
   - Run the development server
   - Trigger an error to verify Sentry captures it
   - Check your Sentry dashboard for the error report

## Features Implemented

### Error Boundary
- Custom ErrorBoundary component wraps the entire application
- Automatically captures React errors and sends them to Sentry
- Provides user-friendly error UI with recovery options
- Shows error details in development mode

### 500 Error Page
- Next.js error.tsx page for server errors
- Automatically reports errors to Sentry
- Graceful fallback UI for users

### Performance Monitoring
- Traces enabled for performance monitoring
- Session replays for debugging user interactions
- Automatic breadcrumb collection

### Request Tracing
- Middleware integration for request tracing
- Continues traces across server and client

## Configuration Details

### Server Configuration (sentry.server.config.ts)
- Initializes Sentry for server-side rendering
- Configures traces sampling
- Sets debug mode appropriately

### Client Configuration (sentry.client.config.ts)
- Initializes Sentry for client-side
- Includes Replay integration for session recording
- Masks sensitive data in replays
- Configures error and session sampling rates

## Testing

To test the Sentry integration:

1. **Development Testing:**
   ```bash
   npm run dev
   ```
   - Navigate to the app
   - The ErrorBoundary will catch any React errors
   - Check browser console for Sentry debug info

2. **Error Simulation:**
   - Add `throw new Error('Test error')` to a component
   - Verify the error appears in Sentry dashboard

3. **Production Testing:**
   ```bash
   npm run build
   npm start
   ```
   - Test in production environment
   - Verify errors are captured with proper context

## Best Practices

1. **Error Boundaries:** Wrap critical components with ErrorBoundary for granular error handling
2. **Custom Context:** Add custom context to Sentry reports for better debugging
3. **Sampling Rates:** Adjust sampling rates based on traffic and Sentry plan limits
4. **Sensitive Data:** Ensure sensitive data is masked in session replays

## Monitoring

Once deployed, monitor:
- Error rates and trends
- Performance metrics
- User session replays
- Release health

## Security Notes

- DSN is public but only allows error reporting
- No sensitive data should be sent to Sentry
- Session replays mask text and block media by default
- Review Sentry data retention policies
