# ROOK

The ROOK pre-launch site. A small Node app: server-rendered HTML, an 18+ age
gate, and a waitlist. No database, no build step, no WordPress.

- **Runtime:** Node 20+ (built and tested on 26)
- **Framework:** Fastify
- **Storage:** the waitlist and contact messages are appended to files under
  `ROOK_DATA_DIR` (NDJSON, one record per line). Nothing else is stored.

## Run it locally

```bash
npm install
npm run dev      # or: npm start
```

Then open http://localhost:3000. Pass the age gate with any adult date of birth.

## What is where

```
server.js            Fastify app + routes (this is the startup file)
src/
  render.js          layout, header, footer, age gate, smoke + bottle SVG
  pages/             one module per page (home, shop, product, page, ...)
  data/              copy.js (words), products.js (the range), pages.js
  lib/               agegate.js, signups.js, messages.js, icons.js, components.js
public/              css, fonts, images, client js  (served as static files)
data/                subscribers.ndjson + messages.ndjson (git-ignored)
```

To change copy, edit `src/data/copy.js` and `src/data/pages.js`. To change the
range, edit `src/data/products.js`. Restart the server to see changes.

## Deploy to cPanel (Node.js app)

1. **Upload** everything except `node_modules/`, `data/`, and `.env` to a folder
   on the server, e.g. `~/rook-app` (File Manager or Git).
2. **cPanel → Setup Node.js App → Create Application**
   - Node version: 20 or newer
   - Application mode: Production
   - Application root: `rook-app` (where you uploaded)
   - Application URL: your domain
   - **Application startup file:** `server.js`
3. **Environment variables** (in that same screen):
   - `ROOK_SECRET` — a long random string (used to sign the age-gate cookie)
   - `ROOK_DATA_DIR` — a path **outside** the app folder so signups survive a
     redeploy, e.g. `/home/youruser/rook-data`
   - `NODE_ENV` — `production`
4. Click **Run NPM Install**, then **Start** (or Restart) the app.

The host (Passenger) provides the port; the app reads it from `PORT`
automatically. No other configuration is needed.

### Exporting the waitlist

Signups are in `ROOK_DATA_DIR/subscribers.ndjson`, one JSON object per line
(`email`, `source`, `at`). Download it and import into your email platform when
you launch. Contact messages are in `messages.ndjson` the same way.

## When you start selling

This site is pre-launch: it shows the range as "coming soon" and captures a
waitlist. Turning on real commerce (cart, payment, orders) is a later phase and
is when you would add a proper database and a payment gateway.
