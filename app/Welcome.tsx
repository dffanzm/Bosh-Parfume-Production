// app/Welcome.tsx
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
      source={require("../assets/hero-perfume.jpg")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            ATTRACT{"\n"}PARTNER{"\n"}WITH YOUR{"\n"}SMELL
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
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
  textContainer: { marginTop: 200 },
  title: {
    fontSize: 48,
    fontWeight: "800",
    fontFamily: "Poppins-Bold",
    color: "white",
    lineHeight: 58,
  },
  button: {
    borderWidth: 2,
    borderColor: "white",
    paddingVertical: 15,
    borderRadius: 50,
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  arrow: { color: "white", fontSize: 22, fontWeight: "600" },
});
