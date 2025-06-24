import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer
          screenOptions={{
            drawerActiveTintColor: '#2e8555',
            drawerInactiveTintColor: '#666',
            drawerStyle: {
              backgroundColor: 'white',
              width: 280,
            },
            headerStyle: {
              backgroundColor: '#2e8555',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'Simple Map',
              drawerIcon: () => <Text style={{ fontSize: 20 }}>🗺️</Text>,
              title: 'Simple Map',
            }}
          />
          <Drawer.Screen
            name="current-location"
            options={{
              drawerLabel: 'Current Location',
              drawerIcon: () => <Text style={{ fontSize: 20 }}>📍</Text>,
              title: 'Current Location',
            }}
          />
          <Drawer.Screen
            name="marker"
            options={{
              drawerLabel: 'Marker',
              drawerIcon: () => <Text style={{ fontSize: 20 }}>📌</Text>,
              title: 'Marker',
            }}
          />
          <Drawer.Screen
            name="line"
            options={{
              drawerLabel: 'Line',
              drawerIcon: () => <Text style={{ fontSize: 20 }}>📏</Text>,
              title: 'Line',
            }}
          />
          <Drawer.Screen
            name="polygon"
            options={{
              drawerLabel: 'Polygon',
              drawerIcon: () => <Text style={{ fontSize: 20 }}>⬡</Text>,
              title: 'Polygon',
            }}
          />
          <Drawer.Screen
            name="geometry"
            options={{
              drawerLabel: 'Geometry',
              drawerIcon: () => <Text style={{ fontSize: 20 }}>🔷</Text>,
              title: 'Geometry',
            }}
          />
          <Drawer.Screen
            name="advanced-map"
            options={{
              drawerLabel: 'Advanced Map',
              drawerIcon: () => <Text style={{ fontSize: 20 }}>🗺️</Text>,
              title: 'Advanced Map',
            }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{
              drawerItemStyle: { display: 'none' },
              title: 'Not Found',
            }}
          />
        </Drawer>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
