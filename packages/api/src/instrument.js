import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: !!process.env.NODE_ENV,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
});
