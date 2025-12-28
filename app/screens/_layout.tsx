import { Stack, usePathname } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import TopAppBar from "../components/TopAppBar";

export default function ScreensLayout() {
  const pathname = usePathname();

  // Logic sembunyikan Navbar di DetailProduct DAN Developer
  const hideNavbar =
    pathname === "/screens/DetailProduct" || pathname === "/screens/Developer";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* TopAppBar bisa disembunyikan juga kalau mau full dark mode di dev page, 
          tapi codingan ini membiarkannya tetap ada. Kalau mau hide, tambahkan logic && !hideNavbar */}
      {!hideNavbar && <TopAppBar />}

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="HomePage" />
        <Stack.Screen name="FindScent" />
        <Stack.Screen name="Product" />
        <Stack.Screen name="Wishlist" />
        <Stack.Screen name="DetailProduct" />

        {/* TAMBAHAN: Developer Page (Easter Egg) */}
        <Stack.Screen
          name="Developer"
          options={{
            animation: "fade_from_bottom", // Animasi beda biar spesial
            gestureEnabled: false, // Biar gak bisa swipe back (opsional)
          }}
        />
      </Stack>

      {/* Navbar muncul jika BUKAN di Detail atau Developer */}
      {!hideNavbar && <Navbar />}
    </SafeAreaView>
  );
}
