# Bxaut BSC — Shovel NFT mint site

Vite + React front end and Hardhat contracts for BNB Smart Chain (BSC).

## Local development

```bash
npm install
npm run dev
```

Optional: set addresses in `.env` (see `contracts/.env.example`). Hardhat reads both the repo root `.env` and `contracts/.env`.

## Vercel

1. Push this repo to GitHub (see below).
2. Open [Vercel → New Project](https://vercel.com/new) and **Import** your GitHub repository (e.g. under your team [New Project](https://vercel.com/new?teamSlug=zoacahns-projects)).
3. Leave defaults: **Framework Preset** Vite, **Build Command** `npm run vercel-build`, **Output** `dist` (from `vercel.json`).
4. Optional in Vercel → Project → **Environment Variables**: set **`NFT_SITE_BASE`** to your canonical public URL (e.g. `https://your-domain.com` or the production deployment URL). If unset, the build uses `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` so `public/nft-metadata/*.json` gets correct HTTPS image links.
5. After deploy, set the on-chain NFT `baseURI` to `https://<your-deployment>/nft-metadata/` (owner: `npm run shovel:set-baseuri`).

## GitHub Pages (site + NFT metadata for wallets)

1. Create a repository on GitHub and push this project (`main` or `master`).
2. **Settings → Pages → Build and deployment**: set **Source** to **GitHub Actions**.
3. Push to `main` / `master`; the workflow **Deploy GitHub Pages** builds with:
   - `NFT_SITE_BASE=https://<you>.github.io/<repo>/` so `public/nft-metadata/*.json` embed **public** image URLs.
   - `VITE_BASE_PATH=/<repo>/` so the SPA and static assets load under the Pages subpath.

After the first successful deploy, the live site is:

`https://<github-username>.github.io/<repository-name>/`

### Fix NFT images in mobile wallets (MetaMask, etc.)

Wallets load **`tokenURI` → JSON → `image`**. Both must use **HTTPS URLs on the public internet** (not `http://127.0.0.1`).

1. Deploy Pages as above (metadata + images served from the same origin).
2. **Contract owner** updates on-chain metadata base (one transaction):

```bash
set SHOVEL_NFT_ADDRESS=0xYourShovelNft
set NFT_METADATA_BASE_URI=https://<you>.github.io/<repo>/nft-metadata/
npx hardhat run scripts/set-shovel-baseuri.cjs --network bsc
```

Use the **exact** trailing slash as in your live `nft-metadata/` URL.

3. If you already generated JSON with the wrong `NFT_SITE_BASE`, run `npm run gen:nft-metadata` locally with the correct `NFT_SITE_BASE`, commit the files **or** rely on CI to regenerate each build (workflow runs `gen:nft-metadata` before `build`).

## Contract commands

See `package.json` scripts: `compile:contracts`, `deploy:shovel`, `verify:shovel`, `export:bscscan-shovel`, `shovel:set-baseuri`, etc.

## Security

Never commit private keys or API keys. `contracts/.env` and root `.env` are gitignored.
