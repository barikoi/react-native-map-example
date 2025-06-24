import { MapView } from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [styleJson, setStyleJson] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Simple Map');
  const drawerAnimation = new Animated.Value(-250);

  const menuOptions = [
    { id: 1, title: 'Simple Map', icon: '🗺️' },
    { id: 2, title: 'Current Location', icon: '📍' },
    { id: 3, title: 'Marker', icon: '📌' },
    { id: 4, title: 'Line', icon: '📏' },
    { id: 5, title: 'Polygon', icon: '⬡' },
    { id: 6, title: 'Geometry', icon: '🔷' },
  ];

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

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -250 : 0;
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    toggleDrawer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
            <View style={styles.menuIcon}>
              <View style={[styles.menuLine, { backgroundColor: '#2e8555' }]} />
              <View style={[styles.menuLine, { backgroundColor: '#2e8555' }]} />
              <View style={[styles.menuLine, { backgroundColor: '#2e8555' }]} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedOption}</Text>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          {styleJson && (
            <MapView
              style={styles.map}
              attributionEnabled={false}
              logoEnabled
              zoomEnabled
              mapStyle={styleJson}
            />
          )}
        </View>

        {/* Drawer */}
        <Animated.View style={[styles.drawer, { left: drawerAnimation }]}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Map Options</Text>
            <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuList}>
            {menuOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.menuItem,
                  selectedOption === option.title && styles.selectedMenuItem
                ]}
                onPress={() => selectOption(option.title)}
              >
                <Text style={styles.menuIcon}>{option.icon}</Text>
                <Text style={[
                  styles.menuText,
                  selectedOption === option.title && styles.selectedMenuText
                ]}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.drawerFooter}>
            <Text style={styles.footerText}>Expo Map App</Text>
            <Text style={styles.footerSubtext}>v1.0.0</Text>
          </View>
        </Animated.View>

        {/* Overlay */}
        {isDrawerOpen && (
          <TouchableOpacity
            style={styles.overlay}
            onPress={toggleDrawer}
            activeOpacity={1}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    marginRight: 15,
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    width: 24,
    borderRadius: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e8555',
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 1000,
  },
  drawerHeader: {
    height: 80,
    backgroundColor: '#2e8555',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 25,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuList: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedMenuItem: {
    backgroundColor: '#f8fffe',
    borderRightWidth: 3,
    borderRightColor: '#2e8555',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  selectedMenuText: {
    color: '#2e8555',
    fontWeight: '600',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e8555',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
});