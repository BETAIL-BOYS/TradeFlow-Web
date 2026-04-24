// This file configures the initialization of Sentry on the browser.
// The config you include here will be used when you run `sentry/wizard` and as
// the `default` values in `sentry.next.js/wizard` CLI.

// This file is not used in the server environment.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  // Setting this option to true will print diagnostic information to the console
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
