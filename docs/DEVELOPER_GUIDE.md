# 🛠️ React Native Barikoi Maps - Developer Guide

Welcome! This guide is designed for the React Native community to build powerful map applications using **Barikoi Maps**. It provides a deep dive into the project structure, core concepts, and advanced implementation patterns.

> For a quick project overview, see the [**README.md**](../README.md). For a detailed list of functions and props, refer to the [**API_REFERENCE.md**](./API_REFERENCE.md).

## 📖 Table of Contents

1. [Initial Setup](#1-initial-setup)
2. [Project Structure](#2-project-structure)
3. [Core Concepts](#3-core-concepts)
4. [Component Deep Dive](#4-component-deep-dive)
5. [API Integration](#5-api-integration)
6. [Performance Optimization](#6-performance-optimization)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Initial Setup

### Dependencies Installation

```bash
# Core mapping library
npm install @maplibre/maplibre-react-native

# Location services
npm install expo-location

# Navigation
npm install @react-navigation/drawer @react-navigation/native

# Gesture handling
npm install react-native-gesture-handler react-native-reanimated

# For iOS, you must install the native pods
cd ios && pod install
```

### Barikoi API Key Setup

1.  Create an account on the [Barikoi Website](https://barikoi.com).
2.  Generate a new API Key from your dashboard.
3.  Add the key to `utils/mapUtils.ts`:

```typescript
const BARIKOI_API_KEY = "YOUR_API_KEY_HERE";
```

---

## 2. Project Structure

```
expo-map-app/
├── app/                    # Expo Router pages for navigation
│   ├── _layout.tsx         # Drawer navigation setup
│   ├── index.tsx           # Simple Map (Home Screen)
│   └── ...                 # Other map screens
├── components/
│   └── screens/            # React components for each map screen
│       ├── SimpleMapScreen.tsx
│       └── ...
├── utils/
│   └── mapUtils.ts         # Centralized helpers, hooks, and constants
└── assets/
    └── icons/
        └── barikoi_icon.png
```

---

## 3. Core Concepts

### Map Style Loading

We use a custom hook `useBarikoiMapStyle` to fetch the map style from Barikoi's server. This hook centralizes logic for loading, error handling, and caching.

```typescript
import { useBarikoiMapStyle } from "../utils/mapUtils";

export default function YourMapScreen() {
  const { styleJson, loading, error } = useBarikoiMapStyle();

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent />;

  return <MapView mapStyle={styleJson}>{/* Your map content */}</MapView>;
}
```

### Camera Configuration

The `<Camera />` component controls the map's viewport (center, zoom, angle).

```typescript
<Camera
  centerCoordinate={[90.364159, 23.823724]} // [longitude, latitude]
  zoomLevel={16}
  animationDuration={1000}
  animationMode="flyTo" // or "linearTo"
/>
```

### GeoJSON Data

GeoJSON is the standard format for representing geographic data. We use it to draw lines, polygons, and other shapes on the map via the `<ShapeSource />` component.

```typescript
const geoJSONData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Feature Name" },
      geometry: {
        type: "Point", // Can also be 'LineString', 'Polygon', etc.
        coordinates: [90.364159, 23.823724],
      },
    },
  ],
};
```

---

## 4. Component Deep Dive

### Simple Map Screen

The most basic implementation, showing how to render a map with a single marker.

- **Key Features**: Barikoi style loading, single marker, basic camera, loading state.
- **Use Cases**: Static map display, location showcase.

### Current Location Screen

An advanced example for tracking the user's real-time location.

- **Key Features**: Location permission handling, live location updates, auto-fly to user's position, custom location marker.
- **Implementation Highlights**:

  ```typescript
  // Request permission from the user
  const requestLocationPermission = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setHasLocationPermission(true);
    }
  };

  // The component that shows the user's location on the map
  <UserLocation
    visible={true}
    animated={true}
    onUpdate={handleLocationUpdate}
  />;
  ```

### Line and Polygon Screens

These screens demonstrate how to draw vector shapes on the map.

- **Line Screen**: Draws a line between two points using a `LineString` GeoJSON.
- **Polygon Screen**: Renders a filled area using a `Polygon` GeoJSON. The first and last coordinates must be the same to close the shape.

```typescript
// Render a line
<ShapeSource id="lineSource" shape={lineGeoJSON}>
    <LineLayer id="lineLayer" style={MAP_STYLES.line} />
</ShapeSource>

// Render a polygon
<ShapeSource id="polygonSource" shape={polygonGeoJSON}>
    <FillLayer id="polygonFill" style={MAP_STYLES.polygon} />
</ShapeSource>
```

---

## 5. API Integration

Our `utils/mapUtils.ts` provides helper functions for common Barikoi API endpoints.

### Barikoi Places API

```typescript
// Search for places with autocomplete
const searchPlaces = async (query) => {
  const response = await fetch(
    `https://barikoi.xyz/v1/api/search/autocomplete/place?api_key=${API_KEY}&q=${query}`
  );
  return response.json();
};

// Get address from coordinates
const reverseGeocode = async (lat, lng) => {
  const response = await fetch(
    `https://barikoi.xyz/v1/api/search/reverse/geocoding?api_key=${API_KEY}&longitude=${lng}&latitude=${lat}`
  );
  return response.json();
};
```

---

## 6. Performance Optimization

### Map Style Caching

To reduce network requests, the map style can be cached in `AsyncStorage`. Our `useBarikoiMapStyle` hook can be extended to support this.

```typescript
// utils/mapUtils.ts
const STYLE_CACHE_KEY = "barikoi_map_style";

// Check cache before fetching
const cachedStyle = await AsyncStorage.getItem(STYLE_CACHE_KEY);
if (cachedStyle) {
  setStyleJson(JSON.parse(cachedStyle));
} else {
  // Fetch from network and then cache it
  const newStyle = await fetchBarikoiMapStyle();
  await AsyncStorage.setItem(STYLE_CACHE_KEY, JSON.stringify(newStyle));
}
```

### Marker Clustering

When rendering many markers, use a clustering library like `react-native-maps-super-cluster` to group nearby markers into a single cluster, improving performance.

### Lazy Loading

For complex screens, use `React.lazy` to load components on demand.

```typescript
const LazyMapScreen = React.lazy(() => import("./MapScreen"));

<Suspense fallback={<LoadingScreen />}>
  <LazyMapScreen />
</Suspense>;
```

---

## 7. Troubleshooting

### Map Style Loading Failed

- **Problem**: The map is blank or shows an error.
- **Solutions**:
  1.  Verify your Barikoi API key is correct and has not expired.
  2.  Check your device's internet connection.
  3.  Implement a retry mechanism for network requests.

### Location Permission Issues

- **Problem**: The app cannot access the user's location.
- **Solutions**:
  1.  Ensure you have requested the necessary foreground permissions.
  2.  Check if location services are enabled on the device.
  3.  Provide a fallback for the user, like a button to retry the permission request.

### Performance Lag

- **Problem**: The map is slow or unresponsive.
- **Solutions**:
  1.  Memoize heavy components with `React.memo`.
  2.  Use marker clustering for large datasets.
  3.  Debounce map events like `onRegionChange` to prevent excessive re-renders.
  4.  Optimize image assets and GeoJSON payloads.

---

**Happy Mapping! 🗺️**

This guide is continuously updated. If you have any questions or improvement suggestions, please contribute to this project!

**Made with ❤️ for the Bangladesh React Native Community**
