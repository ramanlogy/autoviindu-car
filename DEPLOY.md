# Deploying AutoViindu to cPanel

The live site (`autoviindu.com`) runs as a **cPanel Node.js app**:

| Setting | Value |
|---|---|
| Application root | `repositories/autoviindu-car` |
| Application startup file | `server.js` |
| Node.js version | 22.x |
| Application mode | Production |

The code gets there via **git** (cPanel → Git™ Version Control, or a manual
`git pull` in the app folder). The FTP GitHub Action (`.github/workflows/deploycPanel.yml`)
is **disabled** as an auto-trigger — it fought with this setup.

## Deploy steps

SSH / cPanel Terminal, then:

```bash
# 1. Enter the Node 22 environment (path from Setup Node.js App → the grey box)
source ~/nodevenv/repositories/autoviindu-car/22/bin/activate
cd ~/repositories/autoviindu-car

# 2. Get the latest code
git fetch origin
git reset --hard origin/main      # discards local edits — back up first (see below)

# 3. Install dependencies (skip lifecycle scripts — see note)
npm install --no-audit --no-fund --ignore-scripts

# 4. Generate the Prisma client (MUST be run from this folder)
npm run generate

# 5. Restart the app
#    cPanel → Setup Node.js App → Restart
#    (or: touch tmp/restart.txt  — Passenger picks it up)
```

## Before `git reset --hard`: back up live data

`git reset --hard` throws away anything the running site wrote. Save these first:

```bash
mkdir -p ~/backups
cp dev.db ~/backups/dev.db.$(date +%F-%H%M)
cp backend/form-submissions.json ~/backups/form-submissions.json.$(date +%F-%H%M)
```

- `dev.db` — the production database (cars, news, CMS edits, etc.)
- `backend/form-submissions.json` — contact-form submissions

If you want to **keep** the production `dev.db` instead of the one committed in
git, restore it after step 4:

```bash
cp ~/backups/dev.db.<timestamp> dev.db
```

## Why `--ignore-scripts` / `npm run generate` is separate

CloudLinux's Node Selector runs npm lifecycle scripts (`postinstall`) from the
virtualenv's `lib/` folder, not the app folder. `prisma generate` there can't
see `prisma/schema.prisma` and fails, which makes "Run NPM Install" report an
error. Running `npm run generate` yourself from the app folder works fine.

## Schema changes

There is no migration step on the server. `server.js` runs `ensureNewsSchema()`
on boot to `ALTER TABLE` in new columns. For bigger schema changes, either:

- generate the new `dev.db` locally (`npx prisma db push`) and commit it, or
- add the `ALTER`/`CREATE` statements to `ensureNewsSchema()` in `server.js`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Can't acquire lock for app` | A stuck `cloudlinux-selector` process holds it. `ps -u $USER -o pid,etimes,cmd \| grep selector` → `kill <pid>` |
| `Cannot find module '@prisma/client'` or `did not initialize yet` | `npm run generate` wasn't run from the app folder |
| `better-sqlite3` / `NODE_MODULE_VERSION` error | Node version changed — re-run `npm install` on the server to rebuild it |
| 500 errors, `SQLITE_CANTOPEN` | `dev.db` missing from app root, or `DATABASE_URL` points somewhere wrong |
