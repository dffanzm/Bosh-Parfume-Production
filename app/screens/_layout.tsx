// app/screens/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import TopAppBar from "../components/TopAppBar";

export default function ScreensLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopAppBar />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right", // INI BUAT ANIMASI SLIDE!
          gestureEnabled: true, // INI BUAT SWIPE BACK!
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="HomePage" />
        <Stack.Screen name="Product" />
        <Stack.Screen name="Wishlist" />
      </Stack>
      <Navbar />
    </SafeAreaView>
  );
}
