import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { MapView, Camera, MarkerView, ShapeSource, FillLayer } from '@maplibre/maplibre-react-native';

export default function PolygonScreen() {
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
                            key={`marker-${index+1}`}
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