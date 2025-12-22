import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 40;

export default function HomePage() {
  const router = useRouter();
  const bannerRef = useRef<FlatList>(null);
  const [activeBanner, setActiveBanner] = useState(0);

  /* ---------- BANNER DATA ---------- */
  const banners = [
    require("../../assets/banner-1.png"),
    require("../../assets/banner-2.png"),
    require("../../assets/banner-3.png"),
  ];

  /* ---------- PRODUCT DATA ---------- */
  const products = [
    { id: "1", image: require("../../assets/bubble-gum.png") },
    { id: "2", image: require("../../assets/jlo-still.png") },
    { id: "3", image: require("../../assets/bulgari-aqua.png") },
    { id: "4", image: require("../../assets/vc-so-sexy.png") },
  ];

  /* ---------- AUTOPLAY ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        activeBanner === banners.length - 1
          ? 0
          : activeBanner + 1;

      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveBanner(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBanner]);

  return (
    <View style={styles.container}>
      {/* ================= BANNER SLIDER ================= */}
      <FlatList
        ref={bannerRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
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
          <Image source={item} style={styles.hero} />
        )}
      />

      {/* ---------------- DOT INDICATOR ---------------- */}
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: i === activeBanner ? 1 : 0.25 },
            ]}
          />
        ))}
      </View>

      {/* ================= FEATURED ================= */}
      <Text style={styles.sectionTitle}>Featured Products</Text>

      {/* ================= PRODUCT GRID ================= */}
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push(`/screens/Product?id=${item.id}`)
            }
          >
            <Image source={item.image} style={styles.cardImage} />
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
