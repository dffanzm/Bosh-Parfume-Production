// app/screens/Product.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRODUCTS = [
  {
    id: 1,
    name: "VC. SO SEXY",
    price: "Rp 60.000",
    rating: 4.5,
    tag: "new",
    image:
      "https://images.unsplash.com/photo-1592945403244-22ab5f437f89?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 2,
    name: "EIGNER BLUE",
    price: "Rp 60.000",
    rating: 4.5,
    tag: "best",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 3,
    name: "JLO STILL",
    price: "Rp 60.000",
    rating: 4.5,
    tag: "all",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1f5?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 4,
    name: "CR7 BOSH",
    price: "Rp 60.000",
    rating: 4.5,
    tag: "new",
    image:
      "https://images.unsplash.com/photo-1536510348842-6cae3b3a37c5?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 5,
    name: "BLUE EMOTION",
    price: "Rp 60.000",
    rating: 4.5,
    tag: "best",
    image:
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 6,
    name: "VANILLA",
    price: "Rp 60.000",
    rating: 4.5,
    tag: "best",
    image:
      "https://images.unsplash.com/photo-1600180758890-6b94519a1f1e?auto=format&fit=crop&w=600&q=60",
  },
];

import { router } from "expo-router";
import { useState } from "react";
import { useWishlist } from "../store/useWishlist";

export default function Product() {
  const [activeFilter, setActiveFilter] = useState("all");

  const wishlist = useWishlist((state) => state.items);
  const addWishlist = useWishlist((state) => state.addToWishlist);
  const removeWishlist = useWishlist((state) => state.removeFromWishlist);

  const filteredProducts =
    activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.tag === activeFilter);

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
        <TouchableOpacity
          style={
            activeFilter === "all" ? styles.filterActive : styles.filterButton
          }
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={
              activeFilter === "all"
                ? styles.filterActiveText
                : styles.filterText
            }
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            activeFilter === "new" ? styles.filterActive : styles.filterButton
          }
          onPress={() => setActiveFilter("new")}
        >
          <Text
            style={
              activeFilter === "new"
                ? styles.filterActiveText
                : styles.filterText
            }
          >
            New
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            activeFilter === "best" ? styles.filterActive : styles.filterButton
          }
          onPress={() => setActiveFilter("best")}
        >
          <Text
            style={
              activeFilter === "best"
                ? styles.filterActiveText
                : styles.filterText
            }
          >
            Best Seller
          </Text>
        </TouchableOpacity>
      </View>

      {/* PRODUCT GRID */}
      <View style={styles.grid}>
        {filteredProducts.map((item) => {
          // CEK APAKAH SUDAH ADA DI WISHLIST
          const isFavorited = wishlist.some((w) => w.id === item.id);

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
              <Image source={{ uri: item.image }} style={styles.productImage} />

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

              {/* PRICE */}
              <Text style={styles.price}>{item.price}</Text>

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
