# Draggable Marker Integration Guide

A comprehensive guide to integrating a draggable marker feature into your React Native application using MapLibre GL. This implementation allows users to drag a marker across the map, tap to place it, and view real-time coordinates.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Step-by-Step Integration](#step-by-step-integration)
6. [Understanding the Code](#understanding-the-code)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Overview

The draggable marker feature provides an interactive map experience where users can:

- **Drag** a marker to reposition it on the map
- **Tap** anywhere on the map to instantly move the marker
- **View** real-time latitude and longitude coordinates
- **Control** zoom levels and map rotation
- **Use** a custom marker icon (SVG-based)

This implementation uses MapLibre GL for React Native, which provides native map rendering with excellent performance.

---

## Features

### Core Functionality

- ✅ Draggable marker with smooth animations
- ✅ Tap-to-place marker on map press
- ✅ Real-time coordinate display (formatted to 6 decimal places)
- ✅ Zoom controls (+/- buttons)
- ✅ Compass reset button (appears when map is rotated)
- ✅ Custom SVG marker icon
- ✅ Loading and error states
- ✅ Platform-specific styling (iOS/Android)

### User Experience

- Smooth drag interactions with visual feedback
- Responsive coordinate updates during drag
- Clean, modern UI with shadow effects
- Accessible controls positioned for easy reach

---

## Prerequisites

Before integrating the draggable marker, ensure you have:

| Requirement      | Version | Notes                                 |
| ---------------- | ------- | ------------------------------------- |
| **React Native** | 0.70+   | Required for MapLibre compatibility   |
| **Expo SDK**     | 50+     | If using Expo (optional)              |
| **Node.js**      | 16+     | For package management                |
| **TypeScript**   | 4.5+    | Recommended (project uses TypeScript) |

### Required Packages

The following packages are needed for this feature:

```json
{
  "@maplibre/maplibre-react-native": "^10.1.6",
  "react-native-svg": "^15.12.0",
  "@expo/vector-icons": "^14.1.0"
}
```

---

## Installation

### 1. Install Dependencies

```bash
npm install @maplibre/maplibre-react-native react-native-svg @expo/vector-icons
# or
yarn add @maplibre/maplibre-react-native react-native-svg @expo/vector-icons
```

### 2. Platform-Specific Setup

#### iOS

```bash
cd ios && pod install && cd ..
```

#### Android

No additional setup required. The package handles native dependencies automatically.

### 3. Map Style Utility

You'll need a utility to load map styles. Create or use an existing utility that fetches map style JSON. In this project, we use `useBarikoiMapStyle` from `utils/mapUtils.ts`.

**Key points:**

- The utility fetches map style JSON from a map provider
- It handles loading states and errors
- It removes sprite properties for React Native compatibility

---

## Step-by-Step Integration

### Step 1: Create the Custom Marker Component

Create a custom marker component using SVG. This example uses a flame icon, but you can use any SVG design.

**File: `components/CustomMarker.tsx`**

```tsx
import React from "react";
import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type FlameIconProps = {
  width?: number;
  height?: number;
  style?: ViewStyle;
};

const FlameIcon: React.FC<FlameIconProps> = ({
  width = 25,
  height = 30,
  style,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 30" style={style}>
      <Path
        d="M12.0238 29.2554C12.147 29.2698 12.2713 29.2698 12.3945 29.2554..."
        fill="#FF5748"
      />
      {/* Add your SVG paths here */}
    </Svg>
  );
};

export default FlameIcon;
```

**Tip:** You can replace the SVG paths with your own marker design or use an image component instead.

### Step 2: Create the Draggable Marker Screen

Create the main screen component that handles all the draggable marker logic.

**File: `components/screens/DraggableMarkerScreen.tsx`**

The complete implementation includes:

1. **State Management**

   - `markerCoordinate`: Current marker position `[longitude, latitude]`
   - `zoomLevel`: Current map zoom level
   - `mapRotation`: Current map heading/rotation

2. **Map Configuration**

   - MapView with drag, zoom, and rotation enabled
   - Camera component for programmatic map control
   - PointAnnotation with `draggable={true}`

3. **Event Handlers**

   - `handleDrag`: Updates coordinates while dragging
   - `handleDragEnd`: Finalizes position when drag ends
   - `handleMapPress`: Moves marker to tapped location
   - `handleZoomIn/Out`: Programmatic zoom control
   - `handleCompassReset`: Resets map rotation

4. **UI Components**
   - Info panel showing coordinates
   - Zoom controls
   - Compass reset button
   - Loading and error states

**Key Code Snippets:**

```tsx
// Marker coordinate state
const [markerCoordinate, setMarkerCoordinate] = useState<[number, number]>(
  [90.364159, 23.823724] // Default: Dhaka, Bangladesh
);

// Drag handler
const handleDrag = useCallback(
  (payload: DragFeature) => {
    const coords = extractCoordinate(payload);
    setMarkerCoordinate(coords);
  },
  [extractCoordinate]
);

// Map press handler (tap to place)
const handleMapPress = useCallback(
  (payload: Feature<Geometry>) => {
    const coords = extractFromGeometry(payload);
    if (coords) {
      setMarkerCoordinate(coords);
    }
  },
  [extractFromGeometry]
);
```

### Step 3: Set Up Map Style Loading

Create or use a utility hook to load map styles:

**File: `utils/mapUtils.ts`** (excerpt)

```tsx
export const useBarikoiMapStyle = (apiKey?: string) => {
  const [styleJson, setStyleJson] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStyle = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=${apiKey}`
        );
        const data = await response.json();
        setStyleJson(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load map style"
        );
      } finally {
        setLoading(false);
      }
    };
    loadStyle();
  }, [apiKey]);

  return { styleJson, loading, error };
};
```

**Note:** Replace the API endpoint and key with your own map provider if not using Barikoi.

### Step 4: Create the Route (Expo Router)

If using Expo Router, create a route file:

**File: `app/draggable-marker.tsx`**

```tsx
import DraggableMarkerScreen from "../components/screens/DraggableMarkerScreen";

export default DraggableMarkerScreen;
```

### Step 5: Register in Navigation

Add the route to your navigation configuration:

**File: `app/_layout.tsx`** (Expo Router example)

```tsx
<Drawer.Screen
  name="draggable-marker"
  options={{
    drawerLabel: "Drag & Drop Marker",
    drawerIcon: () => <Text style={{ fontSize: 20 }}>🪄</Text>,
    title: "Drag & Drop Marker",
  }}
/>
```

For React Navigation, add it to your stack:

```tsx
<Stack.Screen name="DraggableMarker" component={DraggableMarkerScreen} />
```

### Step 6: Test the Implementation

Run your app:

```bash
# Expo
npx expo start

# React Native CLI
npm run android  # or npm run ios
```

Navigate to the draggable marker screen and test:

- Dragging the marker
- Tapping the map to move the marker
- Using zoom controls
- Rotating the map and resetting with compass

---

## Understanding the Code

### Coordinate System

MapLibre uses **longitude, latitude** format (not latitude, longitude):

```tsx
const coordinate: [number, number] = [longitude, latitude];
// Example: [90.364159, 23.823724] = Dhaka, Bangladesh
```

### Drag Event Payload

The drag events provide a GeoJSON Feature:

```tsx
type DragFeature = Feature<Point>;

// Payload structure:
{
    geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
    },
    properties: { ... }
}
```

### Camera Control

The `Camera` component allows programmatic map control:

```tsx
<Camera
  ref={cameraRef}
  centerCoordinate={markerCoordinate}
  zoomLevel={zoomLevel}
  animationDuration={300}
  animationMode="easeTo"
/>
```

Use `cameraRef.current.setCamera()` to update the camera programmatically.

### PointAnnotation Configuration

Key properties for draggable markers:

```tsx
<PointAnnotation
  id="draggable-marker"
  coordinate={markerCoordinate}
  draggable={true} // Enable dragging
  anchor={{ x: 0.5, y: 1.0 }} // Anchor point (bottom center)
  onDrag={handleDrag}
  onDragEnd={handleDragEnd}
>
  <FlameIcon width={30} height={30} />
</PointAnnotation>
```

**Anchor Points:**

- `{ x: 0.5, y: 1.0 }`: Bottom center (marker point at bottom)
- `{ x: 0.5, y: 0.5 }`: Center (marker point at center)
- `{ x: 0.5, y: 0 }`: Top center (marker point at top)

---

## Customization

### Change Default Location

Update the initial coordinate:

```tsx
const [markerCoordinate, setMarkerCoordinate] = useState<[number, number]>(
  [yourLongitude, yourLatitude] // Your default location
);
```

### Customize Marker Icon

Replace the `FlameIcon` component with your own:

```tsx
// Option 1: Use a different SVG component (Recommended)
<PointAnnotation ...>
    <CustomPinIcon width={40} height={40} />
</PointAnnotation>

// Option 2: Use an image
<PointAnnotation ...>
    <Image
        source={require('./assets/marker.png')}
        style={{ width: 40, height: 40 }}
    />
</PointAnnotation>

```

### Adjust Zoom Levels

Modify the zoom constraints:

```tsx
const MIN_ZOOM_LEVEL = 0; // Minimum zoom
const MAX_ZOOM_LEVEL = 22; // Maximum zoom
const DEFAULT_ZOOM_LEVEL = 16; // Initial zoom
```

### Customize Coordinate Display

Change the formatting:

```tsx
// Current: 6 decimal places
const formatCoordinate = (value: number) => `${value.toFixed(6)}°`;

// Alternative: 4 decimal places
const formatCoordinate = (value: number) => `${value.toFixed(4)}°`;

// Alternative: DMS format (Degrees, Minutes, Seconds)
const formatCoordinate = (value: number) => {
  // Convert to DMS format
  // ...
};
```

### Utils functions

- `extractCoordinate`: Extract coordinate from drag payload
- `extractFromGeometry`: Extract coordinate from geometry

```tsx
// Extract coordinate from drag payload
    const extractCoordinate = useCallback((payload: DragFeature): [number, number] => {
        return toLngLatTuple(payload.geometry.coordinates as number[], markerCoordinate);
    }, [toLngLatTuple, markerCoordinate]);

// Extract coordinate from geometry
    const extractFromGeometry = useCallback((feature: Feature<Geometry>): [number, number] | null => {
        if (!feature.geometry) return null;

        if (feature.geometry.type === 'Point') {
            return toLngLatTuple(feature.geometry.coordinates as number[], markerCoordinate);
        }

        if (feature.geometry.type === 'MultiPoint' && feature.geometry.coordinates.length > 0) {
            return toLngLatTuple(feature.geometry.coordinates[0] as number[], markerCoordinate);
        }

        return null;
    }, [toLngLatTuple, markerCoordinate]);
```

### Modify Info Panel Style

Update the `infoPanel` style in the StyleSheet:

```tsx
infoPanel: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    // Add your custom styles
},
```

### Add Reverse Geocoding

To show addresses instead of coordinates:

```tsx
const [address, setAddress] = useState<string>("");

const reverseGeocode = async (coords: [number, number]) => {
  try {
    const response = await fetch(
      `https://barikoi.xyz/v2/api/search/reverse/geocode?api_key=${BARIKOI_API_KEY}&longitude=${coords[0]}&latitude=${coords[1]}&district=true&post_code=true&country=true&location_type=true&division=true&address=true&area=true&thana=true`
    );
    const data = await response.json();
    setAddress(data.address || "Address not found");
  } catch (error) {
    console.error("Geocoding error:", error);
  }
};

// Call in handleDragEnd
const handleDragEnd = useCallback(
  (payload: DragFeature) => {
    const coords = extractCoordinate(payload);
    setMarkerCoordinate(coords);
    reverseGeocode(coords); // Add this
  },
  [extractCoordinate]
);
```

---

## Troubleshooting

### Map Doesn't Load

**Problem:** Map shows blank or error state.

**Solutions:**

- ✅ Check your API key is valid
- ✅ Verify network connectivity
- ✅ Ensure map style URL is correct
- ✅ Check console for error messages
- ✅ Verify `@maplibre/maplibre-react-native` is properly installed

### Marker Won't Drag

**Problem:** Marker doesn't respond to drag gestures.

**Solutions:**

- ✅ Ensure `draggable={true}` is set on `PointAnnotation`
- ✅ Check that `onDrag` and `onDragEnd` handlers are provided
- ✅ Verify you're using `PointAnnotation` (not `MarkerView`)
- ✅ Test on a physical device (drag may not work in simulators)

### Coordinates Are Inaccurate

**Problem:** Coordinates don't match expected location.

**Solutions:**

- ✅ Verify coordinate format: `[longitude, latitude]` (not reversed)
- ✅ Check zoom level (higher zoom = more precision)
- ✅ Ensure map style uses correct projection (usually Web Mercator)

### Performance Issues

**Problem:** Map is laggy or slow to respond.

**Solutions:**

- ✅ Reduce animation duration
- ✅ Debounce coordinate updates during drag
- ✅ Optimize marker icon (use smaller images/SVGs)
- ✅ Limit map style complexity

### Build Errors

**Problem:** App won't build after adding dependencies.

**Solutions:**

- ✅ Run `pod install` in iOS directory
- ✅ Clean build folders: `cd android && ./gradlew clean`
- ✅ Clear Metro cache: `npx expo start --clear`
- ✅ Verify React Native version compatibility

---

## Best Practices

### 1. Coordinate Validation

Always validate coordinates before using them:

```tsx
const isValidCoordinate = (coords: [number, number]): boolean => {
  const [lng, lat] = coords;
  return (
    typeof lng === "number" &&
    typeof lat === "number" &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
};
```

### 2. Debounce Drag Updates

For better performance, debounce coordinate updates during drag:

```tsx
import { debounce } from "lodash";

const debouncedUpdate = useMemo(
  () =>
    debounce((coords: [number, number]) => {
      // Update state or make API call
    }, 300),
  []
);
```

### 3. Persist Marker Position

Save marker position for app restarts:

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

// Save
await AsyncStorage.setItem("markerPosition", JSON.stringify(markerCoordinate));

// Load
const saved = await AsyncStorage.getItem("markerPosition");
if (saved) {
  setMarkerCoordinate(JSON.parse(saved));
}
```

### 4. Error Handling

Always handle errors gracefully:

```tsx
const handleDragEnd = useCallback(
  async (payload: DragFeature) => {
    try {
      const coords = extractCoordinate(payload);
      setMarkerCoordinate(coords);
      // Additional operations
    } catch (error) {
      console.error("Drag end error:", error);
      // Show user-friendly error message
    }
  },
  [extractCoordinate]
);
```

### 5. Accessibility

Make controls accessible:

```tsx
<Pressable
  style={styles.controlButton}
  onPress={handleZoomIn}
  accessibilityLabel="Zoom in"
  accessibilityHint="Increases map zoom level"
>
  <Ionicons name="add-outline" size={24} />
</Pressable>
```

### 6. Type Safety

Use TypeScript types for better code safety:

```tsx
type Coordinate = [number, number];
type DragFeature = Feature<Point>;

const markerCoordinate: Coordinate = [90.364159, 23.823724];
```

---

## Next Steps

### Enhancements You Can Add

1. **Multiple Markers**: Support dragging multiple markers simultaneously
2. **Marker Clustering**: Group nearby markers for better UX
3. **Custom Animations**: Add bounce or fade animations when placing markers
4. **Undo/Redo**: Allow users to undo marker movements
5. **Search Integration**: Let users search for locations and place markers
6. **Route Planning**: Draw routes between multiple markers
7. **Offline Support**: Cache map tiles for offline usage

### Related Features

- **Current Location**: Get user's current location and place marker
- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Convert coordinates to addresses
- **Polygons**: Draw shapes around marker positions
- **Lines**: Connect multiple markers with lines

---

## Resources

- [MapLibre React Native Documentation](https://github.com/maplibre/maplibre-react-native)
- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js-docs/)
- [React Native SVG Documentation](https://github.com/react-native-svg/react-native-svg)
- [GeoJSON Specification](https://geojson.org/)

---

## Support

If you encounter issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the MapLibre React Native GitHub issues
3. Consult the example code in this repository
4. Test on both iOS and Android devices

---

**Happy Mapping! 🗺️**
