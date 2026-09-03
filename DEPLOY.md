# Deploying AutoViindu to cPanel

The live site (`autoviindu.com`) runs as a **cPanel Node.js app**:

| Setting | Value |
|---|---|
| Application root | `repositories/autoviindu-car` |
| Application startup file | `server.js` |
| Node.js version | 22.x |
| Application mode | Production |

Code reaches the server via **git** (`git pull` in the app folder, or cPanel →
Git™ Version Control → Update from Remote). The FTP GitHub Action
(`.github/workflows/deploycPanel.yml`) is **disabled** as an auto-trigger.

## Code vs. data — two different things

| | Where it lives | How it updates |
|---|---|---|
| **Code** (HTML, CSS, JS, `server.js`) | git repo | you `git push`, then deploy (below) |
| **Data** (cars, news, CMS edits, form submissions) | `dev.db` + `backend/form-submissions.json` **on the server only** | the admin panel writes straight to the live DB — instant, no deploy |

`dev.db` and `backend/form-submissions.json` are **git-ignored**. The server's
copies are the source of truth and a deploy never touches them. That's why admin
panel changes show up on the site immediately.

## Deploy steps (code changes)

cPanel → Terminal:

```bash
source ~/nodevenv/repositories/autoviindu-car/22/bin/activate
cd ~/repositories/autoviindu-car

git pull

# only if package.json changed:
rm -rf ~/nodevenv/repositories/autoviindu-car/22/lib/node_modules/*
npm install --no-audit --no-fund
npm run generate

# always, to load the new code:
#   cPanel → Setup Node.js App → Restart      (or: touch tmp/restart.txt)
```

If `git pull` refuses because a tracked file changed on the server, that file
shouldn't be tracked — check `git status`, and if it's runtime data add it to
`.gitignore` + `git rm --cached` it.

## Getting a fresh copy of the live database (for local work)

```bash
# on the server
cp ~/repositories/autoviindu-car/dev.db ~/dev.db.snapshot
# then download ~/dev.db.snapshot via SFTP / cPanel File Manager and drop it in
# your local project root as dev.db
```

Never commit it back.

## Why `npm run generate` is a separate step

CloudLinux's Node Selector runs npm lifecycle scripts (`postinstall`) from the
virtualenv's `lib/` folder, not the app folder, so `prisma generate` there can't
find `prisma/schema.prisma`. `postinstall` was removed; run `npm run generate`
yourself from the app folder after `npm install`.

`rm -rf …/lib/node_modules/*` before `npm install`: the app folder's
`node_modules` is a **symlink** into the venv, so a plain `rm -rf node_modules`
only deletes the link and stale packages survive. Wipe the real directory.

## SQLite driver

The host is AlmaLinux 8 (glibc 2.28) with **no C compiler**. `better-sqlite3`'s
prebuilt binary needs glibc 2.29+, so the app uses **`@prisma/adapter-libsql` +
`@libsql/client`** instead (napi prebuild works on glibc 2.28). Don't switch
back to better-sqlite3 without a compiler on the box.

## Schema changes

No migration step on the server. `server.js` runs `ensureNewsSchema()` on boot
to `ALTER TABLE` in new columns. For bigger changes, add the `ALTER`/`CREATE`
statements there, or run `npx prisma db push` against the server's `dev.db` in
the Terminal.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Can't acquire lock for app` | Stuck `cloudlinux-selector` process. `ps -u $USER -o pid,etimes,cmd \| grep selector` → `kill <pid>` |
| `Cannot find module '@prisma/client'` / `did not initialize yet` | `npm run generate` wasn't run from the app folder |
| `GLIBC_2.29 not found` / bindings error | a `better-sqlite3` crept back in — `rm -rf …/lib/node_modules/*` and reinstall |
| Site serves a different app | check `~/public_html/.htaccess` for a stray `RewriteRule … [P]` proxy line |
| 500s / `SQLITE_CANTOPEN` | `dev.db` missing from the app root |
| New code not showing | restart the Node app; if still stale, purge the CDN/browser cache |
