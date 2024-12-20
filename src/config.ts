export const NODE_ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
} as const;

export const isProduction = process.env.NODE_ENV === NODE_ENV.PRODUCTION
export const isDevelopment = !isProduction