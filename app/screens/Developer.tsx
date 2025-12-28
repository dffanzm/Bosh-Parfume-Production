import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// 1. IMPORT BLURVIEW
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../services/api";

const { width } = Dimensions.get("window");

interface Developer {
  id: number;
  nama: string;
  jobdesk: string;
  foto: string;
  ig_url?: string;
  github_url?: string;
  linkedin_url?: string;
}

const CODE_SNIPPETS = [
  "const dev = 'BOSH';",
  "import Future from 'now';",
  "console.log('Level Up');",
  "return <Success />;",
  "if (bug) fixIt();",
  "git push --force",
  "npm install power",
  "200 OK",
  "while(coding) { coffee() }",
  "const styles = StyleSheet.create({})",
  "async function dominate()",
  "System.out.println('Hello')",
  "sudo make me a sandwich",
  "=> () => {}",
  "opacity: 100%",
  "zIndex: 9999",
];

const CodeParticle = ({ text, style }: { text: string; style: any }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-40, {
        duration: Math.random() * 4000 + 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.Text style={[style, animatedStyle]}>{text}</Animated.Text>;
};

export default function Developer() {
  const router = useRouter();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        const data = await apiService.getDevelopers();
        setDevelopers(data);
      } catch (error) {
        console.error("Gagal load developer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevs();
  }, []);

  const handleBackToHome = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/screens/HomePage");
    }
  };

  const openLink = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error("Error link", err));
    }
  };

  const bgCodes = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      fontSize: Math.random() * 14 + 12,
      // Opacity Agak Tebal biar keliatan efek blurnya nanti
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* BACKGROUND ANIMASI CODING */}
      <View style={styles.codeBackground}>
        {bgCodes.map((code) => (
          <CodeParticle
            key={code.id}
            text={code.text}
            style={{
              position: "absolute",
              top: `${code.top}%`,
              left: `${code.left}%`,
              fontSize: code.fontSize,
              opacity: code.opacity,
              color: "#39FF14",
              fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
              fontWeight: "bold",
              textShadowColor: "rgba(57, 255, 20, 0.5)",
              textShadowRadius: 5,
            }}
          />
        ))}
      </View>

      <View style={styles.bgOverlay} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.headerTitle}
        >
          Dev Team
        </Animated.Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#39FF14" />
        </View>
      ) : (
        <FlatList
          data={developers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            // WRAPPER ANIMASI
            <Animated.View
              entering={FadeInUp.delay(400 + index * 100).springify()}
              style={styles.cardWrapper} // Style container buat border radius & shadow
            >
              {/* 3. BLUR VIEW (REAL GLASS EFFECT) 
                  intensity: Seberapa nge-blur (0-100)
                  tint: Warna dasar kaca (dark, light, default)
              */}
              <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                {/* FOTO */}
                <View style={styles.bigImageContainer}>
                  <Image source={{ uri: item.foto }} style={styles.bigImage} />
                </View>

                {/* INFO */}
                <View style={styles.infoContainer}>
                  <View style={styles.textGroup}>
                    <Text style={styles.name}>{item.nama}</Text>
                    <Text style={styles.role}>{item.jobdesk}</Text>
                  </View>

                  {/* Social Icons */}
                  <View style={styles.socialRow}>
                    {item.ig_url && (
                      <TouchableOpacity
                        onPress={() => openLink(item.ig_url)}
                        style={styles.iconBtn}
                      >
                        <Ionicons
                          name="logo-instagram"
                          size={18}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    )}
                    {item.github_url && (
                      <TouchableOpacity
                        onPress={() => openLink(item.github_url)}
                        style={styles.iconBtn}
                      >
                        <Ionicons name="logo-github" size={18} color="#fff" />
                      </TouchableOpacity>
                    )}
                    {item.linkedin_url && (
                      <TouchableOpacity
                        onPress={() => openLink(item.linkedin_url)}
                        style={styles.iconBtn}
                      >
                        <Ionicons name="logo-linkedin" size={18} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </BlurView>
            </Animated.View>
          )}
          ListFooterComponent={
            <Animated.Text
              entering={FadeInUp.delay(1000).duration(600)}
              style={styles.footerQuote}
            >
              "<code> &lt;/&gt; WITH BOSH ENERGY </code>"
            </Animated.Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  codeBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -2,
    overflow: "hidden",
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowRadius: 10,
  },
  listContent: {
    padding: 20,
    paddingBottom: 50,
  },

  // --- STYLE UNTUK BLUR VIEW ---
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden", // Wajib biar blurnya gak bocor keluar radius
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)", // Border terang
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },

  blurContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    // Warna tambahan biar makin 'Terang' di atas Blur Dark
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  // --- ELEMEN DALAM CARD ---
  bigImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "#111",
  },
  bigImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  textGroup: {
    marginBottom: 8,
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 2,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 2,
  },
  role: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 11,
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "800",
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  footerQuote: {
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 11,
    marginTop: 20,
    marginBottom: 40,
  },
});
