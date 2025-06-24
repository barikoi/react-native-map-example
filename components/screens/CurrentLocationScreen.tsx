import type { Location } from '@maplibre/maplibre-react-native';
import { Camera, MapView, MarkerView, UserLocation } from '@maplibre/maplibre-react-native';
import * as ExpoLocation from 'expo-location';
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

export default function CurrentLocationScreen() {
    const [styleJson, setStyleJson] = useState(null);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [permissionLoading, setPermissionLoading] = useState(true);
    const [hasFlownToLocation, setHasFlownToLocation] = useState(false);
    const cameraRef = useRef<any>(null);

    useEffect(() => {
        // Fetch map style
        fetch("https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=NDE2NzpVNzkyTE5UMUoy")
            .then((response) => response.json())
            .then((data) => {
                if (data.sprite) {
                    delete data.sprite;
                }
                setStyleJson(data);
            })
            .catch((error) => console.error("Error fetching style JSON:", error));

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
            setPermissionLoading(true);

            // Check if location services are enabled
            const serviceEnabled = await ExpoLocation.hasServicesEnabledAsync();
            if (!serviceEnabled) {
                Alert.alert(
                    'Location Services Disabled',
                    'Please enable location services in your device settings to view your current location.',
                    [{ text: 'OK' }]
                );
                setPermissionLoading(false);
                return;
            }

            // Request permission
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                setHasLocationPermission(true);
                console.log('Location permission granted');
            } else {
                Alert.alert(
                    'Location Permission Required',
                    'This app needs location permission to show your current position on the map.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Settings',
                            onPress: () => {
                                // You can use Linking.openSettings() here if needed
                                console.log('Open settings requested');
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
            Alert.alert('Error', 'Failed to request location permission');
        } finally {
            setPermissionLoading(false);
        }
    };

    const handleLocationUpdate = (location: Location) => {
        console.log("User location updated:", location);
        setUserLocation(location);
    };

    const handleLocationPress = () => {
        if (userLocation && userLocation.coords) {
            Alert.alert(
                "Current Location",
                `Latitude: ${userLocation.coords.latitude.toFixed(6)}\nLongitude: ${userLocation.coords.longitude.toFixed(6)}`,
                [{ text: "OK" }]
            );
        }
    };

    const handleMarkerPress = () => {
        Alert.alert(
            "Your Location Marker",
            userLocation ?
                `You are here!\nLat: ${userLocation.coords.latitude.toFixed(6)}\nLng: ${userLocation.coords.longitude.toFixed(6)}` :
                "Location not available",
            [{ text: "OK" }]
        );
    };

    if (permissionLoading) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Requesting Location Permission...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {styleJson ? (
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
            ) : (
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>Loading Map...</Text>
                </View>
            )}

            {!hasLocationPermission && !permissionLoading && (
                <View style={styles.permissionBanner}>
                    <Text style={styles.permissionText}>
                        Location permission required to show your position
                    </Text>
                    <Text
                        style={styles.retryText}
                        onPress={requestLocationPermission}
                    >
                        Tap to retry
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    map: {
        width: "100%",
        height: "100%",
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 16,
        color: '#2e8555',
        fontWeight: '500',
    },
    permissionBanner: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 193, 7, 0.95)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    permissionText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    retryText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerIcon: {
        width: 40,
        height: 40,
    },
    markerPin: {
        width: 8,
        height: 8,
        backgroundColor: '#2e8555',
        borderRadius: 4,
        position: 'absolute',
        bottom: -4,
    }
}); 