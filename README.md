# 🗺️ React Native Map App with Barikoi Maps

A comprehensive React Native application demonstrating various map features using **Barikoi Maps**, Bangladesh's leading mapping service, integrated with **@maplibre/maplibre-react-native**. This project serves as a complete example for the React Native community.

## 📦 Version Info

- **Project Version**: 1.0.0
- **React Native**: 0.72.6
- **Expo**: ~49.0.15
- **@maplibre/maplibre-react-native**: ^9.1.0
- **expo-location**: ~16.1.0

## 📚 Documentation

This project includes comprehensive documentation to help you get started and build advanced features.

- **[README.md](./README.md)**: You are here! Project overview and quick start guide.
- **[DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md)**: A deep dive into the project structure, components, and advanced concepts.

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
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- A Barikoi API Key ([Get one here](https://barikoi.com))

### Development Environment Setup ([Check Official Docs](https://docs.expo.dev/get-started/set-up-your-environment/))

#### For iOS (macOS only)

1. Install Xcode from the Mac App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```

#### For Android

1. Install Android Studio
2. Install Android SDK (minimum SDK 21)
3. Set up Android environment variables (ANDROID_HOME)
4. Create an Android Virtual Device (AVD)

### Installation

```bash
# Clone the repository
git clone https://github.com/iazadur/expo-map-app.git
cd expo-map-app

# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Start the development server
npm start

# Run on Android or iOS
npm run android
npm run ios
```

### 🔑 API Key Setup

1. Get your API key from [Barikoi Dashboard](https://barikoi.com/dashboard)
2. Add your Barikoi API key to `utils/mapUtils.ts`:

```typescript
const BARIKOI_API_KEY = "YOUR_API_KEY_HERE";
```

## 🖼️ Screenshots

### Core Features

![Simple Map](./assets/screenshorts/simple-map.jpg)
![Current Location](./assets/screenshorts/current-location.jpg)
![Custom Markers](./assets/screenshorts/markar.jpg)

### Advanced Features

![Line Drawing](./assets/screenshorts/line.jpg)
![Polygon Shapes](./assets/screenshorts/polygon.jpg)
![Complex Geometry](./assets/screenshorts/geometry.jpg)
![Advanced Map](./assets/screenshorts/advanced-map.jpg)

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
    `https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=${BARIKOI_API_KEY}`
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

## ❗ Troubleshooting

### Common Issues

1. **Map not displaying**

   - Check if your API key is correctly set in `utils/mapUtils.ts`
   - Ensure you have an active internet connection
   - Verify that the Barikoi servers are accessible

2. **Location permission issues**

   - For Android: Check if location permissions are granted in app settings
   - For iOS: Verify location permissions in Settings > Privacy > Location Services

3. **Build errors**

   - Clean the build:

     ```bash
     # For Android
     cd android && ./gradlew clean && cd ..

     # For iOS
     cd ios && pod deintegrate && pod install && cd ..
     ```

   - Clear Metro bundler cache:
     ```bash
     npm start -- --reset-cache
     ```

4. **Marker/Shape rendering issues**
   - Ensure coordinates are in the correct format [longitude, latitude]
   - Check if the coordinates are within Bangladesh bounds
   - Verify GeoJSON structure for complex shapes

### Still Having Issues?

- Check our [Issues](https://github.com/iazadur/expo-map-app/issues) page
- Contact Barikoi Support: support@barikoi.com

---

**Built with ❤️ for the React Native community.**

## 📱 Publishing Your App

### Building for Production

When you're ready to publish your app, you can create optimized production builds:

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### App Store & Google Play Submission

#### iOS App Store

1. Create an Apple Developer account ($99/year)
2. Generate an App Store Connect record for your app
3. Configure app icons, splash screens, and metadata
4. Submit the build through TestFlight for testing
5. Once approved, submit for App Store Review

#### Google Play Store

1. Create a Google Play Developer account ($25 one-time fee)
2. Set up a new application in the Google Play Console
3. Configure store listing, content rating, and pricing
4. Upload your signed APK or App Bundle
5. Submit for review and publication

### EAS Build Configuration

This project includes a basic `eas.json` configuration:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

For more details on publishing, refer to the [Expo documentation](https://docs.expo.dev/distribution/introduction/).
