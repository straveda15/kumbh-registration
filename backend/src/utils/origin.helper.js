import config from '../config/env.js';

/**
 * Extracts and validates the frontend origin from an incoming HTTP request.
 * Checks request Origin header first, then Referer header.
 * Ensures origin matches trusted CORS origins if configured.
 *
 * @param {import('express').Request} req
 * @returns {string|null} The resolved origin URL without trailing slash, or null if unresolvable.
 */
export const getOriginFromRequest = (req) => {
  if (!req) return null;

  let origin = req.get('origin');
  if (!origin && req.get('referer')) {
    try {
      origin = new URL(req.get('referer')).origin;
    } catch {
      // Invalid referer URL ignored
    }
  }

  if (origin) {
    origin = origin.replace(/\/$/, '');

    // Check trusted origins if corsOrigins is populated
    if (config.corsOrigins && config.corsOrigins.length > 0) {
      if (config.corsOrigins.includes(origin)) {
        return origin;
      }
    }

    // Fallback URL validity check
    try {
      new URL(origin);
      return origin;
    } catch {
      // Invalid URL ignored
    }
  }

  return null;
};

export default { getOriginFromRequest };
