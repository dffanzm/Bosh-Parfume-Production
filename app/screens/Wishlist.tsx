import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWishlist } from "../store/useWishlist";

export default function Wishlist() {
  const items = useWishlist((state: any) => state.items);
  const removeFromWishlist = useWishlist(
    (state: any) => state.removeFromWishlist
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>Wishlist kamu masih kosong 😢</Text>
      ) : (
        items.map((item: any) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>

            <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontFamily: "Poppins-SemiBold", marginBottom: 20 },
  emptyText: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    alignItems: "center",
  },
  image: { width: 70, height: 70, borderRadius: 12, marginRight: 12 },
  name: { fontFamily: "Poppins-SemiBold", fontSize: 14 },
  price: { fontFamily: "Poppins-Regular", color: "#d62828" },
});
