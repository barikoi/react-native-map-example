import { Ionicons } from '@expo/vector-icons';
import { Camera, MapView, PointAnnotation } from '@maplibre/maplibre-react-native';
import type { Feature, Geometry, Point } from 'geojson';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BARIKOI_COLORS, DEFAULT_CAMERA_SETTINGS, useBarikoiMapStyle } from '../../utils/mapUtils';
import BarikoiLogo from '../BarikoiLogo';
import FlameIcon from '../CustomMarker';

type DragFeature = Feature<Point>;

const MIN_ZOOM_LEVEL = 0;
const MAX_ZOOM_LEVEL = 22;
const DEFAULT_ZOOM_LEVEL = 16;

const formatCoordinate = (value: number) => `${value.toFixed(6)}°`;

export default function DraggableMarkerScreen() {
    const { styleJson, loading, error } = useBarikoiMapStyle();
    const cameraRef = useRef<any>(null);
    const isManualZoomRef = useRef(false);

    const [markerCoordinate, setMarkerCoordinate] = useState<[number, number]>(
        DEFAULT_CAMERA_SETTINGS.centerCoordinate
    );
    const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);
    const [mapRotation, setMapRotation] = useState(0);

    const toLngLatTuple = useCallback((position: number[], fallback: [number, number]): [number, number] => {
        const [lng = fallback[0], lat = fallback[1]] = position;
        return [lng, lat];
    }, []);

    const extractCoordinate = useCallback((payload: DragFeature): [number, number] => {
        return toLngLatTuple(payload.geometry.coordinates as number[], markerCoordinate);
    }, [toLngLatTuple, markerCoordinate]);

    const extractFromGeometry = useCallback((feature: Feature<Geometry>): [number, number] | null => {
        if (!feature.geometry) return null;

        if (feature.geometry.type === 'Point') {
            return toLngLatTuple(feature.geometry.coordinates as number[], markerCoordinate);
        }

        if (feature.geometry.type === 'MultiPoint' && feature.geometry.coordinates.length > 0) {
            return toLngLatTuple(feature.geometry.coordinates[0] as number[], markerCoordinate);
        }

        return null;
    }, [toLngLatTuple, markerCoordinate]);

    const handleDrag = useCallback((payload: DragFeature) => {
        const coords = extractCoordinate(payload);
        setMarkerCoordinate(coords);
    }, [extractCoordinate]);

    const handleDragEnd = useCallback((payload: DragFeature) => {
        const coords = extractCoordinate(payload);
        setMarkerCoordinate(coords);
    }, [extractCoordinate]);

    const handleMapPress = useCallback((payload: Feature<Geometry>) => {
        const coords = extractFromGeometry(payload);
        if (coords) {
            setMarkerCoordinate(coords);
        }
    }, [extractFromGeometry]);

    const handleZoomIn = useCallback(() => {
        if (zoomLevel >= MAX_ZOOM_LEVEL || !cameraRef.current) return;

        const newZoom = Math.min(zoomLevel + 1, MAX_ZOOM_LEVEL);
        isManualZoomRef.current = true;
        setZoomLevel(newZoom);
        cameraRef.current.setCamera({
            zoomLevel: newZoom,
            animationDuration: 300,
            animationMode: 'easeTo',
        });

        // Reset flag after animation
        setTimeout(() => {
            isManualZoomRef.current = false;
        }, 250);
    }, [zoomLevel]);

    const handleZoomOut = useCallback(() => {
        if (zoomLevel <= MIN_ZOOM_LEVEL || !cameraRef.current) return;

        const newZoom = Math.max(zoomLevel - 1, MIN_ZOOM_LEVEL);
        isManualZoomRef.current = true;
        setZoomLevel(newZoom);
        cameraRef.current.setCamera({
            zoomLevel: newZoom,
            animationDuration: 200,
            animationMode: 'easeTo',
        });

        // Reset flag after animation
        setTimeout(() => {
            isManualZoomRef.current = false;
        }, 250);
    }, [zoomLevel]);

    const handleCompassReset = useCallback(() => {
        if (!cameraRef.current) return;

        cameraRef.current.setCamera({
            heading: 0,
            animationDuration: 500,
            animationMode: 'easeTo',
        });
        setMapRotation(0);
    }, []);

    const handleRegionChange = useCallback((feature: any) => {
        const heading = feature.properties?.heading || 0;
        const zoom = feature.properties?.zoomLevel;

        setMapRotation(heading);

        // Only update zoom from region change if it wasn't manually changed
        if (!isManualZoomRef.current && zoom !== undefined) {
            setZoomLevel(zoom);
        }
    }, []);

    const formattedCoordinates = useMemo(() => ({
        latitude: formatCoordinate(markerCoordinate[1]),
        longitude: formatCoordinate(markerCoordinate[0]),
    }), [markerCoordinate]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BARIKOI_COLORS.primary} />
                <Text style={styles.loadingText}>Loading Drag & Drop Map...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Unable to load map</Text>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                attributionEnabled={false}
                logoEnabled={false}
                rotateEnabled
                pitchEnabled={false}
                zoomEnabled
                scrollEnabled
                compassEnabled
                mapStyle={styleJson}
                onPress={handleMapPress}
                onRegionDidChange={handleRegionChange}
            >
                <Camera
                    ref={cameraRef}
                    centerCoordinate={markerCoordinate}
                    zoomLevel={zoomLevel}
                    animationDuration={300}
                    animationMode="easeTo"
                />

                <PointAnnotation
                    id="draggable-marker"
                    coordinate={markerCoordinate}
                    draggable
                    anchor={{ x: 0.5, y: 1.0 }}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                >
                    <FlameIcon width={40} height={50} />
                </PointAnnotation>
            </MapView>

            <View style={styles.infoPanel}>
                <View style={styles.coordinateRow}>
                    <View style={[styles.coordinateBox, styles.coordinateBoxSpacing]}>
                        <Text style={styles.coordinateLabel}>Latitude</Text>
                        <Text style={styles.coordinateValue}>{formattedCoordinates.latitude}</Text>
                    </View>
                    <View style={styles.coordinateBox}>
                        <Text style={styles.coordinateLabel}>Longitude</Text>
                        <Text style={styles.coordinateValue}>{formattedCoordinates.longitude}</Text>
                    </View>
                </View>
            </View>

            {/* Zoom Controls */}
            <View style={styles.zoomControls}>
                <Pressable
                    style={[
                        styles.controlButton,
                        zoomLevel >= MAX_ZOOM_LEVEL && styles.controlButtonDisabled
                    ]}
                    onPress={handleZoomIn}
                    disabled={zoomLevel >= MAX_ZOOM_LEVEL}
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
                    disabled={zoomLevel <= MIN_ZOOM_LEVEL}
                >
                    <Ionicons
                        name="remove-outline"
                        size={24}
                        color={zoomLevel <= MIN_ZOOM_LEVEL ? '#999999' : BARIKOI_COLORS.primary}
                    />
                </Pressable>
            </View>

            {/* Compass Control */}
            {mapRotation !== 0 && (
                <View style={styles.controls}>
                    <Pressable style={styles.controlButton} onPress={handleCompassReset}>
                        <Ionicons
                            name="compass-outline"
                            size={24}
                            color={BARIKOI_COLORS.primary}
                        />
                    </Pressable>
                </View>
            )}

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
        backgroundColor: BARIKOI_COLORS.white,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BARIKOI_COLORS.background,
        padding: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: BARIKOI_COLORS.text,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: BARIKOI_COLORS.background,
    },
    errorTitle: {
        fontSize: 18,
        color: BARIKOI_COLORS.secondary,
        fontWeight: '700',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: BARIKOI_COLORS.text,
        textAlign: 'center',
    },
    infoPanel: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: BARIKOI_COLORS.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 10,
    },
    coordinateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    coordinateBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        padding: 12,
        backgroundColor: BARIKOI_COLORS.background,
    },
    coordinateBoxSpacing: {
        marginRight: 12,
    },
    coordinateLabel: {
        fontSize: 12,
        color: BARIKOI_COLORS.text,
        opacity: 0.7,
        marginBottom: 4,
    },
    coordinateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: BARIKOI_COLORS.text,
    },
    zoomControls: {
        position: 'absolute',
        right: 16,
        top: Platform.select({ ios: 30, android: 20 }),
        backgroundColor: BARIKOI_COLORS.white,
        borderRadius: 8,
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
    controlButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BARIKOI_COLORS.white,
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
    zoomLevelContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e1e1',
    },
    zoomText: {
        fontSize: 12,
        fontWeight: '600',
        color: BARIKOI_COLORS.text,
    },
    controls: {
        position: 'absolute',
        right: 16,
        bottom: Platform.select({ ios: 120, android: 140 }),
        gap: 8,
    },
    logoContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
});