# JARVIS LAB — AR Molecule Builder

> *"Systems online. Welcome to the lab."*

Build, inspect and react real molecules in 3D **using nothing but webcam hand gestures**.
JARVIS watches your hands, enforces the octet rule, explains VSEPR geometry in a calm
British voice, and blows things up when you get a reaction right.

Everything runs **client-side**. Video frames never leave your device: they are drawn to a
local canvas, landmarks are computed in the tab, and nothing is uploaded, recorded or stored.

```bash
npm install
npm run dev      # → http://localhost:5173
```

Then allow camera access (it is **compulsory** — there is no webcam-free mode), hold up a hand
and pinch.

---

## Contents

1. [Requirements](#requirements)
2. [Quick start](#quick-start)
3. [Gesture guide](#gesture-guide)
4. [Voice commands](#voice-commands)
5. [Game modes](#game-modes)
6. [Architecture](#architecture)
7. [Extending the data (JSON)](#extending-the-data-json)
8. [Gesture-threshold tuning](#gesture-threshold-tuning)
9. [Performance & accessibility](#performance--accessibility)
10. [Privacy](#privacy)
11. [Deploying](#deploying)
12. [Troubleshooting](#troubleshooting)
13. [Assumptions & scope notes](#assumptions--scope-notes)

---

## Requirements

| | |
|---|---|
| Node | ≥ 18 |
| Browser | Chrome / Edge 111+ (recommended), Safari 17+, Firefox with `mediaDevices` |
| Camera | Any 720p webcam. Requested as `1280×720`, `facingMode: 'user'`, 30 fps |
| Origin | `https://…` or `http://localhost` — `getUserMedia` refuses plain-http origins |
| Optional | `@tensorflow/tfjs` + `@tensorflow-models/coco-ssd` for **Scan Mode** (installed as optional deps) |

MediaPipe's WASM and the hand-landmark model are fetched from a CDN at runtime by default.
To host them yourself (offline / locked-down deployments), copy `wasm/` and
`hand_landmarker.task` into `public/mediapipe/` and set the two variables in `.env.example`.

---

## Quick start

```bash
npm install
npm run dev          # Vite dev server  → http://localhost:5173/dev.html

# or, for a self-contained static build (no Vite runtime needed):
npm run build:site   # vite build → site/
npm run serve        # serves site/ on 0.0.0.0:5173 with plain node:http
npm run verify:build # boots the built bundle headlessly and asserts it mounts
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build:site` | Production build into `site/` (self-contained) |
| `npm run serve` | Dependency-free static server for `site/` on port 5173 |
| `npm run start` | `build:site` + `serve` |
| `npm run verify:build` | Loads the built bundle in jsdom (no WebGL/camera) and asserts the app mounts |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest — 126 tests |

No backend, no API keys, no database. Progress lives in `localStorage`
(`jarvis-lab.campaign.v1`, `jarvis-lab.settings.v1`, `jarvis-lab.achievements.v1`).

---

## Gesture guide

All gestures are detected from **21-point MediaPipe hand landmarks**. Two hands are tracked.
Thresholds are scale-invariant: they are multiplied by each hand's own
wrist→middle-MCP distance, so the same numbers work close to and far from the camera.

| Gesture | How | Does what |
|---|---|---|
| **POINT** | Index finger up, others curled | Moves the glowing fingertip cursor; rays into the 3D scene and highlights atoms |
| **PINCH** | Thumb + index together (< 0.42 × hand scale) | In empty space: **place** an atom of the selected element. On an atom: **grab** it and drag (it can ride your palm in AR) |
| **PINCH_HOLD** | Pinch for > 400 ms | Pinch one atom and touch another → **bond** them. Alone → show that atom's **orbitals / σ–π overlap** |
| **DOUBLE_PINCH** | Two pinches within 500 ms on/near a bond | **Cycle bond order** single → double → triple |
| **OPEN_PALM** | All five fingers, held 1 s | Opens the **radial menu**; in Scan Mode it **freezes the frame and scans**. A grabbed molecule rides the palm (AR anchor) |
| **FIST** | Closed hand | **Delete** the held atom. With nothing held: recentre the camera |
| **SWIPE_LEFT / RIGHT** | Fast horizontal palm travel | **Undo / redo** (also cycles resonance structures) |
| **TWO_HAND_ROTATE** | Both palms up, rotate them about each other | **Orbit** the camera |
| **TWO_HAND_ZOOM** | Both palms up, move them together/apart | **Zoom** |
| **TWO_HAND_SPREAD** | Both palms, spread wide apart | **Exploded view** (atoms + orbitals pull apart) |
| **FINGER_COUNT 1–5** | Hold up n fingers | Answers the **Hybridization Quiz**; otherwise sets the bond order of the selected bond |
| **CIRCLE** | Trace a circle with the index tip | **Ring builder** — drops a 6-membered (aromatic) ring of the selected element |
| **PEACE** | Two fingers | Toggle orbital mode |
| **THUMBS_UP** | Thumb up | In Time Attack: **lock in** the molecule for points. Otherwise: a witty aside |

**Calibration.** Until your first pinch, an overlay reads *"Pinch to calibrate"* — the engine
measures your hand scale and the EMA smoother warms up. Landmarks are smoothed with an
exponential moving average so the cursor never jitters.

---

## Voice commands

Speech recognition is continuous with the wake word **"Jarvis"**. Everything JARVIS says is also
captioned and typed out in the right-hand panel.

| Say | Result |
|---|---|
| `Jarvis, build methane` / `build aspirin` | Ghost-guide skeleton dropped on the bench |
| `show orbitals` / `hide orbitals` | Toggle orbital rendering |
| `what is the hybridization` | Spoken explanation of the central atom |
| `explain bond` | σ/π breakdown of the selected bond |
| `scan this` | Freeze + identify the object in frame |
| `select oxygen` | Change the active element |
| `clear` | Empty the bench |
| `next level` | Advance the campaign |
| `undo` / `redo` | History |
| `reaction mode` / `sandbox` / `quiz` / `time attack` | Switch mode |
| `one` … `five`, `sp3`, `tetrahedral` | Answer a quiz question |
| `help` | JARVIS lists the commands |

The full grammar lives in `src/jarvis/commands.ts`; the command cheat sheet is in the panel.

---

## Game modes

| Mode | What it is |
|---|---|
| **Campaign** | 30 levels across 5 worlds, ghost guides, 3-star ratings, boss builds (aspirin, DNA base pair, `[Co(NH₃)₆]³⁺`) |
| **Time Attack** | 60 seconds, unique molecules only, combo multiplier, rank from *Graduate* to *JARVIS* |
| **Hybridization Quiz** | Answered by **holding up fingers**: 1 = sp, 2 = sp², 3 = sp³, 4 = sp³d, 5 = sp³d² |
| **Reaction Lab** | Grab one molecule, smash it into another. Balanced equation read aloud, exothermic = orange burst, endothermic = blue frost |
| **Sandbox** | No rules beyond "physically possible" — noble gases, radicals and hypervalency unlocked |
| **Scan** | Point the camera at an everyday object; the molecule "pulls out" of it |

**Difficulty** (Settings):

- `STRICT` — octet/duet enforced, ionic charges must balance, no radicals.
- `ADVANCED` — noble-gas compounds, radicals, expanded octets; Li/Xe/Kr/Cr/Mn/Ag unlocked.
- `SANDBOX` — only the physically impossible is blocked.

---

## Architecture

```
browser
└── <video>  (getUserMedia 1280×720, mirrored, never uploaded)
      │
      ├── HandTracker ............ @mediapipe/tasks-vision HandLandmarker, 21 pts, 2 hands
      │        │                    (requestVideoFrameCallback → ~30 Hz inference)
      │        ▼
      ├── GestureEngine .......... EMA smoothing → POINT / PINCH / PINCH_HOLD / DOUBLE_PINCH /
      │        │                    OPEN_PALM / FIST / SWIPE / TWO_HAND_* / FINGER_COUNT / CIRCLE
      │        ▼
      ├── useGestureBridge ....... gestures → store actions (place, bond, cycle, delete, react)
      │
      └── useMoleculeStore ──────► chemistryEngine (pure, tested) ──► VSEPR solver ──► three.js
                 │                        │
                 │                        └── knownMolecules.json / reactions.json / scanMap.json
                 │
            useGameStore ────────► mode, score, campaign progress, toasts, JARVIS log, settings
```

```
src/
├── main.tsx · App.tsx · index.css        # shell: video backdrop + 3D + HUD layers
│
├── camera/
│   ├── useCamera.ts                      # permission state machine, error taxonomy
│   ├── CameraGate.tsx                    # SYSTEM BOOT + arc reactor + blocking retry screen
│   └── HandOverlay.tsx                   # cyan skeleton canvas over the video
│
├── vision/
│   ├── handTracker.ts                    # MediaPipe wrapper (GPU → CPU fallback)
│   ├── gestureEngine.ts                  # landmarks → high-level events (framework-free)
│   ├── gestures.types.ts                 # vocabulary + DEFAULT_THRESHOLDS
│   └── objectScanner.ts                  # optional COCO-SSD → scanMap.json → molecule
│
├── chemistry/                            # ← all pure, all unit-tested
│   ├── elements.ts                       # 36 elements, CPK colours, max valences
│   ├── chemistryEngine.ts                # canBond, octet/duet, formal charge, aromaticity,
│   │                                     #   isomer detection, σ/π, molar mass, SMILES-lite
│   ├── hybridization.ts                  # hybridization + VSEPR AXE shapes + directions
│   ├── formalCharge.ts · stability.ts    # charges, stability classifier, ring strain
│   ├── naming.ts                         # IUPAC/common namer + functional groups
│   ├── reactionEngine.ts                 # reaction lookup, mass balance, products
│   ├── buildTools.ts                     # chains, rings, coordination, polymers, groups
│   ├── vsepSolver.ts (in three/)         # 3D layout from VSEPR templates + relaxation
│   └── data/ knownMolecules.json (220) · reactions.json (22) · scanMap.json (18 + fallbacks)
│
├── three/
│   ├── Scene.tsx                         # Canvas, fog, grid, particles, bloom, bursts
│   ├── MoleculeGroup.tsx                 # atoms + bonds + ghost + orbitals + protractor + plate
│   ├── Atom.tsx · Bond.tsx · Orbitals.tsx · Cursor.tsx
│   ├── cameraRig.ts · sceneBridge.ts     # gesture camera; screen↔world picking
│   ├── labelTexture.ts                   # canvas text cache (no CDN fonts)
│   └── effects/ Particles.tsx · Effects.tsx
│
├── hooks/
│   ├── useVisionLoop.ts                  # 30 Hz tracking loop (rVFC or rAF budget)
│   └── useGestureBridge.ts               # gestures → chemistry actions
│
├── jarvis/
│   ├── speech.ts                         # SpeechSynthesis (deep en-GB) + SpeechRecognition
│   ├── dialogue.ts · commands.ts         # persona lines; voice grammar
│   ├── sfx.ts                            # procedural Web Audio cues (no binary assets)
│   └── JarvisPanel.tsx                   # analysis card, typewriter log, waveform
│
├── game/
│   ├── campaign.ts (30 levels) · quiz.ts · timeAttack.ts · scoring.ts (12 achievements)
│
├── store/ useMoleculeStore.ts · useGameStore.ts
└── tests/ chemistryEngine.test.ts · levels.test.ts · buildTools.test.ts
```

Design rules that keep it fast and sane:

- **Chemistry is pure.** `chemistryEngine.ts` never imports React or three.js — that is why it is
  testable, and why the same rule decides a gesture, a toast and JARVIS's sentence.
- **Rejections carry data.** Every mutation returns `BondCheck { ok, code, reason, speech, severity }`
  so UI, toasts and speech stay consistent.
- **Tracking 30 Hz, rendering 60 Hz.** Inference runs on `requestVideoFrameCallback` and never
  blocks the render loop.
- **The HUD does not re-render per frame.** Panels subscribe to a cheap "bench signature"
  (element counts + bond orders), not to raw atom positions, so dragging never re-runs the
  analysis 60× a second.

---

## Extending the data (JSON)

All content is JSON next to the code that reads it — no rebuilds of logic, no migrations.

### Add a molecule — `src/chemistry/data/knownMolecules.json`

```jsonc
{
  "formula": "C6H8O7",              // Hill-ish; must match the SMILES you give
  "smiles": "OC(=O)CC(O)(CC(=O)O)C(=O)O",
  "name": "citric acid",
  "iupac": "2-hydroxypropane-1,2,3-tricarboxylic acid",
  "uses": ["food preservative", "descaling agent"],
  "hazards": ["irritant at high concentration"],
  "hybridization": "sp3",           // central atom
  "geometry": "tetrahedral",
  "central": "C",
  "tags": ["organic", "world3"],
  "funFact": "Lemons are ~5% citric acid by mass."   // optional
}
```

The entry is picked up automatically by naming, the analysis card, quiz generation, Scan Mode
lookups and reaction products. `src/tests/levels.test.ts` verifies that every declared `formula`
matches its `smiles`, so a typo fails the test suite rather than the runtime.

### Add a level — `src/game/levels.json`

```jsonc
{
  "id": "w3-07", "world": 3, "index": 7,
  "name": "Aspirin", "formula": "C9H8O4",
  "smiles": "CC(=O)Oc1ccccc1C(=O)O",       // or "fragments": [{ "name": "…", "smiles": "…" }]
  "difficulty": "strict", "ghost": true,   // translucent target skeleton
  "hint": "Acetylate the phenol — ester, not ether.",
  "teach": "Aspirin is an ester of salicylic acid; that acetyl is why it is gentler.",
  "starTimes": [90, 180],                  // seconds: [3 stars, 2 stars]
  "askHybridization": false,
  "expectedHybridization": "sp2"
}
```

Levels unlock in order; the last one you completed is `lastPlayed`. Progress resets from
Settings → *erase progress*.

### Add a reaction — `src/chemistry/data/reactions.json`

```jsonc
{
  "id": "haber-process",
  "name": "Haber process",
  "type": "synthesis",                     // groups the Reaction Lab list
  "equation": "N₂ + 3 H₂ → 2 NH₃",        // display only (unicode subscripts)
  "reactants": [{ "formula": "N2", "coeff": 1 }, { "formula": "H2", "coeff": 3 }],
  "products":  [{ "formula": "NH3", "coeff": 2 }],
  "dH": -92.4,                             // kJ/mol, signed
  "conditions": "Fe catalyst, 450 °C, 200 atm",
  "exothermic": true,
  "jarvis": "The Haber process. It feeds half the planet."
}
```

Reactions are matched by the **sorted pair of reactant formulas**, so order does not matter.
`isBalanced()` is asserted in the tests — an unbalanced row fails CI rather than producing
matter from nothing.

### Add a scan target — `src/chemistry/data/scanMap.json`

```jsonc
{ "classes": ["bottle", "wine glass"], "formula": "H2O",
  "name": "water", "note": "A drink vessel — mostly water." }
```

`classes` are COCO-SSD label names (lower-cased on match); `formula` must exist in
`knownMolecules.json`. The `fallbacks` array holds JARVIS's lines when nothing is recognised.

---

## Gesture-threshold tuning

Everything lives in `DEFAULT_THRESHOLDS` (`src/vision/gestures.types.ts`) and is editable live in
**Settings → Gesture tuning**.

| Threshold | Default | Meaning | If it misfires… |
|---|---|---|---|
| `pinchOn` | 0.42 | Pinch closes when thumb–index < **0.42 × hand scale** | Raise it if pinches trigger too eagerly |
| `pinchOff` | 0.58 | …and releases above 0.58 (hysteresis stops flicker) | Keep ~1.4 × `pinchOn` |
| `pinchHoldMs` | 400 | Hold time before `PINCH_HOLD` (bonding) | Lower for impatience, raise if you bond accidentally |
| `doublePinchMs` | 500 | Window for `DOUBLE_PINCH` (bond order) | Raise if your double pinch is leisurely |
| `fingerExtend` | 1.05 | Tip-to-PIP distance × scale = "extended" | Lower if fingers read as extended too easily |
| `thumbExtend` | 0.65 | Same for the thumb (it is foreshortened) | — |
| `swipeVelocity` | 0.0016 | Palm speed (units/ms) for a swipe | Raise if accidental swipes fire |
| `swipeDistance` | 0.16 | Minimum horizontal travel | Raise if short moves trigger undo |
| `palmHoldMs` | 1000 | Open-palm hold → radial menu / Scan | Lower for faster menus |
| `zoomStep` / `rotateStep` | 0.14 / 0.22 | Change required per two-hand tick | Lower = more sensitive |
| `smoothing` | 0.45 | EMA factor (0 = frozen, 1 = raw) | Lower = smoother but laggier cursor |
| `circleAngle` / `circleRadius` | 1.75π / 0.35 | Ring-builder circle gesture | Raise the angle if rings appear unbidden |

Two multipliers sit on top:

- **Gesture sensitivity** (Settings, 0.4–2.0×) scales the "how hard do I try" thresholds —
  pinch windows, swipe distance, zoom/rotate steps — in one slider.
- **Hand scale** (measured per hand, wrist → middle MCP) makes every distance threshold
  depth-invariant, so you can sit back from the laptop.

Rule of thumb: if a gesture *never* fires, **raise** sensitivity; if it fires when you did not
mean it, **lower** sensitivity and increase the specific step.

---

## Performance & accessibility

- 60 fps render / ~30 fps tracking; the tracking loop prefers `requestVideoFrameCallback` and
  skips duplicate frames.
- Geometry and materials are cached and shared (one sphere geometry, one material per element);
  particle fields are single `Points` objects; textures are canvas-generated and disposed.
- Device pixel ratio is capped at 2; particle count drops in high-contrast mode.
- Accessibility: captions + typewriter for everything JARVIS says, high-contrast mode,
  Okabe–Ito colour-blind palette, large hit targets, full keyboard control of the
  **settings and menus only** (`,` settings, `o` orbitals, `l` labels, `g` ghost, `Esc` close,
  `Ctrl/Cmd+Z` undo). Molecule building stays gesture-first by design.
- `npm test` runs 124 Vitest specs: 40+ real molecules classified, plus CH₅, OH₃, NaCl₂, NeH,
  F₂O₃, SF₇, CCl₅ explicitly rejected with the correct chemical reason.
- **It never shows a blank page.** A top-level `<ErrorBoundary>` turns any render crash into a
  JARVIS diagnostic card with the message, component stack and a reload button. An inline
  boot watchdog in `index.html` runs *before any module is fetched*, so even a dead dev server
  or a 404 chunk produces a readable report (error list + origin / secure-context / embedded /
  WebGL / getUserMedia / mounted flags) instead of a stuck "Initialising…" screen. Critical
  inline CSS means the failure state is dark, never white.
- **It degrades instead of dying.** WebGL is probed before the 3D stage mounts (no GPU → a
  readable "3D stage offline" panel, HUD and chemistry still fully working), MediaPipe is
  imported dynamically (a failed CDN/WASM load costs you hand tracking, not the app), and every
  2D-canvas helper tolerates a null context and a missing `ctx.roundRect` (pre-2022 browsers).

---

## Privacy

- The camera stream is attached to a local `<video>` and drawn to local canvases only.
- There is **no backend**: no fetch, no analytics, no telemetry, no service worker.
- Progress and settings stay in `localStorage` on your machine.
- Scan Mode runs the (optional) TensorFlow.js model **in the tab**; the frozen frame is discarded
  after inference.
- The only network requests are the MediaPipe WASM/model and Google Fonts — self-host both to go
  fully offline (see `.env.example`).

---

## Deploying

**The published site is already in the repo root — plain HTML, CSS and JS:**

```
index.html      ← the built app (plain HTML)
assets/         ← its JavaScript and CSS
```

That is a completely normal static site. GitHub Pages (or any host) serves it with
**no build step, no CI and no configuration**.

### GitHub Pages — default settings, nothing to configure

1. **Settings → Pages → Build and deployment**
2. **Source:** Deploy from a branch · **Branch:** your branch · **Folder:** **`/ (root)`**
3. **Save** → live at `https://<user>.github.io/<repo>/` (HTTPS, so the camera works).

### Any other static host

Upload *these two things* — `index.html` and the `assets/` folder — to Netlify, Vercel,
S3, Cloudflare Pages, Surge, or just serve the folder locally:

```bash
npm run serve      # serves the repo root on http://0.0.0.0:5173
```

### After changing the code

```bash
npm install
npm run publish    # rebuilds and refreshes index.html + assets/
git add index.html assets && git commit -m "rebuild" && git push
```

### For development only

```bash
npm run dev        # → http://localhost:5173/dev.html
```

`dev.html` is the Vite entry; the published `index.html` is generated from it, so the
dev server never overwrites the live site.

> ℹ️ CI is entirely optional. If you would rather let GitHub build on every push, copy
> `deploy/github-pages.yml` to `.github/workflows/pages.yml` and set Pages → Source:
> "GitHub Actions" (it publishes `dist/`).

## Troubleshooting

| Symptom | Fix |
|---|---|
|---|---|
| Stuck on "CAMERA ACCESS REQUIRED" | Click the camera icon in the address bar → Allow → *Retry access*. Check no other app holds the camera. |
| Cursor is mirrored / gestures feel reversed | Settings → **Mirror video** (on by default, selfie view). |
| Hands detected but nothing places | You may be pinching on top of an atom (that *grabs*). Point at empty space, then pinch. |
| "Hand model" never loads | The MediaPipe CDN is blocked — self-host WASM + model and set the two env vars. |
| Scan Mode says the detector is missing | `npm i @tensorflow/tfjs @tensorflow-models/coco-ssd` (optional deps). Gestures and voice are unaffected. |
| No voice | Chrome/Edge only for recognition; synthesis needs a first user gesture — click anywhere once. |
| Low FPS | Close other camera apps, lower the browser zoom, turn off orbitals, or set sensitivity lower to reduce spurious builds. |
| GitHub Pages shows "JARVIS LAB could not start — the application script never executed" | Pages is publishing the repo source instead of the build. Set **Settings → Pages → Source: GitHub Actions** and let `.github/workflows/pages.yml` publish `dist/`. |
| Stuck on "Initialising JARVIS LAB…" | Wait 12 seconds: the boot watchdog then prints the reason (failed script, missing chunk, dead server) with environment details and a reload button. If it says the script never executed, the dev server is not running — start `npm run dev` (or `npm run start` for the static build). |
| Blank page | Hard-reload (`Cmd/Ctrl+Shift+R`). If it appears right after `npm install`, Vite was re-optimising dependencies and the old page lost its module graph — reload and it is gone. If it persists, the app now prints the reason on screen: a red **fault card** for render errors, or an "initialising" note plus a console message when a script failed to load. |
| "3D stage offline" | WebGL is unavailable/disabled: enable hardware acceleration in the browser settings or use Chrome/Edge. Everything except the hologram keeps working. |

Keyboard: `,` settings · `o` orbitals · `l` labels · `g` ghost guide · `Ctrl/Cmd+Z` undo ·
`Esc` close overlays.

---

## Assumptions & scope notes

- **Camera is compulsory**, as specified: there is deliberately no mouse-building fallback.
  Mouse/keyboard drive settings, menus and accessibility only.
- SMILES support is a **lite parser** (organic subset, branches, rings, aromatics, charges,
  `[Co(NH3)6]3+`-style complexes) sufficient for every bundled molecule — not a full
  OpenSMILES implementation.
- Sound effects are **synthesised with Web Audio** rather than shipped as MP3s, so the repository
  stays source-only. `howler` is a declared dependency: swap `play()` in `src/jarvis/sfx.ts` for a
  `Howl` and no call site changes.
- Scan Mode is best-effort: COCO-SSD labels are coarse, so `scanMap.json` maps an object class to a
  *representative* molecule and the note says so.
- The 3D scene renders transparently over the dimmed webcam feed for the AR look; disable it by
  passing `transparent={false}` to `<Scene />` in `src/App.tsx`.
- Hyphenation, spelling and units follow IUPAC/US convention; hybridization is reported for the
  **central atom** (highest σ degree, tie-broken by mass).

---

*Built with Vite + React 18 + TypeScript, three.js via @react-three/fiber and drei,
MediaPipe Tasks Vision, Zustand, TailwindCSS and Vitest. No backend, no excuses.*
