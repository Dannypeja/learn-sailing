# 3D models

## Monohull sloop (single rudder)

- File: `monohull-sloop-single-rudder.glb`
- Source asset: `boat-sail-a` from [Kenney Watercraft Kit 2.1](https://kenney.nl/assets/watercraft-kit)
- Author: [Kenney](https://www.kenney.nl)
- License: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

Educational hotspots, camera poses, extra rigging lines, and a gelcoat/CAD material treatment are defined in the app (`content/boats/` and the viewer) and are not part of the original Kenney mesh.

## Hosted yacht (optional)

When `NEXT_PUBLIC_BOAT_MODEL_URL` is set, the viewer loads that GLB instead of Kenney and keeps the file’s own materials.

Intended asset:

- [Yacht by MesXwi](https://sketchfab.com/3d-models/yacht-ae42c1609c25412cbfe40baf9728d987) on Sketchfab
- Author: [MesXwi](https://sketchfab.com/MesXwi)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Credit required by the author

Host the downloadable GLB or glTF (not Sketchfab’s viewer `binz`) on a CORS-enabled public URL, or commit it under `public/models/` (25 MB is within GitHub’s limit). Do not check in paid or non-downloadable Sketchfab meshes.
