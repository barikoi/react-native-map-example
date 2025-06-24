# 📚 Barikoi Maps React Native API Reference

## Core Components

### MapView

The root component for displaying maps.

```typescript
import { MapView } from "@maplibre/maplibre-react-native";

<MapView
  style={{ flex: 1 }}
  mapStyle={styleJson}
  logoEnabled={true}
  attributionEnabled={false}
  onPress={(e) => console.log(e.coordinates)}
  onMapIdle={() => console.log("Map has stopped moving")}
/>;
```

#### Props

- `mapStyle`: Object (required) - Map style JSON from Barikoi
- `logoEnabled`: boolean - Show/hide the Barikoi logo
- `attributionEnabled`: boolean - Show/hide attribution
- `onPress`: (event: { coordinates: [number, number] }) => void
- `onMapIdle`: () => void

### MarkerView

Renders a custom marker on the map.

```typescript
<MarkerView coordinate={[90.364159, 23.823724]} anchor={{ x: 0.5, y: 1.0 }}>
  <Pressable onPress={handlePress}>
    <Image source={require("./marker-icon.png")} />
  </Pressable>
</MarkerView>
```

#### Props

- `coordinate`: [number, number] - [longitude, latitude]
- `anchor`: { x: number, y: number } - Anchor point
- `children`: ReactNode - Custom marker content

### Camera

Controls the map's viewport.

```typescript
<Camera
  centerCoordinate={[90.389709, 23.824577]}
  zoomLevel={11.5}
  animationDuration={1000}
  animationMode="flyTo"
/>
```

#### Props

- `centerCoordinate`: [number, number] - Center point
- `zoomLevel`: number - Zoom level (0-22)
- `animationDuration`: number - Animation time in ms
- `animationMode`: "flyTo" | "linearTo" | "moveTo"

## Hooks

### useBarikoiMapStyle

Fetches and manages the Barikoi map style.

```typescript
const { styleJson, loading, error } = useBarikoiMapStyle();
```

#### Returns

- `styleJson`: Object | null - Map style configuration
- `loading`: boolean - Loading state
- `error`: string | null - Error message if any

## Utilities

### BARIKOI_COLORS

Standard color palette for consistent styling.

```typescript
export const BARIKOI_COLORS = {
  primary: "#00A66B",
  secondary: "#151718",
  background: "#FFFFFF",
  text: "#11181C",
  primaryLight: "#E6F4EF",
};
```

### MAP_STYLES

Predefined styles for map elements.

```typescript
export const MAP_STYLES = {
  line: {
    lineColor: BARIKOI_COLORS.primary,
    lineWidth: 3,
  },
  polygon: {
    fillColor: BARIKOI_COLORS.primary,
    fillOpacity: 0.5,
  },
  marker: {
    width: 40,
    height: 40,
  },
};
```

## GeoJSON Types

### LineString

```typescript
const lineGeoJSON = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [90.367456, 23.747431],
      [90.415482, 23.793059],
    ],
  },
};
```

### Polygon

```typescript
const polygonGeoJSON = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [90.367456, 23.747431],
        [90.415482, 23.793059],
        [90.399452, 23.869585],
        [90.367456, 23.747431], // Close the polygon
      ],
    ],
  },
};
```

## Event Types

### MapPressEvent

```typescript
interface MapPressEvent {
  coordinates: [number, number]; // [longitude, latitude]
  point: [number, number]; // Screen coordinates [x, y]
}
```

### MarkerPressEvent

```typescript
interface MarkerPressEvent {
  id: string;
  coordinate: [number, number];
}
```

## Constants

### Default Camera Settings

```typescript
export const DEFAULT_CAMERA = {
  centerCoordinate: [90.389709, 23.824577], // Dhaka
  zoomLevel: 11.5,
  animationDuration: 1000,
};
```

### Bangladesh Bounds

```typescript
export const BD_BOUNDS = {
  ne: [92.6744, 26.6342], // Northeast corner
  sw: [88.0075, 20.7386], // Southwest corner
};
```

## Error Handling

### Error Types

```typescript
type MapError = {
  code: string;
  message: string;
  details?: any;
};

// Common error codes
const MAP_ERROR_CODES = {
  STYLE_LOAD_ERROR: "style_load_error",
  LOCATION_PERMISSION_DENIED: "location_permission_denied",
  NETWORK_ERROR: "network_error",
};
```

## Type Definitions

### Coordinate Type

```typescript
type Coordinate = [number, number]; // [longitude, latitude]
```

### Marker Type

```typescript
interface Marker {
  id: string;
  coordinate: Coordinate;
  title?: string;
  description?: string;
}
```

### Camera Type

```typescript
interface Camera {
  centerCoordinate: Coordinate;
  zoomLevel: number;
  bearing?: number;
  pitch?: number;
  animationDuration?: number;
  animationMode?: "flyTo" | "linearTo" | "moveTo";
}
```

## Best Practices

### Memory Management

- Use `useCallback` for event handlers
- Memoize markers with `useMemo`
- Clean up listeners in `useEffect`

```typescript
const handleMarkerPress = useCallback((id: string) => {
  // Handle press
}, []);

const markers = useMemo(
  () =>
    data.map((item) => (
      <MarkerView key={item.id} coordinate={item.coordinate}>
        <CustomMarker onPress={() => handleMarkerPress(item.id)} />
      </MarkerView>
    )),
  [data, handleMarkerPress]
);
```

### Performance Tips

1. Use `MarkerView` instead of `Marker` for better performance
2. Implement marker clustering for large datasets
3. Debounce map events
4. Use appropriate zoom levels for different data densities

## Examples

### Custom Marker with Animation

```typescript
function AnimatedMarker({ coordinate }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <MarkerView coordinate={coordinate}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.marker} />
      </Animated.View>
    </MarkerView>
  );
}
```

### Map Controls Component

```typescript
function MapControls({ onZoomIn, onZoomOut, onLocate }) {
  return (
    <View style={styles.controls}>
      <Pressable onPress={onZoomIn}>
        <Text>+</Text>
      </Pressable>
      <Pressable onPress={onZoomOut}>
        <Text>-</Text>
      </Pressable>
      <Pressable onPress={onLocate}>
        <Text>📍</Text>
      </Pressable>
    </View>
  );
}
```

### Bottom Sheet Integration

```typescript
function MapWithBottomSheet() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const bottomSheetRef = useRef(null);

  const handleMarkerPress = useCallback((marker) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView>
        {markers.map((marker) => (
          <MarkerView
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef}>
        {selectedMarker && <MarkerDetails marker={selectedMarker} />}
      </BottomSheet>
    </View>
  );
}
```

# 📚 API Reference - React Native Barikoi Maps

> For a high-level overview, see the [**README.md**](../README.md). For implementation details and best practices, refer to the [**DEVELOPER_GUIDE.md**](./DEVELOPER_GUIDE.md).

This document provides a detailed API reference for all utilities, components, and integration patterns in the React Native Barikoi Maps project.

---

## 🛠️ Utility Functions (`utils/mapUtils.ts`)

This file contains all the centralized helper functions, hooks, and constants.

### Map Style Management

#### `fetchBarikoiMapStyle(apiKey?: string): Promise<any>`

Fetches the Barikoi map style JSON with built-in error handling.

- **Parameters**: `apiKey` (optional) - Your Barikoi API key.
- **Returns**: A `Promise` that resolves to the map style JSON object.

#### `useBarikoiMapStyle(apiKey?: string): { styleJson, loading, error }`

A React hook for loading the Barikoi map style with loading and error states.

- **Returns**: An object containing `styleJson`, `loading` (boolean), and `error` (string or null).
- **Example**:

  ```typescript
  const { styleJson, loading, error } = useBarikoiMapStyle();

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} />;
  return <MapView mapStyle={styleJson} />;
  ```

### Coordinate and Geometry Utilities

#### `calculateDistance(coord1: [number, number], coord2: [number, number]): number`

Calculates the distance between two coordinates using the Haversine formula.

- **Parameters**: `coord1`, `coord2` - `[longitude, latitude]` arrays.
- **Returns**: Distance in kilometers.

#### `isWithinBangladeshBounds(coordinates: [number, number]): boolean`

Validates if a given coordinate is within the approximate bounds of Bangladesh.

#### `createCirclePolygon(center: [number, number], radiusInKm: number, points?: number): [number, number][]`

Creates an array of coordinates that form a circle polygon.

- **Parameters**: `center`, `radiusInKm`, `points` (optional, default: 64).
- **Returns**: An array of `[longitude, latitude]` coordinates.

### Constants

#### `DEFAULT_COORDINATES`

An object containing pre-defined coordinates for major cities in Bangladesh (`DHAKA`, `CHITTAGONG`, etc.).

#### `DEFAULT_CAMERA_SETTINGS`

A default camera configuration object (includes `centerCoordinate`, `zoomLevel`, etc.).

#### `MAP_STYLES`

Predefined style objects for map elements like lines, polygons, and markers.

#### `BARIKOI_COLORS`

A brand-consistent color palette for use across the application.

---

## 🗺️ Map Components

### `<MapView />`

The root component for displaying the map.

- **`mapStyle`**: The JSON object for the map theme, loaded via `useBarikoiMapStyle`.
- **`attributionEnabled`**: Set to `false` to hide the default attribution.

### `<Camera />`

Controls the map's viewport and animations.

- **`centerCoordinate`**: The `[longitude, latitude]` to center the map on.
- **`zoomLevel`**: The map's zoom level.
- **`animationMode`**: `"flyTo"` for a smooth, curved animation or `"linearTo"` for a direct transition.

### `<MarkerView />`

Renders a custom React component as a map marker.

### `<ShapeSource />` and Layers

Used to render geometric shapes from GeoJSON data.

- **`<ShapeSource />`**: The data source for your shapes.
  - **`id`**: A unique identifier.
  - **`shape`**: A GeoJSON object.
- **`<LineLayer />`**: Renders `LineString` features.
- **`<FillLayer />`**: Renders `Polygon` features.
- **`<CircleLayer />`**: Renders `Point` features as circles.

### `<UserLocation />`

Displays the user's current location on the map.

- **`onUpdate`**: A callback function that fires with updated location data.

---

## 🔌 Barikoi API Integration

This section provides examples for integrating with other Barikoi APIs.

### Places Search API (Autocomplete)

**Endpoint**: `https://barikoi.xyz/v1/api/search/autocomplete/place`

```typescript
const searchPlaces = async (query, limit = 10) => {
  const url = `https://barikoi.xyz/v1/api/search/autocomplete/place?api_key=${API_KEY}&q=${query}&limit=${limit}`;
  const response = await fetch(url);
  return response.json();
};
```

### Reverse Geocoding API

**Endpoint**: `https://barikoi.xyz/v1/api/search/reverse/geocoding`

```typescript
const reverseGeocode = async (lat, lng) => {
  const url = `https://barikoi.xyz/v1/api/search/reverse/geocoding?api_key=${API_KEY}&longitude=${lng}&latitude=${lat}`;
  const response = await fetch(url);
  return response.json();
};
```

### Directions API

**Endpoint**: `https://barikoi.xyz/v1/api/route/directions`

```typescript
const getDirections = async (origin, destination, mode = "driving") => {
  const url = `https://barikoi.xyz/v1/api/route/directions?api_key=${API_KEY}&origin=${origin}&destination=${destination}&mode=${mode}`;
  const response = await fetch(url);
  return response.json();
};
```

---

## 📋 Type Definitions

The project uses TypeScript for robust type safety.

### `Coordinate`

A tuple representing `[longitude, latitude]`.
`type Coordinate = [number, number];`

### `MapFeature`

An interface for defining map features used in screens like `ImprovedMapScreen.tsx`.

```typescript
interface MapFeature {
  id: string;
  type: "marker" | "line" | "polygon" | "circle";
  coordinates: Coordinate | Coordinate[];
  properties?: { [key: string]: any };
}
```

---

For more details on specific component props, please refer to the official **[@maplibre/maplibre-react-native documentation](https://github.com/maplibre/maplibre-react-native)**.

## 📞 Support and Resources

### Official Documentation

- [Barikoi API Documentation](https://docs.barikoi.com)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

### Community

- [Barikoi Developer Community](https://community.barikoi.com)
- [React Native Maps GitHub](https://github.com/react-native-maps/react-native-maps)

---

**This API reference is part of the React Native Barikoi Maps project. For updates and contributions, visit the project repository.**
