import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { MapView, Camera, MarkerView, ShapeSource, FillLayer, LineLayer } from '@maplibre/maplibre-react-native';

export default function GeometryScreen() {
    const [styleJson, setStyleJson] = useState(null);

    useEffect(() => {
        fetch("https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=NDE2NzpVNzkyTE5UMUoy")
            .then((response) => response.json())
            .then((data) => {
                if (data.sprite) {
                    delete data.sprite;
                }
                setStyleJson(data);
            })
            .catch((error) => console.error("Error fetching style JSON:", error));
    }, []);

    // Center point
    const centerPoint = [90.366659, 23.823724];
    
    // Circle polygon (approximated with points)
    const createCirclePoints = (center:any, radiusInKm:any, points = 64) => {
        const coords = [];
        const km = radiusInKm;
        
        for (let i = 0; i < points; i++) {
            const angle = (i * 2 * Math.PI) / points;
            const dx = Math.cos(angle) * km / 111.32;
            const dy = Math.sin(angle) * km / (111.32 * Math.cos(center[1] * (Math.PI / 180)));
            coords.push([
                center[0] + dx,
                center[1] + dy
            ]);
        }
        
        // Close the circle
        coords.push(coords[0]);
        
        return coords;
    };
    
    const circlePoints = createCirclePoints(centerPoint, 0.3); // 300m radius
    
    // Geometry data with multiple shapes
    const geometryGeoJSON = {
        type: 'FeatureCollection',
        features: [
            // Circle (polygon)
            {
                type: 'Feature',
                properties: { name: 'circle' },
                geometry: {
                    type: 'Polygon',
                    coordinates: [circlePoints]
                }
            },
            // Square (polygon)
            {
                type: 'Feature',
                properties: { name: 'square' },
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [90.362159, 23.825724], // Top-left
                        [90.366159, 23.825724], // Top-right
                        [90.366159, 23.821724], // Bottom-right
                        [90.362159, 23.821724], // Bottom-left
                        [90.362159, 23.825724]  // Close the polygon
                    ]]
                }
            },
            // Line
            {
                type: 'Feature',
                properties: { name: 'line' },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [90.367159, 23.825724], // Start
                        [90.371159, 23.821724]  // End
                    ]
                }
            }
        ]
    };

    // Marker points
    const markerPoints = [
        { coordinate: centerPoint, label: 'Center' },
        { coordinate: [90.362159, 23.825724], label: 'Square TL' },
        { coordinate: [90.367159, 23.825724], label: 'Line Start' },
        { coordinate: [90.371159, 23.821724], label: 'Line End' }
    ];

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
                        centerCoordinate={centerPoint}
                        zoomLevel={14.5}
                        animationDuration={1000}
                        animationMode="linearTo"
                    />
                    
                    {/* All geometry shapes */}
                    {/* @ts-ignore */}
                    <ShapeSource id="geometrySource" shape={geometryGeoJSON}>
                        {/* Circle and square fill */}
                        <FillLayer 
                            id="polygonFill" 
                            filter={['in', ['get', 'name'], ['literal', ['circle', 'square']]]}
                            style={{
                                fillColor: 'rgba(46, 133, 85, 0.3)', // Semi-transparent green
                                fillOutlineColor: '#2e8555'
                            }} 
                        />
                        
                        {/* Line */}
                        <LineLayer 
                            id="lineLayer"
                            filter={['==', ['get', 'name'], 'line']}
                            style={{
                                lineColor: '#e74c3c',
                                lineWidth: 3,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }} 
                        />
                    </ShapeSource>
                    
                    {/* Markers */}
                    {markerPoints.map((point, index) => (
                        <MarkerView
                            key={`marker-${index+1}`}
                            coordinate={point.coordinate}
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
            ) : (
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>Loading Map...</Text>
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
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerIcon: {
        width: 40,
        height: 40,
    },
}); 