import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import Navbar from "./components/Navbar";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/Fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/Fonts/Poppins-Regular.ttf"),
  });

  const path = usePathname();

  // halaman yang TIDAK boleh ada navbar
  const hideNavbar = ["/screens/Splash", "/screens/Welcome"].includes(path);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/Splash" />
        <Stack.Screen name="screens/Welcome" />

        {/* lu nanti tambahin ini */}
        <Stack.Screen name="screens/HomePage" />
        <Stack.Screen name="screens/Product" />
        <Stack.Screen name="screens/Wishlist" />
      </Stack>

      {/* Navbar muncul HANYA di halaman tertentu */}
      {!hideNavbar && <Navbar />}
    </View>
  );
}
