// components/TopAppBar.tsx
import { usePathname, useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopAppBar() {
  const router = useRouter();
  const path = usePathname();
  const insets = useSafeAreaInsets();

  // Normalize path untuk konsistensi
  const normalizePath = (route: string) => {
    return route.replace("/screens/", "/");
  };

  const isWishlist = normalizePath(path) === "/Wishlist";

  return (
    <View style={[styles.container, { paddingTop: insets.top || 12 }]}>
      <Image
        source={require("../../assets/logobosh_black.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>BOSH PARFUME</Text>

      <TouchableOpacity onPress={() => router.push("./Wishlist")}>
        <Heart
          size={24}
          color={isWishlist ? "red" : "#BDBDBD"}
          strokeWidth={1.8}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  logo: { width: 28, height: 28 },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    letterSpacing: 0.5,
    color: "#000",
  },
});
