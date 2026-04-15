# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — start Expo dev server (Metro bundler)
- `npm run android` — build and run on Android device/emulator
- `npm run ios` — build and run on iOS device/simulator
- `npm run web` — run in browser
- `npm run lint` — run ESLint via `expo lint`
- No test runner is configured

## Architecture

**Stack:** Expo SDK 53, React 19, React Native 0.79, expo-router (file-based routing), @maplibre/maplibre-react-native 10.1.6, expo-location. Node.js 24.14.1 required (see `package.json` engines).

**Routing pattern:** Each file in `app/` is a one-line re-export of a screen component from `components/screens/`. The root layout (`app/_layout.tsx`) configures a Drawer navigator registering all 8 screens. The routing layer is intentionally thin — all logic lives in the screen components.

**Map provider:** Barikoi Maps. The style JSON is fetched at runtime from `https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key={API_KEY}`. A valid Barikoi API key is **required** in `utils/mapUtils.ts` — the app will not render maps without it.

**Screen pattern:** Every screen calls `useBarikoiMapStyle()` from `utils/mapUtils.ts` to load the map style, handles loading/error states, then renders `<MapView>` with `<Camera>` and map features (markers, lines, polygons, etc.).

**Coordinates convention:** `[longitude, latitude]` arrays throughout (MapLibre convention), centered on Dhaka `[90.364159, 23.823724]`.

## Key Files

- `utils/mapUtils.ts` — API key constant, style fetching, `useBarikoiMapStyle()` hook, default coordinates/camera settings, style constants (`MAP_STYLES`, `BARIKOI_COLORS`), and geometry helpers (`isWithinBangladeshBounds`, `calculateDistance`, `createCirclePolygon`)
- `app/_layout.tsx` — Drawer navigator configuration with all screen registrations
- `components/screens/` — All 8 screen implementations
- `components/CustomMarker.tsx` — SVG flame marker icon (exported as `FlameIcon`)
- `components/BarikoiLogo.tsx` — SVG logo overlay used on map screens
- `app.json` — Expo config including `@maplibre/maplibre-react-native` plugin, new architecture enabled, and `extra.barikoiApiKey` field

## Notes

- Path alias `@/*` maps to project root (configured in tsconfig.json)
- The New Architecture is enabled (`newArchEnabled: true` in app.json)
- No `babel.config.js` or `metro.config.js` — not required with Expo SDK 53 defaults
- EAS Build is configured in `eas.json` (dev/preview produce APKs, production produces AAB)
