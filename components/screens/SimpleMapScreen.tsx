import { Camera, MapView, MarkerView } from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SimpleMapScreen() {
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
                        centerCoordinate={[90.364159, 23.823724]}
                        zoomLevel={16}
                        animationDuration={1000}
                        animationMode="linearTo"
                    />
                    {/* <MarkerView
                        coordinate={[90.364159, 23.823724]}
                        anchor={{ x: 0.5, y: 1.0 }}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/icons/barikoi_icon.png')}
                                    style={styles.markerIcon}
                                    resizeMode="contain"
                                />
                                <View style={styles.markerPin} />
                            </View>
                        </View>
                    </MarkerView> */}
                    <MarkerView
                            coordinate={[90.364159, 23.823724]}
                            anchor={{ x: 0.5, y: 1.0 }} // This makes the bottom of the marker be at the coordinate
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