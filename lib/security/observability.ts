export const observabilityConfig = {
  sentryEnabled:
    process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true" && Boolean(process.env.SENTRY_DSN),
};

