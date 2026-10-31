# Garage Fit

Will the car fit your parking space or garage? Pick a car, enter your space, and get an instant
fits / tight / won't-fit verdict with door and length clearances — plus a to-scale top-down diagram
and a live-camera footprint overlay for phones.

## Features

- 18 popular India-market cars with real approximate dimensions (length / width / height).
- **Fit verdict** with reasoning: length gap, per-side door clearance, and optional garage headroom.
- **To-scale top-down diagram** (SVG) showing the parking space and the car footprint, color-coded by
  verdict, with centimetre clearance labels.
- **Live-camera overlay**: point your phone at a spot and overlay the car's footprint at an
  adjustable scale (progressive enhancement; needs camera permission).
- Mobile-friendly layout.

## Tech stack

- **React 18 + TypeScript + Vite**, Tailwind CSS, framer-motion
- Web camera via `getUserMedia`; SVG for the scaled diagram

## How it works

- `src/data/cars.ts` — catalog of cars with dimensions in millimetres.
- `src/lib/fit.ts` — `computeFit(car, spaceL, spaceW, spaceH)` returns a verdict plus clearances.
  Door clearance uses ~600 mm/side as "comfortable" and ~300 mm/side as the "squeeze" threshold; the
  verdict also checks length and (optional) height.
- `src/components/TopDownDiagram.tsx` — renders the space and car footprint to a shared scale so both
  are always visible, with clearance labels.
- `src/components/CameraOverlay.tsx` — streams the rear camera and overlays a footprint box sized by a
  px-per-metre slider you calibrate against the ground.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

The camera overlay needs a device with a camera and a secure context (localhost or HTTPS). The fit
calculator and diagram work everywhere without a camera.

## Project structure

```
src/
  App.tsx                       # car picker, space inputs, verdict, diagram, camera toggle
  data/cars.ts                  # car dimensions
  lib/fit.ts                    # fit + clearance logic
  lib/units.ts                  # unit helpers (mm/m/cm), cn()
  components/
    TopDownDiagram.tsx          # to-scale SVG
    CameraOverlay.tsx           # live-camera footprint overlay
```

## Notes / scope

- This is a **mobile-web** app. The camera overlay is a visual aid — you calibrate its scale by eye,
  not true spatial AR.
- Dimensions are approximate manufacturer figures with mirrors folded.
- A native Expo / ARCore version (with real plane detection and world-scale placement) is a natural
  follow-up if you want measured AR rather than an eyeballed overlay.
