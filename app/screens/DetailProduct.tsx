import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router"; // Tambah useRouter
import { ArrowLeft } from "lucide-react-native"; // Import Arrow dari Lucide
import {
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatCurrency } from "../utils/currency";

export default function DetailProduct() {
  const params = useLocalSearchParams();
  const router = useRouter(); // Inisialisasi router
  const insets = useSafeAreaInsets(); // Untuk handle notch HP

  const product = JSON.parse(
    typeof params.data === "string" ? params.data : "{}"
  );

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
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* --- TOMBOL BALIK (FLOATING BACK BUTTON) --- */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowLeft color="#fff" size={24} strokeWidth={2.5} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER IMAGE */}
        <Image source={{ uri: product.image_url }} style={styles.banner} />

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.name}>{product.name} - BOSH PARFUME</Text>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>

          {/* SIZE */}
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeBox}>
            <Text style={styles.sizeText}>30 ml</Text>
          </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // --- STYLE TOMBOL BALIK ---
  backButton: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)", // Efek glass transparan gelap
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  banner: { width: "100%", height: 420, resizeMode: "cover" },

  content: {
    padding: 25,
    marginTop: -30, // Efek naik menimpa gambar
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  name: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    color: "#1a1a1a",
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
    color: "#1a1a1a",
  },

  sizeBox: {
    borderWidth: 1,
    borderColor: "#1a1a1a", // Dibikin lebih tegas warnanya
    borderRadius: 12,
    width: 100,
    paddingVertical: 10,
    marginTop: 12,
    alignItems: "center",
  },

  sizeText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#1a1a1a",
  },

  description: {
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginTop: 10,
    lineHeight: 24,
  },

  notesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  noteBox: {
    width: "31%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9", // Tambah background dikit biar mewah
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 15,
    alignItems: "center",
  },

  noteTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    marginBottom: 6,
    color: "#888",
    textTransform: "uppercase",
  },

  noteValue: {
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    fontSize: 13,
    color: "#1a1a1a",
  },

  cartBtn: {
    backgroundColor: "#25D366",
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#25D366",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  cartText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
  },
});
