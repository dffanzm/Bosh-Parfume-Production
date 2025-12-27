import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../services/api";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 40;

export default function HomePage() {
  const router = useRouter();
  const bannerRef = useRef<FlatList>(null);
  const [activeBanner, setActiveBanner] = useState(0);

  // STATE DATA API
  const [banners, setBanners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, productData] = await Promise.all([
          apiService.getBanners(),
          apiService.getProducts(),
        ]);
        setBanners(bannerData);
        setProducts(productData);
      } catch (error) {
        console.error("Gagal load home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- AUTOPLAY ---------- */
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex =
        activeBanner === banners.length - 1 ? 0 : activeBanner + 1;

      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveBanner(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBanner, banners]);

  // LOADING VIEW
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ================= BANNER SLIDER ================= */}
      <FlatList
        ref={bannerRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(_, index) => ({
          length: BANNER_WIDTH,
          offset: BANNER_WIDTH * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / BANNER_WIDTH
          );
          setActiveBanner(index);
        }}
        renderItem={({ item }) => (
          // PAKE URI KARENA DARI INTERNET
          <Image source={{ uri: item.image_url }} style={styles.hero} />
        )}
      />

      {/* ---------------- DOT INDICATOR ---------------- */}
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: i === activeBanner ? 1 : 0.25 }]}
          />
        ))}
      </View>

      {/* ================= FEATURED ================= */}
      <Text style={styles.sectionTitle}>Featured Products</Text>

      {/* ================= PRODUCT GRID ================= */}
      <FlatList
        data={products.slice(0, 4)} // Ambil 4 teratas aja
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/screens/DetailProduct",
                params: { data: JSON.stringify(item) },
              })
            }
          >
            {/* PAKE URI KARENA DARI INTERNET */}
            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 20,
  },

  /* ---------- Banner ---------- */
  hero: {
    width: BANNER_WIDTH,
    height: 220,
    borderRadius: 16,
    marginTop: 16,
    marginRight: 12,
    resizeMode: "cover",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000",
    marginHorizontal: 4,
  },

  /* ---------- Section ---------- */
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
  },

  /* ---------- Product Card ---------- */
  card: {
    width: "48%",
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#fff",
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});