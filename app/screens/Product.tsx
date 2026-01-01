import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; //
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../services/api"; //
import { useWishlist } from "../store/useWishlist";
import { formatCurrency } from "../utils/currency";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40 - 15) / 2;

// Key unik untuk caching produk per kategori
const PRODUCT_CACHE_PREFIX = "cache_products_";

export default function Product() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State Pull-to-Refresh

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

  // --- LOGIC FETCH DENGAN CACHING ---
  const fetchProducts = useCallback(
    async (tag: string, forceRefresh = false) => {
      const cacheKey = `${PRODUCT_CACHE_PREFIX}${tag}`;

      try {
        if (!forceRefresh) {
          // 1. Cek cache lokal dulu biar instan
          const cachedData = await AsyncStorage.getItem(cacheKey);
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            setAllProducts(parsed);
            setDisplayedProducts(parsed);
            setLoading(false);
            return;
          }
        }

        // 2. Jika tidak ada cache atau ditarik ke bawah (refresh), ambil dari API
        if (!refreshing) setLoading(true);
        const data = await apiService.getProductsByTag(tag); //
        setAllProducts(data);
        setDisplayedProducts(data);

        // 3. Simpan hasil terbaru ke Cache
        await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {
        console.error("Gagal load produk:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [refreshing]
  );

  // Jalankan fetch saat filter kategori berubah
  useEffect(() => {
    fetchProducts(activeFilter);
  }, [activeFilter, fetchProducts]);

  // Handler untuk Pull-to-Refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(activeFilter, true); // Paksa ambil data baru dari server
  };

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
        contentContainerStyle={styles.scrollContent}
        // Pasang fitur tarik bawah untuk update data
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
          />
        }
      >
        {/* SEARCH BAR */}
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
        {loading && !refreshing ? (
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
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.feature_image_url || item.image_url }}
                      style={styles.productImage}
                    />
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

                  <View style={styles.cardInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star-outline" size={14} color="#D4AF37" />
                      <Text style={styles.ratingText}>{item.rating} / 5.0</Text>
                    </View>
                    <Text style={styles.price}>
                      {formatCurrency(item.price)}
                    </Text>
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
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 15,
  },
  searchInput: {
    fontFamily: "Poppins-Regular",
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 170,
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
  productName: {
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 12,
  },
  buyNowBtn: {
    width: "100%",
    backgroundColor: "#1a1a1a",
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
