import { MapView } from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from 'react-native';


export default function HomeScreen() {
  const [styleJson, setStyleJson] = useState(null);

  useEffect(() => {
    fetch("https://map.barikoi.com/styles/osm_barikoi_v2/style.json?key=NDE2NzpVNzkyTE5UMUoy")
      .then((response) => response.json())
      .then((data) => {
        // Remove or modify the sprite property
        if (data.sprite) {
          delete data.sprite; // Remove sprite if not needed
          // OR set to a valid sprite URL if available, e.g.:
          // data.sprite = "https://valid-sprite-url/sprite";
        }
        setStyleJson(data);
      })
      .catch((error) => console.error("Error fetching style JSON:", error));
  }, []);
  return (
    <View style={styles.container}>
     {styleJson && <MapView
        style={styles.map}
        attributionEnabled={false}
        logoEnabled
        zoomEnabled
        mapStyle={styleJson}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});