import { Camera, LineLayer, MapView, MarkerView, ShapeSource } from '@maplibre/maplibre-react-native';
import type { FeatureCollection } from 'geojson';
import React from "react";
import { ActivityIndicator, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BARIKOI_COLORS, MAP_STYLES, useBarikoiMapStyle } from '../../utils/mapUtils';
import BarikoiLogo from '../BarikoiLogo';

export default function LineScreen() {
    const { styleJson, loading, error } = useBarikoiMapStyle();

    // Line data - example line between two points
    const lineGeoJSON: FeatureCollection = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [90.364159, 23.823724], // Start point
                        [90.369159, 23.825724]  // End point
                    ]
                }
            }
        ]
    };

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
                mapStyle={styleJson}
            >
                <Camera
                    centerCoordinate={[90.366659, 23.824724]}
                    zoomLevel={15}
                    animationDuration={1000}
                    animationMode="linearTo"
                />

                <ShapeSource id="lineSource" shape={lineGeoJSON}>
                    <LineLayer id="lineLayer" style={MAP_STYLES.line} />
                </ShapeSource>

                {/* Start point marker */}
                <MarkerView
                    coordinate={[90.364159, 23.823724]}
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

                {/* End point marker */}
                <MarkerView
                    coordinate={[90.369159, 23.825724]}
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
    }
}); 