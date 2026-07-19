import app from '../src/app.js';
import { connectDatabase } from '../src/database/connect.js';

// Vercel treats this file as a single serverless Function. Every request
// under /api/* is rewritten here (see backend/vercel.json), and Express's
// own router — mounted at /api/${API_VERSION} inside src/app.js, unchanged
// — handles the rest of the path exactly as it does locally; a rewrite
// only changes which function runs, not the req.url Express sees.
//
// The Express app is already a plain (req, res) => void handler (the same
// thing app.listen() hands to Node's http server locally), so it can be
// the exported handler directly — no adapter/wrapper package needed.
// connectDatabase() caches its connection promise (see
// src/database/connect.js), so awaiting it here is a no-op after the
// container's first ("cold start") invocation rather than a reconnect on
// every request.
export default async function handler(req, res) {
  await connectDatabase();
  return app(req, res);
}
