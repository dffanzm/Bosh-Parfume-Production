import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { apiService } from "../services/api";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 40;

// --- CARD COMPONENT ---
const ProductCard = ({ item, index, router }: any) => {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const handleHoverIn = () => {
    scale.value = withSpring(1.03);
    shadowOpacity.value = withTiming(0.3);
  };

  const handleHoverOut = () => {
    scale.value = withSpring(1);
    shadowOpacity.value = withTiming(0.1);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .springify()
        .damping(12)}
      style={[{ width: "48%" }, animatedStyle]}
    >
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={() =>
          router.push({
            pathname: "/screens/DetailProduct",
            params: { data: JSON.stringify(item) },
          })
        }
      >
        <Image
          source={{ uri: item.feature_image_url || item.image_url }}
          style={styles.cardImage}
        />
        <View style={styles.nameOverlay}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function HomePage() {
  const router = useRouter();
  const bannerRef = useRef<FlatList>(null);

  // LOGIC BALAPAN: Kita butuh REF buat nyimpen posisi tanpa memicu re-render
  const currentIndexRef = useRef(0);

  const [activeBanner, setActiveBanner] = useState(0);
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

  // --- LOGIC AUTOPLAY (MODE BALAPAN / NO RESET) ---
  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const interval = setInterval(() => {
      // 1. Ambil posisi terakhir dari REF (bukan dari State)
      // Ini biar timer jalan terus tanpa peduli state lagi di-update user
      let nextIndex = currentIndexRef.current + 1;

      if (nextIndex >= banners.length) {
        nextIndex = 0;
      }

      // 2. Paksa Geser
      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      // 3. Update Ref & State
      currentIndexRef.current = nextIndex;
      setActiveBanner(nextIndex);
    }, 4000); // 4 Detik

    // CLEANUP: Cuma jalan pas component mati (unmount).
    // GAK ADA reset pas user geser. Balapan gas pol!
    return () => clearInterval(interval);
  }, [banners.length]); // <--- Dependency cuma banners.length. GAK ADA activeBanner.

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const HomeHeader = () => (
    <View style={{ marginBottom: 20 }}>
      <View style={{ marginBottom: 15 }}>
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
          // Pas user geser manual, kita update Ref juga biar timer gak "kaget" banget
          // Tapi timer GAK KIITA RESET.
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / BANNER_WIDTH
            );
            setActiveBanner(index);
            currentIndexRef.current = index; // Update info lokasi buat si Timer
          }}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              bannerRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          renderItem={({ item }) => (
            <View style={{ width: BANNER_WIDTH }}>
              <Image source={{ uri: item.image_url }} style={styles.hero} />
            </View>
          )}
        />
      </View>
      <Text style={styles.sectionTitle}>Featured Products</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={HomeHeader}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        renderItem={({ item, index }) => (
          <ProductCard item={item} index={index} router={router} />
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
  hero: {
    width: BANNER_WIDTH,
    height: 200,
    borderRadius: 16,
    resizeMode: "cover",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
    color: "#1a1a1a",
  },
  card: {
    width: "100%",
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
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
