import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { apiService } from "../services/api";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 40;
const CACHE_KEYS = {
  BANNERS: "cache_banners",
  PRODUCTS: "cache_products",
};

// --- 1. PRODUCT CARD ---
const ProductCard = React.memo(({ item, index, router }: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(18)
        .stiffness(80)}
      style={[{ width: "48%" }, animatedStyle]}
    >
      <Pressable
        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.9 : 1 }]}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
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
});
ProductCard.displayName = "ProductCard";

// --- 2. HEADER COMPONENT ---
const HomeHeader = React.memo(
  ({ banners, bannerRef, onMomentumScrollEnd }: any) => {
    return (
      <View style={{ marginBottom: 20 }}>
        <View style={{ marginBottom: 15 }}>
          <FlatList
            ref={bannerRef}
            data={banners}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            getItemLayout={(_, index) => ({
              length: BANNER_WIDTH,
              offset: BANNER_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={onMomentumScrollEnd}
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
  }
);
HomeHeader.displayName = "HomeHeader";

export default function HomePage() {
  const router = useRouter();
  const bannerRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);

  // STATE UTAMA
  const [banners, setBanners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cachedBanners = await AsyncStorage.getItem(CACHE_KEYS.BANNERS);
        const cachedProducts = await AsyncStorage.getItem(CACHE_KEYS.PRODUCTS);

        if (cachedBanners && cachedProducts) {
          setBanners(JSON.parse(cachedBanners));
          setProducts(JSON.parse(cachedProducts));
          setLoading(false);
          return;
        }
      }

      const [bannerData, productData] = await Promise.all([
        apiService.getBanners(),
        apiService.getProducts(),
      ]);

      setBanners(bannerData);
      setProducts(productData);

      await AsyncStorage.setItem(
        CACHE_KEYS.BANNERS,
        JSON.stringify(bannerData)
      );
      await AsyncStorage.setItem(
        CACHE_KEYS.PRODUCTS,
        JSON.stringify(productData)
      );
    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const handleScrollEnd = useCallback((e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    currentIndexRef.current = index;
    // setActiveBanner dihapus agar tidak memicu re-render global saat scroll manual
  }, []);

  // --- LOGIC AUTOPLAY (TANPA RE-RENDER STATE) ---
  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndexRef.current + 1;
      if (nextIndex >= banners.length) nextIndex = 0;

      bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      currentIndexRef.current = nextIndex;
    }, 4500);

    return () => clearInterval(interval);
  }, [banners]);

  const headerComponent = useMemo(
    () => (
      <HomeHeader
        banners={banners}
        bannerRef={bannerRef}
        onMomentumScrollEnd={handleScrollEnd}
      />
    ),
    [banners, handleScrollEnd]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={headerComponent}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
          />
        }
        renderItem={({ item, index }) => (
          <ProductCard item={item} index={index} router={router} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7", paddingHorizontal: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: {
    width: BANNER_WIDTH,
    height: 200,
    borderRadius: 20,
    resizeMode: "cover",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 12,
    color: "#1a1a1a",
  },
  card: {
    width: "100%",
    height: 220,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    ...Platform.select({ web: { cursor: "pointer" } }),
  },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  nameOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  productName: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
