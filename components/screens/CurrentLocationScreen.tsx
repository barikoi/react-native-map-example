import type { Location } from '@maplibre/maplibre-react-native';
import { Camera, MapView, MarkerView, UserLocation } from '@maplibre/maplibre-react-native';
import * as ExpoLocation from 'expo-location';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
import { BARIKOI_COLORS, useBarikoiMapStyle } from '../../utils/mapUtils';

// Helper function to convert Expo location to MapLibre location
const convertLocation = (expoLocation: ExpoLocation.LocationObject): Location => ({
    coords: {
        latitude: expoLocation.coords.latitude,
        longitude: expoLocation.coords.longitude,
        altitude: expoLocation.coords.altitude ?? undefined,
        accuracy: expoLocation.coords.accuracy ?? undefined,
        heading: expoLocation.coords.heading ?? undefined,
        speed: expoLocation.coords.speed ?? undefined
    },
    timestamp: expoLocation.timestamp
});

export default function CurrentLocationScreen() {
    const { styleJson, loading: mapLoading, error: mapError } = useBarikoiMapStyle();
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [permissionLoading, setPermissionLoading] = useState(true);
    const [hasFlownToLocation, setHasFlownToLocation] = useState(false);
    const cameraRef = useRef<any>(null);

    useEffect(() => {
        // Request location permission
        requestLocationPermission();
    }, []);

    // Fly to user location when first location is received
    useEffect(() => {
        if (userLocation && !hasFlownToLocation && cameraRef.current) {
            const { latitude, longitude } = userLocation.coords;

            // Smooth animated fly to user location with zoom level 16
            cameraRef.current.setCamera({
                centerCoordinate: [longitude, latitude],
                zoomLevel: 16,
                animationDuration: 2000, // 2 seconds smooth animation
                animationMode: 'flyTo'
            });

            setHasFlownToLocation(true);
            console.log(`Flying to user location: ${latitude}, ${longitude}`);
        }
    }, [userLocation, hasFlownToLocation]);

    const requestLocationPermission = async () => {
        try {
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setHasLocationPermission(true);
                const location = await ExpoLocation.getCurrentPositionAsync({});
                setUserLocation(convertLocation(location));
            } else {
                Alert.alert(
                    'Permission Denied',
                    'Location permission is required for this feature.',
                    [{ text: 'OK' }]
                );
            }
        } catch (err) {
            console.error('Error requesting location permission:', err);
            Alert.alert(
                'Error',
                'Failed to request location permission.',
                [{ text: 'OK' }]
            );
        } finally {
            setPermissionLoading(false);
        }
    };

    const handleLocationUpdate = (location: Location) => {
        setUserLocation(location);
    };

    const handleLocationPress = () => {
        if (userLocation) {
            const { latitude, longitude } = userLocation.coords;
            Alert.alert(
                'Current Location',
                `Latitude: ${latitude}\nLongitude: ${longitude}`,
                [{ text: 'OK' }]
            );
        }
    };

    // Show loading state while map style or permissions are loading
    if (mapLoading || permissionLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />
                <Text style={styles.loadingText}>
                    {permissionLoading ? 'Requesting Location Permission...' : 'Loading Map...'}
                </Text>
            </View>
        );
    }

    // Show error state if map style failed to load
    if (mapError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Error Loading Map</Text>
                <Text style={styles.errorText}>{mapError}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                attributionEnabled={false}
                logoEnabled
                zoomEnabled
                mapStyle={styleJson}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={[90.364159, 23.823724]} // Default center (Dhaka)
                    zoomLevel={10}
                    animationDuration={1000}
                    animationMode="flyTo"
                />

                {hasLocationPermission && (
                    <UserLocation
                        visible={true}
                        animated={true}
                        renderMode="normal"
                        showsUserHeadingIndicator={true}
                        minDisplacement={10}
                        onUpdate={handleLocationUpdate}
                        onPress={handleLocationPress}
                    />
                )}

                {/* Custom marker at user location */}
                {userLocation && (
                    <MarkerView
                        coordinate={[
                            userLocation.coords.longitude,
                            userLocation.coords.latitude
                        ]}
                        anchor={{ x: 0.5, y: 1.0 }}
                    >
                        <View style={styles.markerContainer}>
                            <Image
                                source={require('../../assets/icons/barikoi_icon.png')}
                                style={styles.markerIcon}
                                resizeMode="contain"
                            />
                        </View>
                    </MarkerView>
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BARIKOI_COLORS.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: BARIKOI_COLORS.primary,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BARIKOI_COLORS.background,
        padding: 20,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: BARIKOI_COLORS.secondary,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: BARIKOI_COLORS.text,
        textAlign: 'center',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerIcon: {
        width: 40,
        height: 40,
    },
}); 