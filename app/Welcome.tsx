// app/Welcome.tsx
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  return (
    <ImageBackground
      source={require("../assets/header.png")}
      style={styles.background}
    >
      {/* overlay biar teks lebih jelas */}
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

        {/* button refined */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.replace("/screens/HomePage")}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>GET STARTED TODAY</Text>
            <Text style={styles.arrow}>→</Text>
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

  textContainer: {
    marginTop: 200,
  },

  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "white",
    lineHeight: 58,
    fontFamily: "Poppins-Bold",
    letterSpacing: -0.5,
  },

  /* --- BUTTON IMPROVED --- */
  button: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    paddingVertical: 18,
    borderRadius: 40,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255,255,255,0.06)", // subtle glass feel
    backdropFilter: "blur(6px)", // optional on web, harmless on native
  },

  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
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
