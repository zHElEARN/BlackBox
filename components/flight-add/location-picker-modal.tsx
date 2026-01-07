// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// @ts-ignore
import { MapView, Marker } from "expo-gaode-map";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LocationService, reverseGeocode } from "@/utils/location";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: LocationData) => void;
  initialLocation?: { latitude: number; longitude: number } | null;
  title?: string;
}

export function LocationPickerModal({ visible, onClose, onSelect, initialLocation, title = "选择位置" }: LocationPickerModalProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const mapRef = React.useRef<any>(null);

  const moveCameraToLocation = (loc: { latitude: number; longitude: number }) => {
    if (mapRef.current) {
      mapRef.current.moveCamera(
        {
          target: {
            latitude: loc.latitude,
            longitude: loc.longitude,
          },
          zoom: 15,
        },
        300
      );
    }
  };

  useEffect(() => {
    if (visible) {
      if (initialLocation) {
        setMarker(initialLocation);
        handleReverseGeocode(initialLocation.latitude, initialLocation.longitude);
        // Attempt to move camera immediately if ref exists (e.g. modal re-opened)
        moveCameraToLocation(initialLocation);
      } else {
        getCurrentLocation();
      }
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    console.log("Getting current location...");
    try {
      const loc = await LocationService.getCurrentLocation();
      console.log("Location received:", loc);
      if (loc) {
        setMarker({
          latitude: loc.latitude,
          longitude: loc.longitude,
        });

        moveCameraToLocation(loc);

        if (loc.address) {
          setAddress(loc.address);
        } else {
          handleReverseGeocode(loc.latitude, loc.longitude);
        }
      } else {
        console.log("Location is null");
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const handleMapPress = (e: any) => {
    // console.log("Map pressed:", e.nativeEvent);
    // Prioritize top-level latitude/longitude as per type definition, fallback to coordinate object
    const event = e.nativeEvent;
    let lat = event.latitude;
    let long = event.longitude;

    if (lat === undefined || long === undefined) {
      if (event.coordinate) {
        lat = event.coordinate.latitude;
        long = event.coordinate.longitude;
      }
    }

    if (lat !== undefined && long !== undefined) {
      console.log("Setting marker to:", lat, long);
      setMarker({ latitude: lat, longitude: long });
      handleReverseGeocode(lat, long);
    } else {
      console.warn("Invalid map press event structure:", event);
    }
  };

  const handleReverseGeocode = async (lat: number, long: number) => {
    setLoadingAddress(true);
    const result = await reverseGeocode(lat, long);
    setLoadingAddress(false);
    if (result) {
      setAddress(result);
    } else {
      setAddress(null);
    }
  };

  const handleMapLoad = () => {
    // Ensure we move to the right place once loaded
    if (initialLocation) {
      moveCameraToLocation(initialLocation);
    } else if (marker) {
      // If initialLocation wasn't provided, but a marker was set (e.g., by getCurrentLocation),
      // move to that marker's location.
      moveCameraToLocation(marker);
    }
  };

  const handleConfirm = () => {
    if (marker) {
      onSelect({
        latitude: marker.latitude,
        longitude: marker.longitude,
        address: address || "",
      });
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Text style={{ color: theme.tint, fontSize: 16 }}>取消</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <TouchableOpacity onPress={handleConfirm} style={styles.headerBtn} disabled={!marker}>
            <Text style={{ color: marker ? theme.tint : theme.icon, fontSize: 16, fontWeight: "600" }}>确定</Text>
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView ref={mapRef} style={styles.map} onLoad={handleMapLoad} onMapPress={handleMapPress} showsUserLocation={true} showsCompass={true} showsScale={true} zoomLevel={15}>
            {marker && <Marker key={`${marker.latitude}-${marker.longitude}`} position={marker} title="已选位置" />}
          </MapView>

          {/* Location Info Card */}
          {marker && (
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={24} color={theme.tint} />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, { color: theme.text }]}>已选坐标</Text>
                  <Text style={[styles.infoCoords, { color: theme.icon }]}>
                    {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
              {address ? (
                <View style={styles.addressContainer}>
                  {/* Try to parse address if it is a JSON string, else generic text */}
                  <Text style={[styles.addressText, { color: theme.text }]} numberOfLines={2}>
                    {(() => {
                      try {
                        const addr = JSON.parse(address);
                        return addr.formattedAddress || `${addr.city}${addr.district}${addr.street}`;
                      } catch {
                        return "未知地址";
                      }
                    })()}
                  </Text>
                </View>
              ) : (
                loadingAddress && <ActivityIndicator size="small" color={theme.tint} style={{ marginTop: 8 }} />
              )}
            </View>
          )}

          {/* Locate Me Button */}
          <TouchableOpacity style={[styles.locateBtn, { backgroundColor: theme.card }]} onPress={getCurrentLocation}>
            <Ionicons name="locate" size={24} color={theme.tint} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    padding: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  infoCoords: {
    fontSize: 13,
    marginTop: 2,
  },
  addressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  locateBtn: {
    position: "absolute",
    bottom: 200,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
