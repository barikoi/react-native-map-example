
import { Camera, FillLayer, MapView, MarkerView, ShapeSource } from '@maplibre/maplibre-react-native';
import React from "react";
import { ActivityIndicator, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BARIKOI_COLORS, useBarikoiMapStyle } from '../../utils/mapUtils';
import BarikoiLogo from '../BarikoiLogo';

export default function PolygonScreen() {
    const { styleJson, loading, error } = useBarikoiMapStyle();


    // Polygon data - example triangle area
    const polygonGeoJSON = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [90.364159, 23.823724], // Point 1
                        [90.369159, 23.825724], // Point 2
                        [90.367159, 23.820724], // Point 3
                        [90.364159, 23.823724]  // Close the polygon (same as first point)
                    ]]
                }
            }
        ]
    };

    // Coordinates for markers at polygon vertices
    const markerCoordinates = [
        [90.364159, 23.823724], // Point 1
        [90.369159, 23.825724], // Point 2
        [90.367159, 23.820724]  // Point 3
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
                zoomEnabled
                compassEnabled
                compassViewPosition={10}
                mapStyle={styleJson}
            >
                <Camera
                    centerCoordinate={[90.366659, 23.823724]} // Center of the polygon
                    zoomLevel={15}
                    animationDuration={1000}
                    animationMode="linearTo"
                />

                {/* Polygon shape */}
                {/* @ts-ignore */}
                <ShapeSource id="polygonSource" shape={polygonGeoJSON}>
                    <FillLayer
                        id="polygonFill"
                        style={{
                            fillColor: 'rgba(46, 133, 85, 0.5)', // Semi-transparent green
                            fillOutlineColor: '#2e8555'
                        }}
                    />
                </ShapeSource>

                {/* Markers at polygon vertices */}
                {markerCoordinates.map((coordinate, index) => (
                    <MarkerView
                        key={`marker-${index + 1}`}
                        coordinate={coordinate}
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
                ))}
            </MapView>

            {/* Barikoi Logo Attribution */}
            <Pressable
                style={styles.logoContainer}
                onPress={() => Linking.openURL('https://barikoi.com')}
            >
                <BarikoiLogo width={80} height={23} />
            </Pressable>
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
    logoContainer: {
        position: 'absolute',
        left: 16,
        bottom: Platform.select({ ios: 32, android: 24 }),
        opacity: 0.9,
    },
    zoomControls: {
        position: 'absolute',
        right: 16,
        top: Platform.select({ ios: 60, android: 40 }),
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 8,
        gap: 8,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    zoomLevelContainer: {
        backgroundColor: BARIKOI_COLORS.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    zoomText: {
        fontSize: 14,
        fontWeight: '600',
        color: BARIKOI_COLORS.primary,
        textAlign: 'center',
    },
    controlButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    controlButtonDisabled: {
        opacity: 0.5,
    },
}); 