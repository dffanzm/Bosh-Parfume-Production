import { usePathname, useRouter } from "expo-router";
import { Heart, House, ShoppingBag } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();

  const isActive = (route: string) => path === route;

  return (
    <View style={styles.navbar}>
      {/* HOME */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/screens/HomePage")}
      >
        <House
          size={24}
          color={isActive("/screens/HomePage") ? "#000" : "#BDBDBD"}
          strokeWidth={isActive("/screens/HomePage") ? 2.5 : 1.5}
        />
        <Text
          style={[
            styles.label,
            { color: isActive("/screens/HomePage") ? "#000" : "#BDBDBD" },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* PRODUCT */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/screens/Product")}
      >
        <ShoppingBag
          size={24}
          color={isActive("/screens/Product") ? "#000" : "#BDBDBD"}
          strokeWidth={isActive("/screens/Product") ? 2.5 : 1.5}
        />
        <Text
          style={[
            styles.label,
            { color: isActive("/screens/Product") ? "#000" : "#BDBDBD" },
          ]}
        >
          Products
        </Text>
      </TouchableOpacity>

      {/* WISHLIST */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/screens/Wishlist")}
      >
        <Heart
          size={24}
          color={isActive("/screens/Wishlist") ? "red" : "#BDBDBD"}
          strokeWidth={isActive("/screens/Wishlist") ? 2 : 1.5}
        />
        <Text
          style={[
            styles.label,
            { color: isActive("/screens/Wishlist") ? "red" : "#BDBDBD" },
          ]}
        >
          Wishlist
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  item: {
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
  },
});
