// app/screens/Welcome.tsx
import { router } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text, // PASTIKAN INI DARI REACT NATIVE
  TouchableOpacity,
  View,
} from "react-native";

export default function Welcome() {
  const handleBackToSplash = () => {
    router.replace("/screens/Splash");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Simple Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BOSH</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Image
            source={require("../../assets/bosh-dark.png")}
            style={styles.welcomeLogo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Premium Fragrance Experience</Text>
        </View>

        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleBackToSplash}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back to Splash</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeLogo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    paddingBottom: 30,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#333",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
