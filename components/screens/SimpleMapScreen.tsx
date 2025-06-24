import { Camera, MapView, MarkerView } from "@maplibre/maplibre-react-native";
import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import {
    BARIKOI_COLORS,
    DEFAULT_CAMERA_SETTINGS,
    MAP_STYLES,
    useBarikoiMapStyle
} from '../../utils/mapUtils';

export default function SimpleMapScreen() {
    // Use the custom hook for better error handling and loading states
    const { styleJson, loading, error } = useBarikoiMapStyle();

    // Loading state
    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />
                <Text style={styles.loadingText}>Loading Barikoi Map...</Text>
            </View>
        );
    }

    // Error state
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
                logoEnabled
                zoomEnabled
                mapStyle={styleJson}
                
            >
                <Camera
                    centerCoordinate={DEFAULT_CAMERA_SETTINGS.centerCoordinate}
                    zoomLevel={DEFAULT_CAMERA_SETTINGS.zoomLevel}
                    animationDuration={DEFAULT_CAMERA_SETTINGS.animationDuration}
                    animationMode={DEFAULT_CAMERA_SETTINGS.animationMode}
                />
                <MarkerView
                    coordinate={DEFAULT_CAMERA_SETTINGS.centerCoordinate}
                    anchor={MAP_STYLES.marker.anchorDefault}
                >
                    <View style={styles.markerContainer}>
                        <Image
                            source={require('../../assets/icons/barikoi_icon.png')}
                            style={[
                                styles.markerIcon,
                                MAP_STYLES.marker.iconSize
                            ]}
                            resizeMode="contain"
                        />
                    </View>
                </MarkerView>
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
        width: "100%",
        height: "100%",
    },
    loading: {
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
    error: {
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
        backgroundColor: BARIKOI_COLORS.primary,
        borderRadius: 4,
        position: 'absolute',
        bottom: -4,
    }
}); 