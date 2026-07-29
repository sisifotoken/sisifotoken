# $SIFO

Against everything, against everyone.

A single-page site for $SIFO, a meme token built around the myth of Sisyphus. No framework, no build step — plain HTML, CSS and vanilla JS, deployed to Vercel straight from this repo.

**Live:** https://sisifotoken.xyz

## What's in here

- `index.html` — the whole site. One file, one page.
- `favicon.png` — the mascot (Sisyphus pushing the boulder), also used as the nav logo.
- `lore-sentence.png`, `lore-fall.png`, `lore-return.png`, `lore-climb.png` — the four illustrated chapters shown on the Home section.
- `base-chain.png`, `solana.png`, `robinhood.png` — chain icons used in the sidebar.
- `x.png`, `farcaster.png` — social icons.
- `og.png` — social share preview image.
- `404.html` — custom not-found page (Vercel picks this up automatically by filename).
- `robots.txt`, `sitemap.xml` — basic SEO, points crawlers at the single real page.

No `package.json`, no dependencies. Open `index.html` directly in a browser to preview.

## How it's structured

Fixed sidebar on desktop, slide-in drawer (hamburger) on mobile. Sidebar nav items call `switchSection(id, this)`, which shows/hides `.section` blocks in the main panel and highlights the active nav item. Same underlying pattern as the chain tabs on the PINE project, just reorganized into a sidebar instead of horizontal tabs — deliberately, to not feel like a reskin of that site.

Sections: **Home** (the lore + current launch status), **Base / Solana / Robinhood** (chain info + buy links, currently all "not launched yet" placeholders), **Roadmap**, **Share**.

### Bilingual (EN/ES)

Every visible string lives once in the HTML with both `data-en` and `data-es` attributes on the same element. `setLang(lang)` walks every `[data-en]` element and swaps `textContent`. On load, `navigator.language` decides the starting language — anything not starting with "es" defaults to English. The two buttons in the sidebar footer call `setLang('en')` / `setLang('es')` directly. No duplicated markup, no separate translated file to keep in sync.

### Lore section

Four chapters (`The Sentence → The Fall → The Return → The Climb`), each fading in on scroll via `IntersectionObserver` (native, no library). Deliberately **not** in mythological chronological order — it opens mid-cycle and closes on the boulder being pushed again, ending on defiance rather than descent. Each chapter image is clickable and opens in a simple lightbox (click again anywhere to close).

## Adding a chain once a token actually launches

1. Replace the "Not launched yet" `info-value.pending` spans in that chain's `<section>` with the real Chain / Quote / CA / Total supply.
2. Replace the `.buy-btn-disabled` placeholder with real `.buy-btn` links to whatever DEX(es)/launchpad(s) it trades on (see the PINE repo for the exact button markup pattern if needed).
3. Wrap any new label text in `data-en`/`data-es` pairs to keep it bilingual.

## Deploy

Connected to Vercel via GitHub. Push to `main` → auto-deploy. Domain (`sisifotoken.xyz`) registered via Namecheap, DNS managed through Cloudflare.

## Status

Not launched on any chain yet. This is the "season 1" build — mascot, lore, identity, infrastructure. NFT collection using the lore chapter illustrations has been discussed as a possible "season 2", intentionally not started until the token itself is live.
