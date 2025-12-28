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
import Animated, { FadeInDown } from "react-native-reanimated";
import { apiService } from "../services/api";

const { width } = Dimensions.get("window");
// Container Padding 20 kanan kiri, jadi width banner dikurang 40
const BANNER_WIDTH = width - 40;

export default function HomePage() {
  const router = useRouter();
  const bannerRef = useRef<FlatList>(null);

  // State untuk Data
  const [banners, setBanners] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Banner
  const [activeBanner, setActiveBanner] = useState(0);

  // --- LOGIC BARU BIAR DOT GAK NABRAK ---
  const currentIndexRef = useRef(0); // Ref buat nyimpen index real-time
  const isInteracting = useRef(false); // Ref buat deteksi sentuhan user

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, featuredData] = await Promise.all([
          apiService.getBanners(),
          apiService.getFeaturedProducts(),
        ]);
        setBanners(bannerData);
        setFeaturedProducts(featuredData);
      } catch (error) {
        console.error("Gagal load home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // AUTOPLAY BANNER (LOGIC FIX)
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      // Kalau user lagi nyentuh/geser, jangan auto scroll
      if (isInteracting.current) return;

      // Hitung next index dari Ref (bukan state, biar akurat)
      const nextIndex =
        currentIndexRef.current === banners.length - 1
          ? 0
          : currentIndexRef.current + 1;

      // Scroll
      bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });

      // Update data
      setActiveBanner(nextIndex);
      currentIndexRef.current = nextIndex;
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]); // Dependency cuma banners, gak perlu activeBanner biar gak reset terus

  // Handle saat user selesai geser manual
  const handleScrollEnd = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / BANNER_WIDTH);

    // Update state & ref biar sinkron
    setActiveBanner(index);
    currentIndexRef.current = index;
    isInteracting.current = false; // User selesai interaksi
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // --- HEADER (BANNER & TITLE) ---
  const HomeHeader = () => (
    <View style={{ marginBottom: 20 }}>
      {/* BANNER AREA */}
      <View style={styles.bannerWrapper}>
        <FlatList
          ref={bannerRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          // Layout Calculation (Penting buat scrollToIndex)
          getItemLayout={(_, index) => ({
            length: BANNER_WIDTH,
            offset: BANNER_WIDTH * index,
            index,
          })}
          // Handle Error kalau scroll kecepetan/belum siap
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              bannerRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          // Deteksi User Interaksi (Biar gak rebutan sama Timer)
          onScrollBeginDrag={() => {
            isInteracting.current = true;
          }}
          onScrollEndDrag={() => {
            isInteracting.current = false;
          }}
          // Update saat scroll berhenti (manual swipe)
          onMomentumScrollEnd={handleScrollEnd}
          snapToInterval={BANNER_WIDTH}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <View style={{ width: BANNER_WIDTH, height: 200 }}>
              <Image source={{ uri: item.image_url }} style={styles.hero} />
            </View>
          )}
        />

        {/* DOTS INDICATOR */}
        <View style={styles.dotsContainer}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeBanner ? "#fff" : "rgba(255,255,255,0.4)",
                  width: i === activeBanner ? 20 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* TITLE */}
      <View style={{ marginTop: 25 }}>
        <Text style={styles.sectionTitle}>Featured Collection</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={featuredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={HomeHeader}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No featured products yet.</Text>
        }
        renderItem={({ item, index }) => (
          // Animasi FadeInDown tetep dipake biar smooth
          <Animated.View
            entering={FadeInDown.delay(index * 100)
              .springify()
              .damping(12)}
            style={{ width: "48%" }}
          >
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
              <Image
                source={{ uri: item.feature_image_url }}
                style={styles.cardImage}
              />
              <View style={styles.nameOverlay}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontFamily: "Poppins-Regular",
  },

  /* --- BANNER STYLE --- */
  bannerWrapper: {
    marginTop: 10,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  hero: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#1a1a1a",
  },

  /* --- CARD STYLE (LIFTED SHADOW / 2 SUDUT) --- */
  card: {
    width: "100%",
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 20,

    // SHADOW 2 SUDUT (KANAN & BAWAH)
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Android Elevation
    elevation: 4,

    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  nameOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  productName: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
