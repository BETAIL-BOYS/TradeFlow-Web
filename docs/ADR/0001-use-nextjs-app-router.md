# 0001. Use Next.js App Router

Date: 2026-06-19

## Status

Accepted

## Context

TradeFlow-Web needs server-side rendering for SEO on public dashboard
pages, streaming support for real-time risk analytics data, and a routing
model that scales as the number of dashboard views grows (invoices,
risk analytics, contract interactions). Next.js offers two routing
paradigms: the legacy Pages Router and the newer App Router.

## Decision

We will use the Next.js App Router (`src/app/`) instead of the Pages
Router for all routing in TradeFlow-Web.

## Consequences

- We gain native support for React Server Components, reducing client
  bundle size for data-heavy dashboard views.
- Layouts and nested routing simplify shared UI (e.g. wallet connection
  state) across dashboard sections.
- Streaming and `loading.tsx` conventions improve perceived performance
  for risk analytics fetches.
- The team must use App Router-specific patterns (e.g. `"use client"`
  boundaries) for Freighter wallet integration, which only works
  client-side.
- Some older Next.js tutorials/libraries assume the Pages Router and
  require adaptation.

## Alternatives Considered

- **Pages Router** — simpler mental model and more mature ecosystem
  support, but lacks Server Components and has weaker support for
  streaming and nested layouts, which we need for the dashboard.
- **Separate Express API + SPA frontend** — more deployment overhead
  and duplicated routing/auth logic; rejected in favor of using Next.js
  API routes/Route Handlers directly (see future ADR if this changes).