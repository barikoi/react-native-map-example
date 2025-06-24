import { Camera, MapView, MarkerView } from '@maplibre/maplibre-react-native';
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BARIKOI_COLORS, useBarikoiMapStyle } from '../../utils/mapUtils';
import BarikoiLogo from '../BarikoiLogo';

// Define marker data
const markers = [
    {
        id: '1',
        coordinate: [90.389709, 23.874577],
        title: 'Uttara',
        description: 'Modern Township'
    },
    {
        id: '2',
        coordinate: [90.415482, 23.793059],
        title: 'Gulshan',
        description: 'Business District'
    },
    {
        id: '3',
        coordinate: [90.367456, 23.747431],
        title: 'Dhanmondi',
        description: 'Cultural Hub'
    },
    {
        id: '4',
        coordinate: [90.399452, 23.869585],
        title: 'Airport',
        description: 'Hazrat Shahjalal International'
    },
    {
        id: '5',
        coordinate: [90.364159, 23.823724],
        title: 'Barikoi Head Office',
        description: 'Main office location'
    },
];

export default function MarkerScreen() {
    const { styleJson, loading, error } = useBarikoiMapStyle();
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
    const bottomSheetAnim = useRef(new Animated.Value(0)).current;

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

    const handleMarkerPress = useCallback((markerId: string) => {
        console.log('markerId', markerId);
        setSelectedMarker(markerId);
        showBottomSheet();
    }, [showBottomSheet]);

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

    const selectedMarkerData = markers.find(m => m.id === selectedMarker);

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
                                    source={require('../../assets/icons/barikoi_icon.png')}
                                    style={[
                                        styles.markerIcon,
                                        selectedMarker === marker.id && styles.selectedMarker
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
                        transform: [{
                            translateY: bottomSheetAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0]
                            })
                        }]
                    }
                ]}
            >
                {selectedMarkerData && (
                    <View style={styles.bottomSheetContent}>
                        <View style={styles.bottomSheetHeader}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.bottomSheetTitle}>{selectedMarkerData.title}</Text>
                                <Text style={styles.bottomSheetDescription}>{selectedMarkerData.description}</Text>
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
                onPress={() => Linking.openURL('https://barikoi.com')}
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
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
        marginRight: 16,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectButton: {
        backgroundColor: BARIKOI_COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    selectButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginVertical: 8,
    },
    logoContainer: {
        position: 'absolute',
        left: 16,
        bottom: Platform.select({ ios: 32, android: 24 }),
        opacity: 0.9,
    }
}); 