import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  Image,
  Linking, // Import Linking
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatCurrency } from "../utils/currency";

export default function DetailProduct() {
  const params = useLocalSearchParams();
  const product = JSON.parse(
    typeof params.data === "string" ? params.data : "{}"
  );

  // --- CONFIG WHATSAPP (NOMOR ADMIN ASLI) ---
  const WHATSAPP_NUMBER = "6282125902548";

  const handleBuyNow = () => {
    const message = `Halo Admin Bosh Parfume, saya tertarik dengan produk *${
      product.name
    }* harga ${formatCurrency(product.price)}. Apakah stok masih ada?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(url).catch((err) =>
      console.error("Gagal membuka WhatsApp", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER IMAGE */}
      <Image source={{ uri: product.image_url }} style={styles.banner} />

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.name}>{product.name} - BOSH PARFUME</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>

        {/* SIZE */}
        <Text style={styles.sectionTitle}>Size</Text>
        <TouchableOpacity style={styles.sizeBox}>
          <Text style={styles.sizeText}>30 ml</Text>
        </TouchableOpacity>

        {/* DESCRIPTION */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {product.description || "No description available."}
        </Text>

        {/* FRAGRANCE NOTES */}
        <Text style={styles.sectionTitle}>Fragrance Notes</Text>

        <View style={styles.notesRow}>
          {/* Top Note */}
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Top</Text>
            <Text style={styles.noteValue}>
              {product.top_note ? product.top_note : "-"}
            </Text>
          </View>

          {/* Middle Note */}
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Middle</Text>
            <Text style={styles.noteValue}>
              {product.middle_note ? product.middle_note : "-"}
            </Text>
          </View>

          {/* Base Note */}
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>Base</Text>
            <Text style={styles.noteValue}>
              {product.base_note ? product.base_note : "-"}
            </Text>
          </View>
        </View>

        {/* ACTION BUTTON -> BUY NOW (WHATSAPP) */}
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.8}
          onPress={handleBuyNow}
        >
          {/* Icon WA */}
          <Ionicons
            name="logo-whatsapp"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.cartText}>Buy Now via WhatsApp</Text>
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
    color: "#222",
  },

  noteValue: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    fontSize: 13,
    color: "#444",
  },

  // STYLING TOMBOL CHECKOUT (HIJAU WA)
  cartBtn: {
    backgroundColor: "#25D366", // Warna WA
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 40,
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#25D366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  cartText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
  },
});
