# learn-sailing

Open-source website for learning the basics of sailing. It is German-first and multilingual.

- **Phase 1 — boat parts explorer:** orbit a sloop, click parts, filter by hull/rig groups, and jump the camera from a searchable list.
- **Phase 2 — sailing simulation:** the boat stays put while you rotate wind and heading, trim mainsail and jib, and watch heel. A course-hold mode sets the boat onto a point of sail; a top-down view is for reading angles.

Default language is **German** (`/de`). English is available at `/en`. The simulator lives at `/de/sail` and `/en/sail`. Translations live in the repository.

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

This is a standard Next.js App Router app. Import [github.com/Dannypeja/learn-sailing](https://github.com/Dannypeja/learn-sailing) in Vercel; no environment variables are required for phase 1.

## Project layout

| Path | Purpose |
| --- | --- |
| `messages/de.json`, `messages/en.json` | UI and nautical-term translations |
| `content/boats/` | Hull-type registry and part catalogs |
| `public/models/` | Vendored glTF/GLB files plus attribution |
| `src/components/boat/` | 3D parts viewer, filters, list, detail card |
| `src/components/sail/` | Stationary sailing simulator (wind, trim, heel, top-down) |
| `src/lib/sailing/` | Point-of-sail math: TWA, recommended sheets, heel |
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

The parts explorer uses Kenney’s CC0 `boat-sail-a` from the [Watercraft Kit](https://kenney.nl/assets/watercraft-kit). Educational interaction (hotspots, labels, extra stay/sheet lines) lives in the sidecar catalog, so the GLB can be swapped without rewriting the app.

The sailing simulator does **not** use that GLB: hull, boom, and sails are fused in one mesh, so boom and sail trim cannot move independently. The simulator builds a small procedural sloop (hull, keel, mast, boom, mainsail, jib) so sheets, heel, and points of sail can be shown. The boat never translates; only heading, heel, and sail angles change.

## License

Source code is Apache-2.0. Third-party models keep their original licenses; see `public/models/ATTRIBUTION.md`.
