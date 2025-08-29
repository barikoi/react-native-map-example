# Developer Guide: Setting Up React Native Project with MapLibre and Expo App Router

This guide provides comprehensive instructions to set up a production-grade React Native project using Expo with the new App Router system and integrate MapLibre for mapping functionality. It leverages the official React Native and MapLibre documentation to ensure a robust setup.

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.18 or newer.
- **Java Development Kit (JDK)**: Version 17 (recommended by React Native).
- **Android Studio**: For Android development and emulator setup.
- **Watchman**: Optional but recommended for better performance.
- A code editor (e.g., VS Code).
- A physical Android device or an emulator.

---

## Step 1: Set Up Your Development Environment

Follow the official [React Native Environment Setup Guide](https://reactnative.dev/docs/set-up-your-environment) to configure your environment for Android development. Below is a summarized setup process:

### 1. Install Node.js

- Install Node.js 18.18 or newer from the [Node.js website](https://nodejs.org/).
- Verify the installation:
  ```bash
  node --version
  ```

### 2. Install Java Development Kit (JDK)

- Download and install JDK 17 from [AdoptOpenJDK](https://adoptopenjdk.net/) or your system’s package manager.
- Verify the installation:
  ```bash
  java -version
  ```

### 3. Install Android Studio

- Download and install [Android Studio](https://developer.android.com/studio).
- During installation, ensure the following components are selected:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device
- Follow the installation wizard to complete the setup.

### 4. Configure Android SDK

- Open Android Studio and go to **Configure > SDK Manager**.
- In the **SDK Platforms** tab:
  - Check **Show Package Details**.
  - Select **Android 15 (VanillaIceCream)** and ensure the following are checked:
    - `Android SDK Platform 35`
    - `Intel x86 Atom_64 System Image` or `Google APIs Intel x86 Atom System Image`
- In the **SDK Tools** tab:
  - Check **Show Package Details**.
  - Select `Android SDK Build-Tools 35.0.0`.
- Click **Apply** to install the selected components.

### 5. Set Up Environment Variables

- Add the following to your shell configuration file (e.g., `~/.bash_profile`, `~/.zshrc`, or equivalent):
  ```bash
  export ANDROID_HOME=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```
- Apply the changes:
  ```bash
  source ~/.bash_profile  # or ~/.zshrc for zsh
  ```
- Verify the configuration:
  ```bash
  echo $ANDROID_HOME
  echo $PATH
  ```

### 6. Install Watchman (Optional)

- Install Watchman by following the [Watchman installation guide](https://facebook.github.io/watchman/docs/install).
- Watchman improves performance by monitoring file changes.

### 7. Prepare an Android Device

- **Physical Device**: Connect an Android device via USB and enable Developer Options and USB Debugging.
- **Virtual Device**: In Android Studio, open the **AVD Manager**, create a new virtual device, select a phone, and choose the **VanillaIceCream API Level 35** image. Launch the emulator.

---

## Step 2: Create a New Expo Project with App Router

The latest Expo setup uses the App Router (file-based routing) for better navigation and project structure. Follow these steps to create a new project:

1. Run the following command to create a new Expo project with TypeScript and App Router:
   ```bash
   npx create-expo-app@latest
   ```
2. Navigate to the project directory:
   ```bash
   cd your-app-directory
   ```

---

## Step 3: Verify the Project

To ensure the project is set up correctly, run it on an Android emulator or device:

1. Start the development server:
   ```bash
   npx expo start
   ```
2. Open a new terminal and run the app on Android:
   ```bash
   npx expo run:android
   ```
3. Verify that the default Expo app (with a basic App Router structure) loads successfully on the emulator or device.

---

## Step 4: Integrate MapLibre React Native

Follow the [MapLibre React Native Expo Setup Guide](https://maplibre.org/maplibre-react-native/docs/setup/expo) to integrate MapLibre into your project.

### 1. Install MapLibre Package

- Install the MapLibre React Native package:
  ```bash
  npx expo install @maplibre/maplibre-react-native
  ```

### 2. Configure the Expo Plugin

- Open your `app.json` or `app.config.js` file and add the MapLibre plugin to the `plugins` array:
  ```json
  {
    "expo": {
      "plugins": ["@maplibre/maplibre-react-native"]
    }
  }
  ```

### 3. Update Package.json Scripts

- Ensure your `package.json` includes the following scripts for running the app with native code:
  ```json
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios"
  }
  ```

### 4. Rebuild the App

- Since MapLibre requires custom native code, rebuild the app:
  ```bash
  npx expo prebuild
  ```
- This command generates the `android` and `ios` directories with the necessary native code.

### 5. Run the App

- Start the Android emulator or connect a physical device.
- Run the app:
  ```bash
  npx expo run:android
  ```
- Verify that the app builds and runs without errors.

---

## 🎯 Core Features

#### Make sure to install the required dependencies for svgs (Optional)

```cmd
npx expo install react-native-svg
```

#### Custom Logo 
Create a file `BarikoiLogo.tsx`

```typescript
import React from "react";
import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

interface BarikoiLogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const BarikoiLogo: React.FC<BarikoiLogoProps> = ({
  width = 148.5,
  height = 42.1,
  style,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 1485 421" style={style}>
      <Path
        d="M1187.86 56.3035C1135.13 109.036 1131.95 112.363 1136.84 108.841C1163.06 90.2031 1193.43 78.6586 1223.81 75.8704C1232.03 75.0877 1250.03 75.1855 1258.45 76.066C1290.05 79.3435 1323.95 91.2793 1351.73 108.938C1354.62 110.748 1346.11 102.09 1299.63 55.5697C1269.11 24.9965 1244.11 -0.000152588 1244.11 -0.000152588C1244.11 -0.000152588 1218.77 25.3389 1187.86 56.3035Z"
        fill="#00A66B"
      />
      <Path
        d="M873.129 216.205V398.666H907.371H941.613V359.386V320.154L954.038 307.729L966.414 295.353L999.433 346.912L1032.4 398.421L1071.63 398.568C1093.21 398.617 1110.87 398.568 1110.87 398.47C1110.87 398.373 1088.27 364.766 1060.68 323.774C1033.09 282.781 1010.44 249.126 1010.34 248.98C1010.19 248.735 1089.44 156.868 1102.45 142.193C1103.14 141.411 1101.18 141.362 1062.14 141.362H1021.1L988.084 180.104C969.936 201.432 952.081 222.662 948.461 227.358L941.858 235.87L941.711 134.807L941.613 33.744H907.371H873.129V216.205Z"
        fill="#00A66B"
      />
      <Path
        d="M775.233 39.675C760.02 41.3382 748.084 51.1217 744.317 64.9163C742.85 70.4439 742.85 79.4936 744.366 84.8745C746.127 91.087 748.475 95.0982 753.22 99.7942C761.194 107.768 770.684 110.996 784.234 110.409C796.708 109.871 806.051 105.566 812.703 97.3484C818.182 90.5489 820.53 82.9178 820.09 73.1833C819.65 62.9107 817.155 57.0896 810.209 50.1433C806.589 46.4745 805.072 45.3494 801.648 43.6863C796.708 41.2893 793.137 40.311 787.218 39.6261C782.277 39.088 780.516 39.088 775.233 39.675Z"
        fill="black"
      />
      <Path
        d="M1436.96 40.3627C1428.94 41.8791 1422.48 45.4011 1417.05 51.2223C1411.08 57.6304 1408.25 65.2126 1408.25 74.8493C1408.25 86.1002 1412.26 94.9053 1420.57 102.047C1427.81 108.26 1439.99 111.439 1451.54 110.119C1461.57 108.993 1468.76 105.814 1474.72 99.797C1476.78 97.7914 1479.18 94.8564 1480.06 93.34C1485.83 83.5565 1486.46 69.5662 1481.62 59.4404C1477.32 50.4396 1469.05 43.738 1458.78 41.0475C1453.69 39.6778 1442.39 39.3354 1436.96 40.3627Z"
        fill="#00A66B"
      />
      <Path
        d="M0.165095 73.9569C0.0183439 74.2993 -0.0305732 152.273 0.0183439 247.27L0.165095 419.948L67.9154 420.095C135.763 420.241 148.237 420.046 160.516 418.48C191.48 414.665 215.156 404.686 231.641 388.543C247.931 372.547 256.344 351.415 257.518 323.337C258.839 292.03 247.099 266.837 224.206 251.918C218.972 248.542 213.248 245.852 206.547 243.651L200.97 241.841L207.476 238.612C215.792 234.454 221.466 230.394 227.63 224.279C237.902 214.007 244.702 201.337 247.882 186.76C252.382 165.872 248.762 139.946 238.832 122.189C224.059 95.8229 194.758 80.0716 151.075 75.082C138.552 73.6634 123.779 73.3699 62.1431 73.3699C13.1771 73.3699 0.311847 73.5167 0.165095 73.9569ZM133.22 132.07C158.852 134.419 171.766 143.028 176.609 160.932C177.588 164.6 177.734 166.215 177.734 175.118C177.734 186.613 177.098 189.793 173.528 196.69C167.902 207.452 157.287 214.153 140.704 217.235C135.519 218.263 133.269 218.311 103.527 218.507L71.8287 218.752V175.167V131.581H99.8583C115.218 131.581 130.285 131.826 133.22 132.07ZM152.542 270.848C170.397 275.251 180.18 284.692 184.436 301.666C185.414 305.433 185.561 307.243 185.561 316.488C185.561 326.027 185.463 327.348 184.436 330.87C179.398 348.333 164.429 359.584 143.101 361.932C140.215 362.275 125.54 362.47 105.092 362.47H71.8287V315.999V269.479L110.131 269.674C146.965 269.821 148.531 269.87 152.542 270.848Z"
        fill="black"
      />
      <Path
        d="M1226.4 122.049C1205.85 124.641 1185.6 131.734 1168.77 142.203C1136.44 162.357 1113.45 194.642 1105.23 231.428C1102.64 243.217 1102.25 247.179 1102.25 262.686C1102.3 275.208 1102.44 277.997 1103.37 283.671C1108.46 314.636 1121.72 340.709 1143.29 362.281C1154.54 373.532 1165.74 381.603 1179.83 388.598C1193.62 395.496 1207.17 399.8 1222.39 402.197C1231.88 403.665 1253.11 403.812 1262.21 402.442C1273.95 400.681 1283.73 398.088 1294.25 394.028C1338.37 376.907 1370.65 339.192 1381.02 292.77C1383.52 281.763 1384.01 276.627 1383.96 262.197C1383.96 250.75 1383.81 247.717 1382.88 241.7C1380.49 226.487 1376.18 212.937 1369.28 199.142C1362.29 185.054 1354.22 173.852 1342.97 162.601C1321.2 140.882 1294.74 127.528 1263.43 122.538C1256.29 121.364 1233.98 121.119 1226.4 122.049ZM1250.95 188.332C1260.4 189.457 1267 191.316 1275.51 195.425C1312.59 213.182 1328.05 258.087 1309.9 295.216C1302.61 310.184 1290.87 321.875 1275.9 329.213C1250.66 341.589 1220.72 338.752 1198.22 321.827C1174.4 303.923 1163.54 273.105 1170.93 243.999C1179.98 208.241 1214.51 184.174 1250.95 188.332Z"
        fill="#00A66B"
      />
      <Path
        d="M400.028 136.862C350.083 139.797 312.124 165.038 302.438 201.677C301.215 206.373 300.237 212.977 300.237 216.597V218.701H334.723H369.21V216.597C369.259 206.569 375.569 196.981 385.206 192.139C391.908 188.812 395.528 188.127 406.387 188.127C416.855 188.127 419.79 188.714 426.345 191.894C432.9 195.074 437.841 200.699 440.972 208.428C443.222 214.053 443.662 217.233 443.907 229.805L444.151 241.594L418.567 241.838C391.272 242.034 387.309 242.328 372.879 244.92C333.598 251.915 307.526 271.042 298.574 299.414C293.242 316.095 293.144 334.879 298.28 350.337C301.607 360.365 306.352 368.289 313.738 376.116C330.321 393.775 351.453 402.727 378.26 403.461C395.136 403.95 408.197 401.504 420.818 395.585C429.378 391.525 435.297 387.367 442.439 380.47C446.597 376.409 446.939 376.165 447.184 377.241C447.331 377.877 447.771 380.176 448.26 382.328C449.19 386.78 451.538 394.166 452.907 396.906L453.837 398.716H488.568H523.299V396.612C523.299 395.291 522.614 392.943 521.342 390.057C519.484 385.753 517.136 377.632 516.01 371.811C513.809 360.462 513.858 361.343 513.516 287.674C513.222 219.19 513.173 217.331 512.146 211.118C509.015 192.041 502.509 178.197 491.014 166.164C476.583 151.097 457.506 141.95 432.949 138.281C423.508 136.862 410.007 136.275 400.028 136.862ZM444.053 304.11V326.416L441.559 330.036C434.514 340.162 421.894 347.548 407.17 350.092C401.642 351.07 390.049 350.777 385.597 349.603C377.33 347.353 369.65 341.336 366.324 334.487C362.704 327.003 362.606 315.654 366.128 306.751C370.922 294.718 381.097 287.233 397.191 283.956C405.115 282.293 410.643 281.95 428.547 281.853L444.053 281.804V304.11Z"
        fill="black"
      />
      <Path
        d="M682.63 137.008C668.298 138.671 656.215 144.492 645.991 154.716C642.176 158.581 637.578 164.353 634.887 168.658C634.007 170.076 633.224 171.152 633.126 171.054C633.028 170.957 632.588 165.184 632.197 158.189C631.757 151.243 631.316 144.59 631.17 143.416L630.925 141.362H598.395H565.914V270.014V398.666H600.401H634.887V314.529V230.342L635.915 228.288C642.323 215.667 654.894 207.693 672.798 204.905C678.277 204.025 695.202 204.171 703.567 205.15C707.334 205.59 710.464 205.883 710.562 205.786C710.856 205.492 711.785 140.873 711.54 140.139C711.198 139.307 704.056 137.644 697.893 137.008C692.561 136.421 687.62 136.421 682.63 137.008Z"
        fill="black"
      />
      <Path
        d="M747.348 270.014V398.666H781.834H816.321V270.014V141.362H781.834H747.348V270.014Z"
        fill="black"
      />
      <Path
        d="M1412.19 270.014V398.666H1446.43H1480.68V270.014V141.362H1446.43H1412.19V270.014Z"
        fill="#00A66B"
      />
    </Svg>
  );
};

export default BarikoiLogo;
```

### 1. Simple Map Display

```typescript
// screens/SimpleMapScreen.tsx
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";

const BARIKOI_COLORS = {
  primary: "#2e8555",
  primaryLight: "rgba(46, 133, 85, 0.5)",
  secondary: "#e74c3c",
  background: "#f5f5f5",
  text: "#333",
  white: "#ffffff",
  warning: "#ffc107",
};

const fetchBarikoiMapStyle = async (apiKey: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Remove sprite property for React Native compatibility
    if (data.sprite) {
      delete data.sprite;
    }

    return data;
  } catch (error) {
    console.error("Error fetching Barikoi map style:", error);
    throw error;
  }
};

export default function HomeScreen() {
  const [styleJson, setStyleJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarikoiMapStyle("Barikoi-Api-Key")
      .then((data) => {
        const newStyle = { ...data, backgroundColor: "blue" };
        setStyleJson(newStyle);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />
        <Text style={styles.loadingText}>Loading Barikoi Map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>Map Loading Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        attributionEnabled={false}
        mapStyle={styleJson || undefined}
      >
        <Camera centerCoordinate={[90.4125, 23.8103]} zoomLevel={10} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BARIKOI_COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: BARIKOI_COLORS.primary,
    fontWeight: "500",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BARIKOI_COLORS.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: BARIKOI_COLORS.secondary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: BARIKOI_COLORS.text,
    textAlign: "center",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    position: "absolute",
    left: 16,
    bottom: Platform.select({ ios: 32, android: 24 }),
    opacity: 0.9,
  },
});
```

### 2. Custom Markers

```typescript
// screens/MarkerScreen.tsx
import BarikoiLogo from "@/components/BarikoiLogo";
import { Camera, MapView, MarkerView } from "@maplibre/maplibre-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Define marker data
const markers = [
  {
    id: "1",
    coordinate: [90.389709, 23.874577],
    title: "Uttara",
    description: "Modern Township",
  },
  {
    id: "2",
    coordinate: [90.415482, 23.793059],
    title: "Gulshan",
    description: "Business District",
  },
  {
    id: "3",
    coordinate: [90.367456, 23.747431],
    title: "Dhanmondi",
    description: "Cultural Hub",
  },
  {
    id: "4",
    coordinate: [90.399452, 23.869585],
    title: "Airport",
    description: "Hazrat Shahjalal International",
  },
  {
    id: "5",
    coordinate: [90.364159, 23.823724],
    title: "Barikoi Head Office",
    description: "Main office location",
  },
];

const BARIKOI_COLORS = {
  primary: "#2e8555",
  primaryLight: "rgba(46, 133, 85, 0.5)",
  secondary: "#e74c3c",
  background: "#f5f5f5",
  text: "#333",
  white: "#ffffff",
  warning: "#ffc107",
};

const fetchBarikoiMapStyle = async (apiKey: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Remove sprite property for React Native compatibility
    if (data.sprite) {
      delete data.sprite;
    }

    return data;
  } catch (error) {
    console.error("Error fetching Barikoi map style:", error);
    throw error;
  }
};

export default function HomeScreen() {
  const [styleJson, setStyleJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchBarikoiMapStyle("YOUR-BARIKOI-API-KEY")
      .then((data) => {
        const newStyle = { ...data, backgroundColor: "blue" };
        setStyleJson(newStyle);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showBottomSheet = useCallback(() => {
    Animated.spring(bottomSheetAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [bottomSheetAnim]);

  const hideBottomSheet = useCallback(() => {
    Animated.spring(bottomSheetAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setSelectedMarker(null);
  }, [bottomSheetAnim]);

  const handleMarkerPress = useCallback(
    (markerId: string) => {
      console.log("markerId", markerId);
      setSelectedMarker(markerId);
      showBottomSheet();
    },
    [showBottomSheet]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />
        <Text style={styles.loadingText}>Loading Map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Loading Map</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const selectedMarkerData = markers.find((m) => m.id === selectedMarker);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        attributionEnabled={false}
        zoomEnabled
        compassEnabled
        compassViewPosition={10}
        mapStyle={styleJson || undefined}
      >
        <Camera
          centerCoordinate={[90.389709, 23.824577]}
          zoomLevel={11.5}
          animationDuration={1000}
          animationMode="linearTo"
        />
        {markers.map((marker) => (
          <MarkerView
            key={marker.id}
            coordinate={marker.coordinate}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <Pressable onPress={() => handleMarkerPress(marker.id)}>
              <View style={styles.markerContainer}>
                <Image
                  source={require("../../assets/icons/barikoi_icon.png")}
                  style={[
                    styles.markerIcon,
                    selectedMarker === marker.id && styles.selectedMarker,
                  ]}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
          </MarkerView>
        ))}
      </MapView>

      {/* Bottom Sheet */}
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
        {selectedMarkerData && (
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.bottomSheetTitle}>
                  {selectedMarkerData.title}
                </Text>
                <Text style={styles.bottomSheetDescription}>
                  {selectedMarkerData.description}
                </Text>
              </View>
              <Pressable onPress={hideBottomSheet} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>
            <View style={styles.coordinateContainer}>
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Latitude</Text>
                <Text style={styles.coordinateValue}>
                  {selectedMarkerData.coordinate[1].toFixed(6)}°
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Longitude</Text>
                <Text style={styles.coordinateValue}>
                  {selectedMarkerData.coordinate[0].toFixed(6)}°
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Barikoi Logo Attribution */}
        <Pressable
          style={styles.logoContainer}
          onPress={() => Linking.openURL("https://barikoi.com")}
        >
          <BarikoiLogo width={80} height={23} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BARIKOI_COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: BARIKOI_COLORS.primary,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BARIKOI_COLORS.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: BARIKOI_COLORS.secondary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: BARIKOI_COLORS.text,
    textAlign: "center",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  selectedMarker: {
    width: 45,
    height: 45,
    tintColor: BARIKOI_COLORS.primary,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 20,
  },
  bottomSheetContent: {
    padding: 16,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectButton: {
    backgroundColor: BARIKOI_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  selectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: BARIKOI_COLORS.text,
    marginBottom: 4,
  },
  bottomSheetDescription: {
    fontSize: 14,
    color: BARIKOI_COLORS.text,
    opacity: 0.7,
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: BARIKOI_COLORS.background,
  },
  closeButtonText: {
    fontSize: 20,
    color: BARIKOI_COLORS.text,
    lineHeight: 20,
  },
  coordinateContainer: {
    backgroundColor: BARIKOI_COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  coordinateItem: {
    marginBottom: 8,
  },
  coordinateLabel: {
    fontSize: 12,
    color: BARIKOI_COLORS.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: 16,
    color: BARIKOI_COLORS.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 8,
  },
  logoContainer: {
    position: "absolute",
    left: 16,
    bottom: Platform.select({ ios: 32, android: 24 }),
    opacity: 0.9,
  },
});
```

### 3. Drawing Lines & Polygons
  ```typescript
// screens/LineScreen.tsx
import BarikoiLogo from "@/components/BarikoiLogo";
import {
  Camera,
  FillLayer,
  LineLayer,
  MapView,
  MarkerView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BARIKOI_COLORS = {
  primary: "#2e8555",
  primaryLight: "rgba(46, 133, 85, 0.5)",
  secondary: "#e74c3c",
  background: "#f5f5f5",
  text: "#333",
  white: "#ffffff",
  warning: "#ffc107",
};
const MAP_STYLES = {
  line: {
    lineColor: "#2e8555",
    lineWidth: 3,
    lineCap: "round" as const,
    lineJoin: "round" as const,
  },
  polygon: {
    fillColor: "rgba(46, 133, 85, 0.5)",
    fillOutlineColor: "#2e8555",
  },
  marker: {
    anchorDefault: { x: 0.5, y: 1.0 },
    iconSize: { width: 40, height: 40 },
  },
};

const fetchBarikoiMapStyle = async (apiKey: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Remove sprite property for React Native compatibility
    if (data.sprite) {
      delete data.sprite;
    }

    return data;
  } catch (error) {
    console.error("Error fetching Barikoi map style:", error);
    throw error;
  }
};

export default function GeometryScreen() {
  const [styleJson, setStyleJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarikoiMapStyle("YOUR-BARIKOI-API-KEY")
      .then((data) => {
        const newStyle = { ...data, backgroundColor: "blue" };
        setStyleJson(newStyle);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Center point
  const centerPoint: [number, number] = [90.366659, 23.823724];

  // Circle polygon (approximated with points)
  const createCirclePoints = (
    center: [number, number],
    radiusInKm: number,
    points = 64
  ) => {
    const coords = [];
    const km = radiusInKm;

    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const dx = (Math.cos(angle) * km) / 111.32;
      const dy =
        (Math.sin(angle) * km) /
        (111.32 * Math.cos(center[1] * (Math.PI / 180)));
      coords.push([center[0] + dx, center[1] + dy]);
    }

    // Close the circle
    coords.push(coords[0]);

    return coords;
  };

  const circlePoints = createCirclePoints(centerPoint, 0.3);

  // Create GeoJSON for the circle
  const circleGeoJSON: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [circlePoints],
        },
      },
    ],
  };

  // Create GeoJSON for the line
  const lineGeoJSON: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [90.364159, 23.823724],
            [90.369159, 23.825724],
          ],
        },
      },
    ],
  };

  // Marker points
  const markerPoints = [
    { coordinate: [90.364159, 23.823724] },
    { coordinate: [90.369159, 23.825724] },
    { coordinate: centerPoint },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />
        <Text style={styles.loadingText}>Loading Map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Loading Map</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        attributionEnabled={false}
        zoomEnabled={true}
        compassEnabled
        compassViewPosition={10}
        mapStyle={styleJson || undefined}
      >
        <Camera
          centerCoordinate={centerPoint}
          zoomLevel={15}
          animationDuration={1000}
          animationMode="linearTo"
        />

        <ShapeSource id="circleSource" shape={circleGeoJSON}>
          <FillLayer id="circleFill" style={MAP_STYLES.polygon} />
        </ShapeSource>

        <ShapeSource id="lineSource" shape={lineGeoJSON}>
          <LineLayer id="lineLayer" style={MAP_STYLES.line} />
        </ShapeSource>

        {markerPoints.map((point, index) => (
          <MarkerView
            key={`marker-${index + 1}`}
            coordinate={point.coordinate}
            anchor={{ x: 0.5, y: 1.0 }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require("../../assets/icons/barikoi_icon.png")}
                style={styles.markerIcon}
                resizeMode="contain"
              />
            </View>
          </MarkerView>
        ))}
      </MapView>

      {/* Barikoi Logo Attribution */}
      <Pressable
        style={styles.logoContainer}
        onPress={() => Linking.openURL("https://barikoi.com")}
      >
        <BarikoiLogo width={80} height={23} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BARIKOI_COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: BARIKOI_COLORS.primary,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BARIKOI_COLORS.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: BARIKOI_COLORS.secondary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: BARIKOI_COLORS.text,
    textAlign: "center",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    position: "absolute",
    left: 16,
    bottom: Platform.select({ ios: 32, android: 24 }),
    opacity: 0.9,
  },
});
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
