# 🗺️ React Native (Expo) Barikoi Maps - Developer Guide

Welcome to the React Native (Expo) Barikoi Maps Developer Guide! This guide will help you integrate Barikoi Maps into your React Native (Expo) application with ease.

## 📱 Quick Start

### Prerequisites

- Node.js >= 14
- React Native >= 0.63
- Expo SDK >= 48

### Installation

```bash
# Create a new Expo project
npx create-expo-app your-map-app
cd your-map-app

# Install required dependencies
npx expo install @maplibre/maplibre-react-native expo-location
```

### Basic Setup

1. Get your Barikoi API key from [Barikoi Dashboard](https://barikoi.com/dashboard)

2. Create a utils file for map configuration:

```typescript
// utils/mapUtils.ts
const BARIKOI_API_KEY = "YOUR_API_KEY";

export const BARIKOI_COLORS = {
  primary: "#00A66B",
  secondary: "#151718",
  background: "#FFFFFF",
  text: "#11181C",
  primaryLight: "#E6F4EF",
};

export const useBarikoiMapStyle = () => {
  const [styleJson, setStyleJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStyle();
  }, []);

  const fetchStyle = async () => {
    try {
      const response = await fetch(
        `https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=${BARIKOI_API_KEY}`
      );
      const json = await response.json();
      setStyleJson(json);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { styleJson, loading, error };
};
```

## 🎯 Core Features

### 1. Simple Map Display

```typescript
// screens/SimpleMapScreen.tsx
import { MapView, Camera } from "@maplibre/maplibre-react-native";
import { useBarikoiMapStyle } from "../utils/mapUtils";

export default function SimpleMapScreen() {
  const { styleJson, loading, error } = useBarikoiMapStyle();

  if (loading) {
    return <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />;
  }

  if (error) {
    return <Text>Error loading map: {error}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        mapStyle={styleJson}
        logoEnabled={true}
        attributionEnabled={false}
      >
        <Camera
          centerCoordinate={[90.389709, 23.824577]}
          zoomLevel={11.5}
          animationDuration={1000}
        />
      </MapView>
    </View>
  );
}
```

### 2. Custom Markers

```typescript
// screens/MarkerScreen.tsx
import { MarkerView } from "@maplibre/maplibre-react-native";

export default function MarkerScreen() {
  const markers = [
    {
      id: "1",
      coordinate: [90.364159, 23.823724],
      title: "Mirpur DOHS",
      description: "Residential Area",
    },
    // Add more markers...
  ];

  return (
    <MapView style={{ flex: 1 }} mapStyle={styleJson}>
      {markers.map((marker) => (
        <MarkerView
          key={marker.id}
          coordinate={marker.coordinate}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <Pressable onPress={() => handleMarkerPress(marker.id)}>
            <Image
              source={require("../assets/icons/barikoi_icon.png")}
              style={styles.markerIcon}
            />
          </Pressable>
        </MarkerView>
      ))}
    </MapView>
  );
}
```

### 3. Current Location

```typescript
// screens/CurrentLocationScreen.tsx
import * as Location from "expo-location";

export default function CurrentLocationScreen() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <MapView style={{ flex: 1 }} mapStyle={styleJson}>
      {location && (
        <MarkerView
          coordinate={[location.coords.longitude, location.coords.latitude]}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.currentLocationMarker} />
        </MarkerView>
      )}
    </MapView>
  );
}
```

### 4. Drawing Lines & Polygons

```typescript
// screens/LineScreen.tsx
import { ShapeSource, LineLayer } from "@maplibre/maplibre-react-native";

export default function LineScreen() {
  const lineGeoJSON = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [90.367456, 23.747431], // Dhanmondi
        [90.415482, 23.793059], // Gulshan
      ],
    },
  };

  return (
    <MapView style={{ flex: 1 }} mapStyle={styleJson}>
      <ShapeSource id="line" shape={lineGeoJSON}>
        <LineLayer
          id="linelayer"
          style={{
            lineColor: BARIKOI_COLORS.primary,
            lineWidth: 3,
          }}
        />
      </ShapeSource>
    </MapView>
  );
}
```

### 5. Marker Clustering with GeoJSON

For displaying many markers efficiently, you can use GeoJSON with ShapeSource and SymbolLayer:

```typescript
// screens/MarkerScreen.tsx (GeoJSON approach)
import { ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import type { Feature, FeatureCollection } from "geojson";

// Convert markers to GeoJSON format
const pointsCollection = useMemo<FeatureCollection>(
  () => ({
    type: "FeatureCollection",
    features: markers.map(
      (marker): Feature => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: marker.coordinate,
        },
        properties: {
          id: marker.id,
          title: marker.title,
          description: marker.description,
        },
      })
    ),
  }),
  []
);

// In your render function
<ShapeSource
  id="markersSource"
  shape={pointsCollection}
  onPress={handleMapPress}
  cluster
  clusterRadius={50}
  clusterMaxZoomLevel={14}
>
  {/* Clustered Points */}
  <SymbolLayer
    id="clusterCount"
    style={{
      textField: ["get", "point_count"],
      textSize: 14,
      textColor: "#FFFFFF",
      textAnchor: "center",
      iconImage: require("../../assets/icons/barikoi_icon.png"),
      iconSize: 0.7,
      iconAllowOverlap: true,
      textAllowOverlap: true,
    }}
    filter={["has", "point_count"]}
  />

  {/* Individual Points */}
  <SymbolLayer
    id="singlePoint"
    style={{
      iconImage: require("../../assets/icons/barikoi_icon.png"),
      iconSize: 0.5,
      iconAllowOverlap: true,
      textField: ["get", "title"],
      textSize: 12,
      textColor: "#00A66B",
      textAnchor: "top",
      textOffset: [0, 1],
      textAllowOverlap: false,
      textOptional: true,
    }}
    filter={["!", ["has", "point_count"]]}
  />
</ShapeSource>;
```

This approach offers several benefits:

- Efficiently renders hundreds of markers
- Automatic clustering of nearby points
- Native rendering performance
- Customizable appearance for both clusters and individual points

## 🔍 Advanced Features

### 1. Bottom Sheet Details

```typescript
// components/MapBottomSheet.tsx
import { Animated } from "react-native";

export function MapBottomSheet({ isVisible, details }) {
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bottomSheetAnim, {
      toValue: isVisible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          transform: [
            {
              translateY: bottomSheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Bottom sheet content */}
    </Animated.View>
  );
}
```

### 2. Custom Map Controls

```typescript
// components/MapControls.tsx
export function MapControls({ onZoomIn, onZoomOut, onLocate }) {
  return (
    <View style={styles.controls}>
      <Pressable onPress={onZoomIn} style={styles.controlButton}>
        <Text>+</Text>
      </Pressable>
      <Pressable onPress={onZoomOut} style={styles.controlButton}>
        <Text>-</Text>
      </Pressable>
      <Pressable onPress={onLocate} style={styles.controlButton}>
        <Text>📍</Text>
      </Pressable>
    </View>
  );
}
```

## 🎨 Styling Guide

### Map Styles

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

### Theme Colors

We use a consistent color palette throughout the app:

```typescript
export const BARIKOI_COLORS = {
  primary: "#00A66B",
  secondary: "#151718",
  background: "#FFFFFF",
  text: "#11181C",
  primaryLight: "#E6F4EF",
};
```

## 📱 Example App Structure

```
your-map-app/
├── app/
│   ├── _layout.tsx           # Navigation setup
│   ├── index.tsx            # Home screen
│   ├── marker.tsx           # Marker screen
│   └── current-location.tsx # Location screen
├── components/
│   └── screens/
│       ├── SimpleMapScreen.tsx
│       ├── MarkerScreen.tsx
│       └── CurrentLocationScreen.tsx
├── utils/
│   └── mapUtils.ts          # Map utilities
└── assets/
    └── icons/
        └── barikoi_icon.png
```

## 🔧 Troubleshooting

### Common Issues

1. **Blank Map**

   - Check if your API key is valid
   - Verify internet connection
   - Ensure mapStyle is properly loaded

2. **Location Not Working**

   - Check location permissions
   - Verify device location is enabled
   - Test on physical device

3. **Markers Not Showing**
   - Verify coordinate format [longitude, latitude]
   - Check if coordinates are within bounds
   - Ensure marker components are properly rendered

## 📚 Resources

- [Barikoi Documentation](https://docs.barikoi.com)
- [MapLibre React Native](https://github.com/maplibre/maplibre-react-native)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
