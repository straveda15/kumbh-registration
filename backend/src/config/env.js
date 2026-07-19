import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_VERSION: z.string().default('v1'),
  // Backend origin only. It must never be embedded in browser-facing QR links.
  BASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  // Optional: when unset, derived from FRONTEND_URL below (the common
  // single-frontend case) instead of needing to be kept in sync by hand.
  // Accepts a comma-separated list for setups with more than one allowed
  // origin (e.g. FRONTEND_URL plus a LAN IP for testing on a phone).
  CORS_ORIGIN: z.string().optional(),

  JWT_ACCESS_SECRET: z.string().min(10, 'JWT_ACCESS_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_DRAFT_SECRET: z.string().min(10, 'JWT_DRAFT_SECRET is required'),
  JWT_DRAFT_EXPIRES_IN: z.string().default('24h'),
  // Separate secret for logged-in pilgrim sessions (email+password), kept
  // apart from JWT_DRAFT_SECRET on purpose — a draft token authorizes an
  // anonymous wizard session tied to one registration; a pilgrim token
  // authorizes a real account. Different token, different secret, same
  // reasoning as why draft already doesn't share access/refresh's secret.
  JWT_PILGRIM_SECRET: z.string().min(10, 'JWT_PILGRIM_SECRET is required'),
  JWT_PILGRIM_EXPIRES_IN: z.string().default('7d'),

  PILGRIM_ID_REGION_CODE: z.string().default('XX'),

  // Optional: document upload is a deferred feature until real credentials
  // are supplied (same treatment as MONGO_URI, but non-blocking for boot —
  // the app runs fine without them, uploads just fail with a clear error).
  CLOUDINARY_CLOUD_NAME: z.string().default(''),
  CLOUDINARY_API_KEY: z.string().default(''),
  CLOUDINARY_API_SECRET: z.string().default(''),
  CLOUDINARY_UPLOAD_FOLDER: z.string().default(process.env.CLOUDINARY_FOLDER || 'qr-registration'),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),

  SEED_ADMIN_NAME: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  env: env.NODE_ENV,
  isProduction: env.NODE_ENV === 'production',
  port: env.PORT,
  apiVersion: env.API_VERSION,
  baseUrl: env.BASE_URL,
  frontendUrl: env.FRONTEND_URL.replace(/\/$/, ''),

  mongoUri: env.MONGO_URI,

  // Array of allowed origins, not a single string — CORS_ORIGIN may list
  // several comma-separated origins; when it's unset, FRONTEND_URL is the
  // only source of truth instead of two env vars that can silently drift
  // out of sync with each other (see app.js for how this is enforced).
  corsOrigins: (env.CORS_ORIGIN ?? env.FRONTEND_URL)
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    draftSecret: env.JWT_DRAFT_SECRET,
    draftExpiresIn: env.JWT_DRAFT_EXPIRES_IN,
    pilgrimSecret: env.JWT_PILGRIM_SECRET,
    pilgrimExpiresIn: env.JWT_PILGRIM_EXPIRES_IN,
  },

  pilgrimIdRegionCode: env.PILGRIM_ID_REGION_CODE,

  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    uploadFolder: env.CLOUDINARY_UPLOAD_FOLDER,
    isConfigured: Boolean(
      env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
    ),
  },

  bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,

  seedAdmin: {
    name: env.SEED_ADMIN_NAME,
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
  },
};

export default config;
