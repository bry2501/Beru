# Offer Check

Type the trip length in minutes and see the minimum pay worth accepting
($15/hr after gas, rising after 20 min to cover the drive back).

It's an installable web app (PWA): once installed it opens full-screen from
your home screen and works offline.

## Install on your phone

1. Open the app's URL (see "Hosting" below) once while online.
2. **iPhone (Safari):** Share → **Add to Home Screen**.
   **Android (Chrome):** ⋮ menu → **Install app** (or **Add to Home screen**).
3. Launch it from the new icon. No internet needed after the first load.

On a computer, Chrome/Edge show an install icon in the address bar.

## Hosting

`.github/workflows/pages.yml` publishes the app to GitHub Pages on every push
to `main`. One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
The app will then be at `https://<your-username>.github.io/<repo>/`.

Any static host works too (Netlify, Cloudflare Pages, etc.); just upload
`index.html`, `manifest.webmanifest`, `sw.js` and `icons/`. It must be served
over HTTPS for install and offline mode.

## Run locally

```
python3 -m http.server 8000
```
then open http://localhost:8000.

## Updating

After changing any file, bump `VERSION` in `sw.js` so installed copies pick up
the new version.
