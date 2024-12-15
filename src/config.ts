export const NODE_ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test'
} as const;

export const isDevelopment = process.env.NODE_ENV !== NODE_ENV.PRODUCTION;
