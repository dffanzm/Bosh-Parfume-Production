// app/Welcome.tsx
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react"; // Tambah useState
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "./services/api"; // Import apiService

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIC PRE-LOAD DATA ---
  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      // Kita panggil semua data barengan (Banners & Products)
      // Ini memastikan saat user sampai di Home, data sudah masuk cache internal
      await Promise.all([apiService.getBanners(), apiService.getProducts()]);

      // Setelah load selesai, baru pindah
      router.replace("/screens/HomePage");
    } catch (error) {
      console.error("Pre-load failed:", error);
      setIsLoading(false);
      // Fallback: tetap pindah ke Home kalau error, biar user ga stuck
      router.replace("/screens/HomePage");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/header.png")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.65)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.65)"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            ATTRACT{"\n"}PARTNER{"\n"}WITH YOUR{"\n"}SMELL
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isLoading && { borderColor: "rgba(255,255,255,0.4)" },
          ]}
          activeOpacity={0.8}
          onPress={handleGetStarted}
          disabled={isLoading} // Biar user ga klik berkali-kali
        >
          <View style={styles.buttonContent}>
            {isLoading ? (
              <ActivityIndicator color="white" style={{ marginRight: 10 }} />
            ) : (
              <Text style={styles.buttonText}>GET STARTED TODAY</Text>
            )}

            {!isLoading && <Text style={styles.arrow}>→</Text>}
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "flex-end" },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 70,
    paddingHorizontal: 25,
  },
  textContainer: { marginTop: 200 },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
    lineHeight: 58,
    fontFamily: "Poppins-Bold",
    letterSpacing: -0.5,
  },
  button: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    paddingVertical: 18,
    borderRadius: 40,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255,255,255,0.06)",
    minHeight: 65, // Biar tinggi tombol konsisten pas ada spinner
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center", // Biar spinner ke tengah
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    letterSpacing: 1,
  },
  arrow: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 10,
  },
});
