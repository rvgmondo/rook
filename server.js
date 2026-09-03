// ROOK — startup entry. cPanel/LiteSpeed loads this with require(), which cannot
// handle top-level await, so all awaiting happens inside start(). Passenger
// passes a port in process.env.PORT; locally it defaults to 3000.
//
// All routing lives in src/app.js so the tests can build the app without a server.

import { buildApp } from './src/app.js';

async function start() {
  const app = await buildApp();

  // Loud warning if the age-gate signing key is missing/weak in production.
  if (process.env.NODE_ENV === 'production' &&
      (!process.env.ROOK_SECRET || process.env.ROOK_SECRET.length < 16)) {
    app.log.warn('ROOK_SECRET is missing or too short. Set a long random value so the age-gate cookie is securely signed.');
  }

  // Close cleanly on a host restart.
  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => app.close().then(() => process.exit(0)).catch(() => process.exit(1)));
  }

  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  try {
    const addr = await app.listen({ port: PORT, host: HOST });
    app.log.warn(`ROOK running at ${addr}`); // logged at warn so it shows at our log level
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// No top-level await: call start() and let it run. require()-safe.
start();
