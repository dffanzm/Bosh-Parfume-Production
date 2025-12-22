import { Stack, usePathname } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import TopAppBar from "../components/TopAppBar";

export default function ScreensLayout() {
  const pathname = usePathname();

  const hideNavbar = pathname === "/screens/DetailProduct";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopAppBar />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="HomePage" />
        <Stack.Screen name="Product" />
        <Stack.Screen name="Wishlist" />
        <Stack.Screen name="DetailProduct" />
      </Stack>

      {!hideNavbar && <Navbar />}
    </SafeAreaView>
  );
}
