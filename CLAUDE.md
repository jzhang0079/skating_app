# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-file React app: `alice-skating-tracker.jsx`. It is a mobile-first ice skating session journal for a skater named Alice. There is no package.json, build system, or test framework — this file is intended to be dropped into a React environment (e.g., pasted into a CodeSandbox or Vite project that already has React available).

## Running / developing

Since there is no project scaffolding, to run this component you need to embed it in a React app. A minimal approach:

```bash
npm create vite@latest skating-dev -- --template react
cd skating-dev
npm install
# Replace src/App.jsx content with: import SkatingTracker from './alice-skating-tracker'; export default function App() { return <SkatingTracker />; }
# Copy alice-skating-tracker.jsx into src/
npm run dev
```

## Architecture

The entire app lives in a single default export `SkatingTracker` component with no external dependencies beyond React (`useState`, `useEffect`).

**State model** — all state is in-memory (no localStorage persistence):
- `sessions` — array of session objects (seeded with `initialSessions` hardcoded at the top)
- `view` — string enum driving which screen renders: `"home" | "log" | "history" | "progress" | "session"`
- `newSession` / `jumpLog` / `selectedSpins` / `selectedSkills` / `chosenSticker` — ephemeral state for the session-logging flow
- `selectedSession` — the session object shown in the detail view

**Routing** is purely via `view` state — no router library. Each view is a conditional block inside a single scrollable `<div>`.

**Data constants** at the top of the file define the full domain:
- `JUMPS` — ordered array with `name`, `abbr`, `level`, `emoji`, `isDouble`; `abbr` is the key used in `session.jumps`
- `SPINS`, `SKILLS`, `STICKERS` — simple string arrays

**Session shape:**
```js
{
  id: number,
  date: "YYYY-MM-DD",
  duration: number, // minutes
  iceType: "Public" | "Freestyle",
  mood: emoji string,
  jumps: { [abbr]: { attempts: number, landed: number } },
  spins: string[],
  skills: string[],
  notes: string,
  sticker: emoji string,
}
```

**Styling** — all inline styles with a dark navy/ice theme (`#0a0a1a` → `#0d1b3e` gradient). CSS animations and shared utility classes (`.ice-card`, `.skate-btn`, `.land-btn`, `.fall-btn`, `.nav-btn`) are injected via a `<style>` tag inside the component. Fonts (Nunito, Pacifico) load from Google Fonts via `@import` in that same `<style>` tag.

**Jump progress** (`jumpProgress`) is derived on every render by aggregating `landed` counts across all sessions — not stored in state.

**Streak logic** counts consecutive sessions that are ≤3 days apart (sorted descending by date).
