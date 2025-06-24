import { Ionicons } from '@expo/vector-icons';
import {
    Camera,
    FillLayer,
    LineLayer,
    MapView,
    MarkerView,
    ShapeSource,
    UserLocation
} from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    BARIKOI_COLORS,
    createCirclePolygon,
    DEFAULT_CAMERA_SETTINGS,
    MAP_STYLES,
    useBarikoiMapStyle
} from '../../utils/mapUtils';
import BarikoiLogo from '../BarikoiLogo';

/**
 * Interface for map features
 */
interface MapFeature {
    id: string;
    type: 'marker' | 'line' | 'polygon' | 'circle';
    coordinates: [number, number] | [number, number][];
    properties?: {
        title?: string;
        description?: string;
        color?: string;
        heading?: number;
        zoomLevel?: number;
    };
}

/**
 * Interface for location state
 */
interface LocationState {
    coords: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
    timestamp: number;
}

interface LocationDetail {
    coordinates: [number, number];
    title?: string;
}

const DEFAULT_ZOOM_LEVEL = 15;
const MIN_ZOOM_LEVEL = 0;
const MAX_ZOOM_LEVEL = 20;

/**
 * Enhanced Map Screen with advanced features
 * 
 * Features:
 * - Real-time location tracking
 * - Custom map controls
 * - Gesture handling
 * - Performance optimizations
 * - Event handling
 */
export default function ImprovedMapScreen() {
    // State management
    const { styleJson, loading, error } = useBarikoiMapStyle();
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [followsUserLocation, setFollowsUserLocation] = useState(false);
    const [mapRotation, setMapRotation] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
    const [selectedLocationDetail, setSelectedLocationDetail] = useState<LocationDetail | null>(null);
    const cameraRef = useRef(null);
    const bottomSheetAnim = useRef(new Animated.Value(0)).current;

    // Reset to default location on unmount
    useEffect(() => {
        return () => {
            setSelectedLocation(null);
            setZoomLevel(DEFAULT_ZOOM_LEVEL);
        };
    }, []);

    // Location setup
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required for this feature.');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    // Sample map features - Memoized to prevent unnecessary re-renders
    const mapFeatures: MapFeature[] = useMemo(() => [
        {
            id: 'dhaka-marker',
            type: 'marker',
            coordinates: [90.364159, 23.823724],
            properties: {
                title: 'Dhaka City',
                description: 'Capital of Bangladesh',
            },
        },
        {
            id: 'connection-line',
            type: 'line',
            coordinates: [
                [90.364159, 23.823724],
                [90.374159, 23.828724],
            ],
            properties: {
                title: 'Connection Route',
                color: BARIKOI_COLORS.primary,
            },
        },
        {
            id: 'area-polygon',
            type: 'polygon',
            coordinates: [
                [90.354159, 23.825724],
                [90.358159, 23.825724],
                [90.358159, 23.821724],
                [90.354159, 23.821724],
                [90.354159, 23.825724],
            ],
            properties: {
                title: 'Important Area',
                description: 'Protected zone',
            },
        },
        {
            id: 'circle-area',
            type: 'circle',
            coordinates: [90.377159, 23.823724],
            properties: {
                title: 'Circle Zone',
                description: '500m radius area',
            },
        },
    ], []);

    // Animation functions
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
    }, [bottomSheetAnim]);

    // Update handleMarkerPress
    const handleMarkerPress = useCallback((feature: MapFeature) => {
        const coordinates = feature.coordinates as [number, number];
        setSelectedLocationDetail({
            coordinates,
            title: feature.properties?.title
        });
        showBottomSheet();
    }, [showBottomSheet]);

    // Update handleMapPress
    const handleMapPress = useCallback((e: any) => {
        const coordinates = e.geometry.coordinates as [number, number];
        setSelectedLocation(coordinates);
        setSelectedLocationDetail({
            coordinates,
            title: 'Selected Location'
        });
        showBottomSheet();

        // Move camera to clicked location
        if (cameraRef.current) {
            // @ts-ignore
            cameraRef.current.setCamera({
                centerCoordinate: coordinates,
                zoomLevel: zoomLevel,
                animationDuration: 500,
                animationMode: 'easeTo'
            });
        }
    }, [zoomLevel, showBottomSheet]);

    const handleMapLongPress = useCallback((event: any) => {
        const { coordinates } = event.geometry;
        setSelectedLocation(coordinates);
        setSelectedLocationDetail({
            coordinates,
            title: 'Long Pressed Location'
        });
        showBottomSheet();

        // Move camera to long pressed location
        if (cameraRef.current) {
            // @ts-ignore
            cameraRef.current.setCamera({
                centerCoordinate: coordinates,
                zoomLevel: zoomLevel,
                animationDuration: 500,
                animationMode: 'easeTo'
            });
        }
    }, [zoomLevel, showBottomSheet]);

    const toggleFollowsUserLocation = useCallback(() => {
        setFollowsUserLocation(prev => !prev);
    }, []);

    const handleZoomIn = useCallback(() => {
        setZoomLevel(prev => {
            const newZoom = Math.min(prev + 1, MAX_ZOOM_LEVEL);
            if (cameraRef.current) {
                // @ts-ignore
                cameraRef.current.setCamera({
                    zoomLevel: newZoom,
                    animationDuration: 300,
                });
            }
            return newZoom;
        });
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomLevel(prev => {
            const newZoom = Math.max(prev - 1, MIN_ZOOM_LEVEL);
            if (cameraRef.current) {
                // @ts-ignore
                cameraRef.current.setCamera({
                    zoomLevel: newZoom,
                    animationDuration: 300,
                });
            }
            return newZoom;
        });
    }, []);

    // Memoized GeoJSON creators with proper typing
    const lineGeoJSON = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: mapFeatures
            .filter(f => f.type === 'line')
            .map(feature => ({
                type: 'Feature' as const,
                properties: {
                    id: feature.id,
                    ...feature.properties,
                },
                geometry: {
                    type: 'LineString' as const,
                    coordinates: feature.coordinates as [number, number][],
                },
            })),
    }), [mapFeatures]);

    const polygonGeoJSON = useMemo(() => ({
        type: 'FeatureCollection' as const,
        features: mapFeatures
            .filter(f => f.type === 'polygon' || f.type === 'circle')
            .map(feature => {
                let coordinates;

                if (feature.type === 'circle') {
                    const center = feature.coordinates as [number, number];
                    coordinates = [createCirclePolygon(center, 0.5)];
                } else {
                    coordinates = [feature.coordinates as [number, number][]];
                }

                return {
                    type: 'Feature' as const,
                    properties: {
                        id: feature.id,
                        featureType: feature.type,
                        ...feature.properties,
                    },
                    geometry: {
                        type: 'Polygon' as const,
                        coordinates,
                    },
                };
            }),
    }), [mapFeatures]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />
                <Text style={styles.loadingText}>Loading Barikoi Map...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Map Loading Error</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorHint}>
                    Please check your internet connection and API key
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                attributionEnabled={false}
                logoEnabled={false}
                zoomEnabled={true}
                scrollEnabled={true}
                rotateEnabled={true}
                pitchEnabled={true}
                mapStyle={styleJson}
                onPress={handleMapPress}
                onLongPress={handleMapLongPress}
                onRegionDidChange={(feature: any) => {
                    setMapRotation(feature.properties?.heading || 0);
                    setZoomLevel(feature.properties?.zoomLevel || DEFAULT_ZOOM_LEVEL);
                }}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={
                        selectedLocation ||
                        (location
                            ? [location.coords.longitude, location.coords.latitude]
                            : DEFAULT_CAMERA_SETTINGS.centerCoordinate)
                    }
                    zoomLevel={zoomLevel}
                    animationDuration={300}
                    animationMode="easeTo"
                />

                <UserLocation
                    visible={true}
                    animated={true}
                    renderMode="native"
                />

                <ShapeSource id="lineSource" shape={lineGeoJSON}>
                    <LineLayer id="lineLayer" style={MAP_STYLES.line} />
                </ShapeSource>

                <ShapeSource id="polygonSource" shape={polygonGeoJSON}>
                    <FillLayer id="polygonLayer" style={MAP_STYLES.polygon} />
                </ShapeSource>

                {mapFeatures
                    .filter((f) => f.type === 'marker')
                    .map((feature) => (
                        <MarkerView
                            key={feature.id}
                            coordinate={feature.coordinates as [number, number]}
                            anchor={MAP_STYLES.marker.anchorDefault}
                        >
                            <Pressable onPress={() => handleMarkerPress(feature)}>
                                <View style={styles.markerContainer}>
                                    <Image
                                        source={require('../../assets/icons/barikoi_icon.png')}
                                        style={[styles.markerIcon, MAP_STYLES.marker.iconSize]}
                                        resizeMode="contain"
                                    />
                                </View>
                            </Pressable>
                        </MarkerView>
                    ))}

                {/* Selected Location Marker */}
                {selectedLocation && (
                    <MarkerView
                        coordinate={selectedLocation}
                    // anchor={{ x: 0.5, y: 1.0 }}
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

            {/* Barikoi Logo Attribution */}
            <Pressable
                style={styles.logoContainer}
                onPress={() => Linking.openURL('https://barikoi.com')}
            >
                <BarikoiLogo width={80} height={23} />
            </Pressable>

            {/* Zoom Controls */}
            <View style={styles.zoomControls}>
                <Pressable
                    style={[
                        styles.controlButton,
                        zoomLevel >= MAX_ZOOM_LEVEL && styles.controlButtonDisabled
                    ]}
                    onPress={handleZoomIn}
                >
                    <Ionicons
                        name="add-outline"
                        size={24}
                        color={zoomLevel >= MAX_ZOOM_LEVEL ? '#999999' : BARIKOI_COLORS.primary}
                    />
                </Pressable>
                <View style={styles.zoomLevelContainer}>
                    <Text style={styles.zoomText}>{Math.round(zoomLevel)}x</Text>
                </View>
                <Pressable
                    style={[
                        styles.controlButton,
                        zoomLevel <= MIN_ZOOM_LEVEL && styles.controlButtonDisabled
                    ]}
                    onPress={handleZoomOut}
                >
                    <Ionicons
                        name="remove-outline"
                        size={24}
                        color={zoomLevel <= MIN_ZOOM_LEVEL ? '#999999' : BARIKOI_COLORS.primary}
                    />
                </Pressable>
            </View>

            {/* Location Controls */}
            <View style={styles.controls}>
                <Pressable
                    style={styles.controlButton}
                    onPress={toggleFollowsUserLocation}
                >
                    <Ionicons
                        name={followsUserLocation ? 'location' : 'location-outline'}
                        size={24}
                        color={BARIKOI_COLORS.primary}
                    />
                </Pressable>

                {mapRotation !== 0 && (
                    <Pressable style={styles.controlButton} onPress={() => setMapRotation(0)}>
                        <Ionicons
                            name="compass-outline"
                            size={24}
                            color={BARIKOI_COLORS.primary}
                        />
                    </Pressable>
                )}
            </View>

            {/* Bottom Location Card */}
            <Animated.View
                style={[
                    styles.bottomCard,
                    {
                        transform: [{
                            translateY: bottomSheetAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0]
                            })
                        }],
                        opacity: bottomSheetAnim
                    }
                ]}
            >
                {selectedLocationDetail && (
                    <View style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="location" size={24} color={BARIKOI_COLORS.primary} />
                            <Text style={styles.locationTitle}>
                                {selectedLocationDetail.title || 'Location Details'}
                            </Text>
                            <Pressable onPress={hideBottomSheet} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#666" />
                            </Pressable>
                        </View>
                        <View style={styles.coordinatesContainer}>
                            <View style={styles.coordinateItem}>
                                <Text style={styles.coordinateLabel}>Latitude</Text>
                                <Text style={styles.coordinateValue}>
                                    {selectedLocationDetail.coordinates[1].toFixed(6)}°
                                </Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.coordinateItem}>
                                <Text style={styles.coordinateLabel}>Longitude</Text>
                                <Text style={styles.coordinateValue}>
                                    {selectedLocationDetail.coordinates[0].toFixed(6)}°
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
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
    errorHint: {
        marginTop: 8,
        fontSize: 14,
        color: BARIKOI_COLORS.text,
        opacity: 0.7,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerIcon: {
        width: 40,
        height: 40,
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
    controls: {
        position: 'absolute',
        right: 16,
        bottom: Platform.select({ ios: 32, android: 24 }),
        gap: 8,
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
    logoContainer: {
        position: 'absolute',
        left: 16,
        bottom: Platform.select({ ios: 32, android: 24 }),
        opacity: 0.9,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: Platform.select({ ios: 30, android: 20 }),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.18,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    cardContent: {
        minHeight: 100,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginLeft: 8,
    },
    closeButton: {
        padding: 4,
    },
    coordinatesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    coordinateItem: {
        flex: 1,
        alignItems: 'center',
    },
    coordinateLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    coordinateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: BARIKOI_COLORS.primary,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#eee',
        marginHorizontal: 20,
    },
}); 