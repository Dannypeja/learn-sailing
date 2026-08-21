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

Host the downloadable GLB or glTF (not Sketchfab’s viewer `binz`) as a **GitHub Release** asset, or use Sketchfab’s ~7 MB glTF zip (that one fits GitHub’s 25 MB website upload). Do not use the repo “Add file” button for the ~25 MB GLB. Command-line `git push` allows up to 100 MB per file; Releases allow up to 2 GB. Do not check in paid or non-downloadable Sketchfab meshes.
