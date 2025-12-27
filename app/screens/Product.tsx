import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

  // STATE DATA API
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const wishlist = useWishlist((state: any) => state.items);
  const addWishlist = useWishlist((state: any) => state.addToWishlist);
  const removeWishlist = useWishlist((state: any) => state.removeFromWishlist);

  // LOGIC FILTER via API
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProductsByTag(activeFilter);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeFilter]);

  return (
    <ScrollView style={styles.container}>
      {/* SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search Products..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* FILTER BUTTON */}
      <View style={styles.filterRow}>
        {["all", "new", "best"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={
              activeFilter === filter ? styles.filterActive : styles.filterButton
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
              {filter === "all" ? "All" : filter === "new" ? "New" : "Best Seller"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PRODUCT GRID */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : (
        <View style={styles.grid}>
          {products.map((item) => {
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
                {/* PAKE URI KARENA DARI INTERNET */}
                <Image source={{ uri: item.image_url }} style={styles.productImage} />

                {/* LOVE ICON */}
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

                {/* NAME */}
                <Text style={styles.productName}>{item.name}</Text>

                {/* PRICE (FORMATTED) */}
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>

                {/* RATING */}
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#f4a261" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>

                {/* BUTTONS */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.buyNowBtn}>
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

      {/* BOTTOM SPACING */}
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