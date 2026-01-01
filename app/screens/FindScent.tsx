import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  Layout,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { apiService } from "../services/api";
import { formatCurrency } from "../utils/currency";

// --- GLOBAL VARIABLE ---
let hasShownIntro = false;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  top_note?: string;
  middle_note?: string;
  base_note?: string;
  image_url: string;
  feature_image_url?: string;
  rating?: number;
}

export default function FindScent() {
  const router = useRouter();

  // --- STATE ---
  const [viewState, setViewState] = useState<"intro" | "search">(
    hasShownIntro ? "search" : "intro"
  );

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [uniqueNotes, setUniqueNotes] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // --- ANIMATION VALUES ---
  const introOpacity = useSharedValue(hasShownIntro ? 0 : 1);
  const splitProgress = useSharedValue(hasShownIntro ? 1 : 0);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const initData = async () => {
      try {
        const products = await apiService.getProductsByTag("all");
        setAllProducts(products);

        const notesSet = new Set<string>();
        products.forEach((p: Product) => {
          const combined = `${p.top_note},${p.middle_note},${p.base_note}`;
          combined.split(",").forEach((note) => {
            const cleanNote = note.trim();
            if (cleanNote && cleanNote !== "-" && cleanNote.length > 2) {
              notesSet.add(cleanNote);
            }
          });
        });

        const shuffled = Array.from(notesSet).sort(() => 0.5 - Math.random());
        setUniqueNotes(shuffled.slice(0, 15));
      } catch (e) {
        console.error("Gagal load data", e);
      }
    };
    initData();
  }, []);

  // --- 2. CINEMATIC SPLIT ACTION ---
  const handleGetStarted = () => {
    hasShownIntro = true;
    introOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setViewState("search");
      splitProgress.value = withTiming(1, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, 200);
  };

  // --- 3. SMART SEARCH LOGIC ---
  useEffect(() => {
    if (viewState !== "search") return;

    if (searchText.trim() === "") {
      setResults([]);
      return;
    }

    const lowerQuery = searchText.toLowerCase();
    const secretKeywords = [
      "siapa developernya",
      "siapa pembuat",
      "siapa yang buat",
      "siapa yang bikin",
      "developer",
      "creator",
    ];

    const isSecret = secretKeywords.some((keyword) =>
      lowerQuery.includes(keyword)
    );

    if (isSecret) {
      setSearchText("");
      router.push("/screens/Developer");
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const searchKeywords = lowerQuery
        .split(/[\s,]+/)
        .filter((k) => k.length > 0);

      const filtered = allProducts.filter((p) => {
        const combinedText = `
          ${p.name} 
          ${p.description || ""} 
          ${p.top_note || ""} 
          ${p.middle_note || ""} 
          ${p.base_note || ""}
        `.toLowerCase();

        return searchKeywords.every((keyword) =>
          combinedText.includes(keyword)
        );
      });

      setResults(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, viewState, allProducts, router]); // Dependency lengkap buat linting

  const addNoteToInput = (note: string) => {
    const newText = searchText ? `${searchText}, ${note}` : note;
    setSearchText(newText);
  };

  // --- ANIMATED STYLES ---
  const introStyle = useAnimatedStyle(() => ({
    opacity: introOpacity.value,
    transform: [{ scale: interpolate(introOpacity.value, [0, 1], [0.9, 1]) }],
  }));

  const topSplitterStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          splitProgress.value,
          [0, 1],
          [0, -SCREEN_HEIGHT / 2]
        ),
      },
    ],
  }));

  const bottomSplitterStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          splitProgress.value,
          [0, 1],
          [0, SCREEN_HEIGHT / 2]
        ),
      },
    ],
  }));

  const searchContainerStyle = useAnimatedStyle(() => ({
    opacity: splitProgress.value,
  }));

  return (
    <View style={styles.container}>
      {/* === VIEW 1: INTRO === */}
      {viewState === "intro" && (
        <Animated.View style={[styles.introContainer, introStyle]}>
          <View style={styles.iconWrapper}>
            <Ionicons name="sparkles" size={40} color="#000" />
          </View>
          <Text style={styles.title}>Find Your Signature</Text>
          <Text style={styles.subtitle}>
            Bingung pilih wangi? Biarkan AI kami membantu menemukan jodoh
            parfummu berdasarkan notes favoritmu.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.startText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* === VIEW 2: SPLIT SCREEN SEARCH === */}
      {viewState === "search" && (
        <View style={styles.searchWrapperFull}>
          <Animated.View style={[styles.splitterTop, topSplitterStyle]} />
          <Animated.View style={[styles.splitterBottom, bottomSplitterStyle]} />

          <Animated.View style={[styles.searchContainer, searchContainerStyle]}>
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <Text style={styles.question}>Lagi nyari wangi kaya gimana?</Text>

              <Text style={styles.subQuestion}>
                Ketik wangi (misal: Vanilla, Rose) atau pilih dari bubbles di
                bawah.
              </Text>
            </Animated.View>

            <Animated.View
              style={styles.inputWrapper}
              entering={FadeInDown.delay(450).duration(500)}
            >
              <Ionicons name="search" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Ex: Rose, Vanilla, Woody..."
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            </Animated.View>

            <View style={{ height: 50, marginBottom: 15 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipContainer}
              >
                {uniqueNotes.map((note, index) => (
                  <Animated.View
                    key={note}
                    entering={FadeInDown.delay(600 + index * 60).duration(400)}
                    layout={Layout.duration(400)}
                    style={{ marginRight: 8 }}
                  >
                    <TouchableOpacity
                      style={styles.chip}
                      onPress={() => addNoteToInput(note)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.chipText}>{note}</Text>
                      <Ionicons name="add" size={12} color="#666" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.resultArea}>
              {loading ? (
                <View style={{ marginTop: 50 }}>
                  <ActivityIndicator size="large" color="#000" />
                  <Text style={styles.loadingText}>Mencocokkan aroma...</Text>
                </View>
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  ListEmptyComponent={
                    searchText.length > 2 ? (
                      <Text style={styles.emptyText}>
                        Wangi &quot;{searchText}&quot; belum ada nih.
                      </Text>
                    ) : null
                  }
                  renderItem={({ item, index }) => (
                    <Animated.View
                      entering={FadeInUp.delay(index * 100).duration(500)}
                      style={styles.resultCard}
                    >
                      <TouchableOpacity
                        style={styles.cardInner}
                        onPress={() =>
                          router.push({
                            pathname: "/screens/DetailProduct",
                            params: { data: JSON.stringify(item) },
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.image_url }}
                          style={styles.cardImage}
                        />
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardName}>{item.name}</Text>
                          <Text style={styles.cardNotes} numberOfLines={2}>
                            {item.top_note}, {item.middle_note}
                          </Text>
                          <Text style={styles.cardPrice}>
                            {formatCurrency(item.price)}
                          </Text>
                        </View>
                        <View style={styles.arrowBtn}>
                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#000"
                          />
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                />
              )}
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchWrapperFull: { flex: 1, position: "relative" },

  splitterTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT / 2,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  splitterBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT / 2,
    backgroundColor: "#fff",
    zIndex: 10,
  },

  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "#F5F5F7",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#000",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  startText: { fontFamily: "Poppins-SemiBold", color: "#fff", fontSize: 16 },

  searchContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  question: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000",
    marginBottom: 5,
  },
  subQuestion: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#888",
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#000",
  },
  chipContainer: { alignItems: "center", paddingRight: 20 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 6,
  },
  chipText: { fontFamily: "Poppins-Medium", fontSize: 12, color: "#444" },
  resultArea: { flex: 1 },
  loadingText: {
    textAlign: "center",
    marginTop: 15,
    fontFamily: "Poppins-Medium",
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Poppins-Regular",
    color: "#aaa",
  },
  resultCard: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardInner: { flexDirection: "row", alignItems: "center", padding: 12 },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardName: { fontFamily: "Poppins-SemiBold", fontSize: 15, color: "#000" },
  cardNotes: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  cardPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#d27b4a",
    marginTop: 4,
  },
  arrowBtn: { padding: 10 },
});
