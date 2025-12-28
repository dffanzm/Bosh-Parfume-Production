import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../services/api";
import { useWishlist } from "../store/useWishlist";
import { formatCurrency } from "../utils/currency";

const { width } = Dimensions.get("window");
// Card width: (Layar - Padding 20x2 - Gap 15) / 2
const cardWidth = (width - 40 - 15) / 2;

export default function Product() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const wishlist = useWishlist((state: any) => state.items);
  const addWishlist = useWishlist((state: any) => state.addToWishlist);
  const removeWishlist = useWishlist((state: any) => state.removeFromWishlist);

  const WHATSAPP_NUMBER = "6282125902548";

  const handleBuyNow = (productName: string) => {
    const message = `Halo Admin Bosh Parfume, saya mau pesan *${productName}*`;
    Linking.openURL(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProductsByTag(activeFilter);
        setAllProducts(data);
        setDisplayedProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeFilter]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setDisplayedProducts(allProducts);
      return;
    }
    const lowerText = text.toLowerCase();
    const filtered = allProducts.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerText) ||
        item.top_note?.toLowerCase().includes(lowerText)
      );
    });
    setDisplayedProducts(filtered);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        {/* SEARCH BAR (Clean Style) */}
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#666"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search collection..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* FILTER TAGS */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["all", "new", "best"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.filterActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.filterActiveText,
                  ]}
                >
                  {filter === "all"
                    ? "All"
                    : filter === "new"
                    ? "New Arrival"
                    : "Best Seller"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* PRODUCT GRID */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{ marginTop: 50 }}
          />
        ) : (
          <View style={styles.grid}>
            {displayedProducts.map((item) => {
              const isFavorited = wishlist.some((w: any) => w.id === item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.9}
                  onPress={() =>
                    router.push({
                      pathname: "/screens/DetailProduct",
                      params: { data: JSON.stringify(item) },
                    })
                  }
                >
                  {/* 1. GAMBAR (Image Container) */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.feature_image_url }}
                      style={styles.productImage}
                    />
                    {/* Love Button Floating */}
                    <TouchableOpacity
                      style={styles.loveBtn}
                      onPress={() =>
                        isFavorited
                          ? removeWishlist(item.id)
                          : addWishlist(item)
                      }
                    >
                      <Ionicons
                        name={isFavorited ? "heart" : "heart-outline"}
                        size={18}
                        color={isFavorited ? "#e63946" : "#1a1a1a"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* INFO AREA */}
                  <View style={styles.cardInfo}>
                    {/* 2. NAMA (Poppins Regular - Clean Luxury) */}
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    {/* 3. RATING (Star Outline Emas) */}
                    <View style={styles.ratingRow}>
                      <Ionicons name="star-outline" size={14} color="#D4AF37" />
                      <Text style={styles.ratingText}>{item.rating} / 5.0</Text>
                    </View>

                    {/* 4. HARGA (Poppins SemiBold - Tegas) */}
                    <Text style={styles.price}>
                      {formatCurrency(item.price)}
                    </Text>

                    {/* 5. BUTTON (Hitam Full - Add to Bag) */}
                    <TouchableOpacity
                      style={styles.buyNowBtn}
                      onPress={() => handleBuyNow(item.name)}
                    >
                      <Text style={styles.buyNowText}>Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },

  /* --- SEARCH BAR --- */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA", // Abu sangat muda
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 15,
  },
  searchInput: {
    fontFamily: "Poppins-Regular", // Sesuai _layout.tsx
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  /* --- FILTER --- */
  filterContainer: { marginBottom: 20 },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginRight: 10,
  },
  filterActive: { backgroundColor: "#1a1a1a", borderColor: "#1a1a1a" },
  filterText: { fontFamily: "Poppins-Regular", fontSize: 12, color: "#888" },
  filterActiveText: { color: "#fff", fontFamily: "Poppins-SemiBold" },

  /* --- GRID SYSTEM --- */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },

  /* --- CARD STYLE (Miliaran Vibe) --- */
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    // Shadow super tipis biar clean
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  imageContainer: {
    width: "100%",
    height: 170, // Gambar agak tinggi biar mewah
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F9F9F9",
    position: "relative",
  },
  productImage: { width: "100%", height: "100%", resizeMode: "cover" },
  loveBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 2,
  },

  cardInfo: { padding: 12 },

  /* --- TYPOGRAPHY & BUTTON --- */
  productName: {
    fontFamily: "Poppins-Regular", // Clean look
    fontSize: 14,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#888",
  },
  price: {
    fontFamily: "Poppins-SemiBold", // Harga harus tegas
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 12,
  },
  buyNowBtn: {
    width: "100%",
    backgroundColor: "#1a1a1a", // Hitam pekat (Luxury standard)
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buyNowText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
});
