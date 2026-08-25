# Deploying ROOK to cPanel (from GitHub)

The app lives at **github.com/rvgmondo/rook** (private). cPanel pulls from
there, so future updates are: I push to GitHub → you click "Update from Remote"
→ restart the app.

Do it on a **test URL first** (a subdomain like `new.rookvapes.co.za`), confirm
it works, then point the main domain at it. That way the current site is never
down while you set this up.

---

## 1. Let cPanel read the private repo (one-time)

cPanel needs an SSH key GitHub trusts, because the repo is private.

1. **cPanel → Git Version Control → Create.** It shows a **"Clone URL"** field
   and, lower down, help for SSH keys. If you don't already have a cPanel SSH
   key: **cPanel → SSH Access → Manage SSH Keys → Generate a new key** (no
   passphrase), then **Manage → Authorize** it.
2. Copy the **public** key text.
3. On GitHub: **repo → Settings → Deploy keys → Add deploy key**, paste it,
   leave "Allow write access" unchecked, save.

## 2. Clone the repo into cPanel

1. **Git Version Control → Create.**
2. **Clone URL:** `git@github.com:rvgmondo/rook.git`
3. **Repository Path:** e.g. `rook-app` (this becomes the app folder).
4. Create. cPanel clones the code.

## 3. Create the Node.js app

1. **cPanel → Setup Node.js App → Create Application.**
   - **Node version:** 20 or newer
   - **Application mode:** Production
   - **Application root:** `rook-app` (the folder from step 2)
   - **Application URL:** your test subdomain (or the domain when you cut over)
   - **Application startup file:** `server.js`
2. **Environment variables** (add these in the same screen):
   - `ROOK_SECRET` = a long random string (signs the age-gate cookie)
   - `ROOK_DATA_DIR` = a path **outside** `rook-app`, e.g.
     `/home/YOURUSER/rook-data` — so signups survive a redeploy
   - `NODE_ENV` = `production`
3. **Run NPM Install** (button on that screen).
4. **Start** the app.

Open the URL. You should get the age gate, then the site.

## 4. Cut the main domain over (when you're happy)

Point `rookvapes.co.za` at the Node app — either change the Application URL to
the main domain, or move the domain's document root. The old WordPress files can
stay untouched as a backup until you're sure.

---

## Pushing updates after launch

When I change the code and push to GitHub:

1. **cPanel → Git Version Control → Manage → Update from Remote** (pulls the
   new code).
2. **Setup Node.js App → Restart.** (Only run **NPM Install** again if
   `package.json` changed — I'll tell you when it does.)

That's the whole loop. No files to upload by hand.

## Getting the waitlist

Signups are at `ROOK_DATA_DIR/subscribers.ndjson` (one JSON line each: email,
source, date). Contact messages are in `messages.ndjson`. Download either from
File Manager and import into your email tool. These files are never overwritten
by a deploy because they live outside the repo folder.
