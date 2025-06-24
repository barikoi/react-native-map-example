import { Camera, MapView, MarkerView } from '@maplibre/maplibre-react-native';
import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BARIKOI_COLORS, useBarikoiMapStyle } from '../../utils/mapUtils';

// Define marker data
const markers = [
    {
        id: '1',
        coordinate: [90.364159, 23.823724],
        title: 'Mirpur DOHS',
        description: 'Residential Area'
    },
    {
        id: '2',
        coordinate: [90.389709, 23.874577],
        title: 'Uttara',
        description: 'Modern Township'
    },
    {
        id: '3',
        coordinate: [90.415482, 23.793059],
        title: 'Gulshan',
        description: 'Business District'
    },
    {
        id: '4',
        coordinate: [90.367456, 23.747431],
        title: 'Dhanmondi',
        description: 'Cultural Hub'
    },
    {
        id: '5',
        coordinate: [90.399452, 23.869585],
        title: 'Airport',
        description: 'Hazrat Shahjalal International'
    }
];

export default function MarkerScreen() {
    const { styleJson, loading, error } = useBarikoiMapStyle();
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

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
                logoEnabled
                zoomEnabled
                mapStyle={styleJson}
            >
                <Camera
                    centerCoordinate={[90.389709, 23.824577]} // Centered between markers
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
                        <Pressable onPress={() => setSelectedMarker(marker.id)}>
                            <View style={styles.markerContainer}>
                                <Image
                                    source={require('../../assets/icons/barikoi_icon.png')}
                                    style={[
                                        styles.markerIcon,
                                        selectedMarker === marker.id && styles.selectedMarker
                                    ]}
                                    resizeMode="contain"
                                />
                                {selectedMarker === marker.id && (
                                    <View style={styles.markerInfo}>
                                        <Text style={styles.markerTitle}>{marker.title}</Text>
                                        <Text style={styles.markerDescription}>{marker.description}</Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    </MarkerView>
                ))}
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
    selectedMarker: {
        width: 45,
        height: 45,
        tintColor: BARIKOI_COLORS.primary,
    },
    markerInfo: {
        position: 'absolute',
        bottom: 45,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 120,
    },
    markerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: BARIKOI_COLORS.text,
        marginBottom: 2,
    },
    markerDescription: {
        fontSize: 12,
        color: BARIKOI_COLORS.text,
        opacity: 0.7,
    },
}); 