import { useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetailProduct() {
  // ambil data dari param (gambar, nama, harga, dll)
  const params = useLocalSearchParams();
  const product = JSON.parse(
    typeof params.data === "string" ? params.data : "{}"
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER IMAGE */}
      <Image source={product.image} style={styles.banner} />

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.name}>{product.name} - BOSH PARFUME</Text>
        <Text style={styles.price}>{product.price}</Text>

        {/* SIZE */}
        <Text style={styles.sectionTitle}>Size</Text>
        <TouchableOpacity style={styles.sizeBox}>
          <Text style={styles.sizeText}>30 ml</Text>
        </TouchableOpacity>

        {/* DESCRIPTION */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          Parfum dengan aroma gourmand yang hangat, creamy, dan manis lembut.
          Wangi ini memberi kesan menenangkan dan elegan tanpa terasa
          berlebihan.
        </Text>

        {/* FRAGRANCE NOTES */}
        <Text style={styles.sectionTitle}>Fragrance Notes</Text>

        <View style={styles.notesRow}>
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Top</Text>
            <Text style={styles.noteValue}>Vanilla Bean</Text>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Middle</Text>
            <Text style={styles.noteValue}>Creamy Notes</Text>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Base</Text>
            <Text style={styles.noteValue}>Amber, Musk, Soft Woods</Text>
          </View>
        </View>

        {/* ADD TO WISHLIST BUTTON */}
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartText}>Add to Wishlist</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  banner: { width: "100%", height: 350, resizeMode: "cover" },

  content: { padding: 20 },

  name: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    marginTop: 10,
  },

  price: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#d27b4a",
    marginTop: 5,
  },

  sectionTitle: {
    marginTop: 25,
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },

  sizeBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: 110,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    alignItems: "center",
  },

  sizeText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },

  description: {
    fontFamily: "Poppins-Regular",
    color: "#444",
    marginTop: 10,
    lineHeight: 22,
  },

  notesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  noteBox: {
    width: "30%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
  },

  noteTitle: {
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },

  noteValue: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    fontSize: 13,
    color: "#444",
  },

  cartBtn: {
    backgroundColor: "#1c1c3c",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 40,
    alignItems: "center",
  },

  cartText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
});
