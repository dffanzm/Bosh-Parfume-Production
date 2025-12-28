// app/_layout.tsx
import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import NoInternet from "./components/NoInternet";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Bold": require("../assets/Fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/Fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/Fonts/Poppins-SemiBold.ttf"),
  });

  // 2. State untuk status internet (Default true biar gak nge-flash screen error pas awal buka)
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // 3. Effect untuk Font & Splash Screen
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 4. Effect untuk Monitor Internet Realtime
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Set status internet
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 5. Fungsi Manual Retry (Buat tombol "Try Again")
  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  };

  // Cek Font dulu
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 6. BLOCKING: Kalau Internet Mati, Tampilkan NoInternet Screen
  if (isConnected === false) {
    return <NoInternet onRetry={handleRetry} />;
  }

  // Kalau Internet Aman, Render App Normal
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 350,
        }}
      >
        {/* === PUBLIC / INTRO FLOW === */}
        <Stack.Screen name="index" />
        <Stack.Screen name="Splash" />
        <Stack.Screen name="Welcome" />

        {/* === MAIN APP SCREENS === */}
        <Stack.Screen
          name="screens/HomePage"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />

        {/* --- MENU BARU: FIND SCENT --- */}
        <Stack.Screen
          name="screens/FindScent"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />

        <Stack.Screen
          name="screens/Product"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="screens/Wishlist"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />

        {/* Detail Product */}
        <Stack.Screen
          name="screens/DetailProduct"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />

        {/* --- TAMBAHAN: DEVELOPER PAGE --- */}
        <Stack.Screen
          name="screens/Developer"
          options={{
            animation: "fade_from_bottom",
            gestureEnabled: false,
          }}
        />
      </Stack>
    </View>
  );
}
