// ROOK — startup entry. cPanel: set this as the app's startup file. Passenger
// passes a port in process.env.PORT; locally it defaults to 3000.
//
// All the routing lives in src/app.js (so the tests can build the app without
// starting a server). This file only starts and stops it.

import { buildApp } from './src/app.js';

const app = await buildApp();

// Loud warning if the age-gate signing key is missing/weak in production — a
// weak key means the 18+ cookie could be forged.
if (process.env.NODE_ENV === 'production' &&
    (!process.env.ROOK_SECRET || process.env.ROOK_SECRET.length < 16)) {
  app.log.warn('ROOK_SECRET is missing or too short. Set a long random value so the age-gate cookie is securely signed.');
}

// Close cleanly on a host restart so no request is cut off mid-flight.
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
