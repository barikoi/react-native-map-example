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
