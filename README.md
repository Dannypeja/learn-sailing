# learn-sailing

Open-source website for learning the basics of sailing. Phase 1 is a German-first, multilingual **3D boat parts explorer**: orbit a sloop, click parts, filter by hull/rig groups, and jump the camera from a searchable list.

Default language is **German** (`/de`). English is available at `/en`. Translations live in the repository.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/de` or `/en` from the `Accept-Language` header.

```bash
npm run lint
npm run build
```

## Deploy on Vercel

This is a standard Next.js App Router app. Import [github.com/Dannypeja/learn-sailing](https://github.com/Dannypeja/learn-sailing) in Vercel. Phase 1 runs with no environment variables (Kenney starter mesh).

To load a hosted yacht GLB instead, set `NEXT_PUBLIC_BOAT_MODEL_URL` to a public HTTPS URL that sends CORS headers (GitHub Release assets do). See `.env.example`.

## Project layout

| Path | Purpose |
| --- | --- |
| `messages/de.json`, `messages/en.json` | UI and nautical-term translations |
| `content/boats/` | Hull-type registry and part catalogs |
| `public/models/` | Vendored glTF/GLB files plus attribution |
| `src/components/boat/` | 3D viewer, filters, list, detail card |
| `src/i18n/` | next-intl routing |

## Add a translation

1. Copy every key from `messages/de.json` into a new `messages/{locale}.json`.
2. Add the locale to `src/i18n/routing.ts` (`locales` array).

Part display names must stay in the message files (`parts.mast.name`, `parts.mast.description`). Part IDs in `parts.json` are language-independent.

## Add or relabel a boat part

Edit `content/boats/monohull-sloop-single-rudder/parts.json`:

- `id` — stable key, used in translation files
- `categories` — drives filters (`hull`, `mast`, `standing-rig`, …)
- `position` / `radius` — clickable hotspot in model space
- `meshNames` — optional meshes to highlight
- `camera` — fly-to pose when the part is selected
- `lines` — optional extra rigging segments (forestay, shrouds, sheets)

Then add `parts.{id}.name` and `parts.{id}.description` in both `messages/de.json` and `messages/en.json`.

## Add another hull type

The registry is built for more than one boat. Phase 1 only registers a **monohull sloop with a single rudder**.

1. Add `content/boats/{id}/parts.json` and a GLB under `public/models/`.
2. Record the asset license in `public/models/ATTRIBUTION.md`.
3. Register the boat in `content/boats/index.ts`.

## 3D model

The starter visual is Kenney’s CC0 `boat-sail-a` from the [Watercraft Kit](https://kenney.nl/assets/watercraft-kit). Educational interaction (hotspots, labels, extra stay/sheet lines) lives in the sidecar catalog, so the GLB can be swapped without rewriting the app.

A more detailed Omega-type dinghy ([Yacht by MesXwi](https://sketchfab.com/3d-models/yacht-ae42c1609c25412cbfe40baf9728d987), CC-BY 4.0) is intended next. That GLB is about 25 MB, which hits **two** 25 MB caps: Cursor chat and GitHub’s **website “Add file”** upload ([docs](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)).

Do **not** use Add file for the GLB. Use one of these:

1. **Sketchfab glTF zip (~7 MB)** — fits GitHub Add file and Cursor chat. Prefer this if you only have a browser.
2. **GitHub Release** — Releases → Draft a new release → attach the GLB (up to 2 GB). Then set `NEXT_PUBLIC_BOAT_MODEL_URL` to the asset URL. Release assets send CORS headers.
3. **`git push` from a local clone** — repository files may be up to 100 MB via the command line (warning at 50 MB). Still skip the website upload.

Do not proxy the file through a Next.js route. `npm run inspect-glb -- <path-or-url>` prints mesh names and bounds for hotspot remapping.

## License

Source code is Apache-2.0. Third-party models keep their original licenses; see `public/models/ATTRIBUTION.md`.
