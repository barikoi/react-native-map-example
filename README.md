# 🗺️ React Native Map App with Barikoi Maps

A comprehensive React Native application demonstrating various map features using **Barikoi Maps**, Bangladesh's leading mapping service, integrated with **@maplibre/maplibre-react-native**. This project serves as a complete example for the React Native community.

## 📚 Documentation

This project includes comprehensive documentation to help you get started and build advanced features.

- **[README.md](./README.md)**: You are here! Project overview and quick start guide.
- **[DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md)**: A deep dive into the project structure, components, and advanced concepts.
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)**: Detailed reference for all utility functions, components, and the Barikoi API.

## 📱 Features

### ✨ Core Map Features

- **Simple Map Display**: Basic map rendering with Barikoi's style.
- **Current Location**: Real-time user location tracking with permission handling.
- **Custom Markers**: Interactive, custom-styled markers.
- **Line Drawing**: Draw lines (polylines) between coordinates.
- **Polygon Shapes**: Create and display polygon areas.
- **Complex Geometry**: Combine multiple geometric shapes on a single map.

### 🎨 UI/UX

- **Drawer Navigation**: Easy access to all map examples.
- **Loading & Error States**: Smooth user experience during network requests.
- **Centralized Utilities**: Reusable hooks and functions for clean code.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Android Studio / Xcode for device testing
- A Barikoi API Key ([Get one here](https://barikoi.com))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd expo-map-app

# Install dependencies
npm install

# Start the development server
npm start

# Run on Android or iOS
npm run android
npm run ios
```

### 🔑 API Key Setup

Add your Barikoi API key to `utils/mapUtils.ts`:

```typescript
const BARIKOI_API_KEY = "YOUR_API_KEY_HERE";
```

---

## 🏗️ How It Works

### `SimpleMapScreen.tsx`

A basic map with a single marker in Dhaka.

```typescript
import { Camera, MapView, MarkerView } from "@maplibre/maplibre-react-native";

// Core map setup with Barikoi style
<MapView style={styles.map} attributionEnabled={false} mapStyle={styleJson}>
  <Camera
    centerCoordinate={[90.364159, 23.823724]} // Dhaka
    zoomLevel={16}
  />
</MapView>;
```

### `CurrentLocationScreen.tsx`

Advanced location tracking with permission handling.

```typescript
import * as ExpoLocation from "expo-location";
import { UserLocation } from "@maplibre/maplibre-react-native";

// Request permission from the user
const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

// Display user's location on the map
<UserLocation visible={true} onUpdate={handleLocationUpdate} />;
```

### Drawing Shapes

Draw lines and polygons using GeoJSON data sources.

#### `LineScreen.tsx`

```typescript
import { ShapeSource, LineLayer } from "@maplibre/maplibre-react-native";

const lineGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [90.364159, 23.823724], // Start point
          [90.369159, 23.825724], // End point
        ],
      },
    },
  ],
};

<ShapeSource id="lineSource" shape={lineGeoJSON}>
  <LineLayer id="lineLayer" style={{ lineColor: "#2e8555", lineWidth: 3 }} />
</ShapeSource>;
```

#### `PolygonScreen.tsx`

```typescript
import { FillLayer } from "@maplibre/maplibre-react-native";

<ShapeSource id="polygonSource" shape={polygonGeoJSON}>
  <FillLayer
    id="polygonFill"
    style={{
      fillColor: "rgba(46, 133, 85, 0.5)",
      fillOutlineColor: "#2e8555",
    }}
  />
</ShapeSource>;
```

---

## 🛠️ Technical Implementation

### Key Dependencies

- **`@maplibre/maplibre-react-native`**: The core mapping library.
- **`expo-location`**: For accessing device location services.
- **`expo-router`**: For file-based navigation.

### Map Style Loading

A custom hook, `useBarikoiMapStyle`, fetches and prepares the map style from Barikoi's servers.

```typescript
// utils/mapUtils.ts
useEffect(() => {
  fetch(
    "https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=YOUR_API_KEY"
  )
    .then((response) => response.json())
    .then((data) => {
      // The sprite property is removed for compatibility with the mobile SDK
      if (data.sprite) {
        delete data.sprite;
      }
      setStyleJson(data);
    })
    .catch((error) => console.error("Error fetching style JSON:", error));
}, []);
```

---

## 🔧 Customization Guide

### Adding a New Map Feature

1.  **Create a new screen file**:
    `touch components/screens/YourNewScreen.tsx`

2.  **Implement the component**:

    ```typescript
    import { MapView, Camera } from "@maplibre/maplibre-react-native";
    import { useBarikoiMapStyle } from "../../utils/mapUtils";

    export default function YourNewScreen() {
      const { styleJson, loading, error } = useBarikoiMapStyle();
      // ...
      return (
        <MapView mapStyle={styleJson}>
          {/* Your custom map features go here */}
        </MapView>
      );
    }
    ```

3.  **Add to navigation**:
    Create a new file in the `app/` directory (e.g., `app/your-new-screen.tsx`) and add a `Drawer.Screen` entry in `app/_layout.tsx`.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

- **Barikoi Maps**: [https://barikoi.com](https://barikoi.com)
- **Barikoi API Docs**: [https://docs.barikoi.com](https://docs.barikoi.com)

---

**Built with ❤️ for the React Native community.**
