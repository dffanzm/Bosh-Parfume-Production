import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function Product() {
  const [activeFilter, setActiveFilter] = useState("all");

  // STATE DATA
  const [allProducts, setAllProducts] = useState<any[]>([]); // Data mentah dari API
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]); // Data yang tampil di layar (hasil filter)
  const [searchQuery, setSearchQuery] = useState(""); // Text search user
  const [loading, setLoading] = useState(false);

  const wishlist = useWishlist((state: any) => state.items);
  const addWishlist = useWishlist((state: any) => state.addToWishlist);
  const removeWishlist = useWishlist((state: any) => state.removeFromWishlist);

  const WHATSAPP_NUMBER = "6282125902548";

  const handleBuyNow = (productName: string) => {
    const message = `Halo Admin Bosh Parfume, saya mau pesan *${productName}*, apakah stok ready?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    Linking.openURL(url).catch((err) => console.error("Err WA", err));
  };

  // 1. FETCH DATA (Cuma sekali pas ganti Filter Kategori)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProductsByTag(activeFilter);
        setAllProducts(data);
        setDisplayedProducts(data); // Awal-awal tampilin semua
        setSearchQuery(""); // Reset search pas ganti kategori
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeFilter]);

  // 2. LOGIC SEARCH (Realtime Search by Name & Notes)
  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setDisplayedProducts(allProducts); // Kalau kosong, balikin semua
      return;
    }

    const lowerText = text.toLowerCase();

    // FILTER SAKTI: Cari di Nama, Top Note, Middle Note, atau Base Note
    const filtered = allProducts.filter((item) => {
      const matchName = item.name.toLowerCase().includes(lowerText);
      const matchTop = item.top_note?.toLowerCase().includes(lowerText);
      const matchMid = item.middle_note?.toLowerCase().includes(lowerText);
      const matchBase = item.base_note?.toLowerCase().includes(lowerText);

      return matchName || matchTop || matchMid || matchBase;
    });

    setDisplayedProducts(filtered);
  };

  return (
    <ScrollView style={styles.container}>
      {/* SEARCH BAR (Sekarang udah fungsi!) */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Find your parfume..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {/* Tombol Clear Search (Muncul kalau ada teks) */}
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={18} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTER BUTTON */}
      <View style={styles.filterRow}>
        {["all", "new", "best"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={
              activeFilter === filter
                ? styles.filterActive
                : styles.filterButton
            }
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={
                activeFilter === filter
                  ? styles.filterActiveText
                  : styles.filterText
              }
            >
              {filter === "all"
                ? "All"
                : filter === "new"
                ? "New"
                : "Best Seller"}
            </Text>
          </TouchableOpacity>
        ))}
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
          {/* Kalau hasil pencarian 0 */}
          {displayedProducts.length === 0 && (
            <View
              style={{ width: "100%", alignItems: "center", marginTop: 20 }}
            >
              <Text style={{ color: "#888", fontFamily: "Poppins-Regular" }}>
                Produk tidak ditemukan :(
              </Text>
            </View>
          )}

          {displayedProducts.map((item) => {
            const isFavorited = wishlist.some((w: any) => w.id === item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/screens/DetailProduct",
                    params: { data: JSON.stringify(item) },
                  })
                }
              >
                <Image
                  source={{ uri: item.feature_image_url }}
                  style={styles.productImage}
                />

                <TouchableOpacity
                  style={styles.loveBtn}
                  onPress={() =>
                    isFavorited ? removeWishlist(item.id) : addWishlist(item)
                  }
                >
                  <Ionicons
                    name={isFavorited ? "heart" : "heart-outline"}
                    size={22}
                    color={isFavorited ? "#e63946" : "#555"}
                  />
                </TouchableOpacity>

                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>

                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#f4a261" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.buyNowBtn}
                    onPress={() => handleBuyNow(item.name)}
                  >
                    <Text style={styles.buyNowText}>BUY NOW</Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Ionicons name="cart-outline" size={24} color="#222" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    fontFamily: "Poppins-Regular",
    flex: 1,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 20,
    justifyContent: "flex-start",
    gap: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  filterText: {
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  filterActive: {
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  filterActiveText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  loveBtn: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 50,
    elevation: 3,
  },
  productName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    marginTop: 10,
  },
  price: {
    fontFamily: "Poppins-SemiBold",
    color: "#d62828",
    marginTop: 3,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  ratingText: {
    marginLeft: 4,
    fontFamily: "Poppins-Medium",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  buyNowBtn: {
    backgroundColor: "#2a2a72",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buyNowText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
});
