import { Stack, usePathname } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import TopAppBar from "../components/TopAppBar";

// 1. PINDAHKAN KE LUAR: Agar tidak memicu warning dependency di useEffect
const TAB_ORDER = [
  "/screens/HomePage",
  "/screens/FindScent",
  "/screens/Product",
  "/screens/Wishlist",
];

export default function ScreensLayout() {
  const pathname = usePathname();
  const prevIndexRef = useRef(0);
  const [animationType, setAnimationType] = useState<
    "slide_from_right" | "slide_from_left"
  >("slide_from_right");

  useEffect(() => {
    const currentIndex = TAB_ORDER.indexOf(pathname);

    if (currentIndex !== -1) {
      if (currentIndex < prevIndexRef.current) {
        setAnimationType("slide_from_left");
      } else {
        setAnimationType("slide_from_right");
      }
      prevIndexRef.current = currentIndex;
    }
    // 2. REVISI: Dependency array sekarang sudah bersih karena TAB_ORDER di luar
  }, [pathname]);

  const hideNavbar =
    pathname === "/screens/DetailProduct" || pathname === "/screens/Developer";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["right", "left"]}
    >
      {!hideNavbar && <TopAppBar />}

      <Stack
        screenOptions={{
          headerShown: false,
          animation: animationType,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="HomePage" />
        <Stack.Screen name="FindScent" />
        <Stack.Screen name="Product" />
        <Stack.Screen name="Wishlist" />
        <Stack.Screen
          name="DetailProduct"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Developer"
          options={{ animation: "fade_from_bottom" }}
        />
      </Stack>

      {!hideNavbar && <Navbar />}
    </SafeAreaView>
  );
}
