import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// --- DATA TEAM ---
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Farhan Munir Rahmatullah",
    role: "Owner",
    image:
      "https://ui-avatars.com/api/?name=Farhan+Munir&background=random&color=fff&size=200",
    isMe: true,
  },
  {
    id: 2,
    name: "Daffa Najmudin Hanif",
    role: "Lead Dev + Backend Dev",
    image: "https://avatars.githubusercontent.com/u/9919?s=400&v=4",
    isMe: true,
  },
  {
    id: 3,
    name: "Danu Trisna Juwana",
    role: "Frontend Dev",
    image:
      "https://ui-avatars.com/api/?name=Danu+Trisna&background=random&color=fff&size=200",
    isMe: true,
  },
  {
    id: 4,
    name: "Azka Assetya Defano",
    role: "UI/UX Designer",
    image:
      "https://ui-avatars.com/api/?name=Azka+Assetya&background=random&color=fff&size=200",
    isMe: true,
  },
];

export default function Developer() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.replace("/screens/HomePage");
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Error", err));
  };

  // --- GENERATE PARTIKEL (STARS) ---
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100, // Posisi Top (%)
      left: Math.random() * 100, // Posisi Left (%)
      size: Math.random() * 3 + 1, // Ukuran 1-4px
      opacity: Math.random() * 0.6 + 0.1, // Opacity 0.1 - 0.7
    }));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* BACKGROUND PARTICLES (STARS) */}
      <View style={styles.particleContainer}>
        {particles.map((p) => (
          <View
            key={p.id}
            style={{
              position: "absolute",
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: "#fff",
              opacity: p.opacity,
            }}
          />
        ))}
      </View>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.headerTitle}
        >
          Bosh Mobile Dev Team
        </Animated.Text>
        <View style={{ width: 40 }} />
      </View>

      {/* LIST TEAM */}
      <FlatList
        data={TEAM_MEMBERS}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(400 + index * 100).springify()}
            style={[styles.glassCard, item.isMe && styles.myCardHighlight]}
          >
            {/* FOTO LEBIH GEDE (110px) */}
            <View style={styles.bigImageContainer}>
              <Image source={{ uri: item.image }} style={styles.bigImage} />
            </View>

            {/* INFO TENGAH (CENTERED) */}
            <View style={styles.infoContainer}>
              {/* Nama & Role */}
              <View style={styles.textGroup}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.role}>{item.role}</Text>
              </View>

              {/* Social Icons */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  onPress={() => openLink("https://instagram.com")}
                  style={styles.iconBtn}
                >
                  <Ionicons name="logo-instagram" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openLink("https://github.com")}
                  style={styles.iconBtn}
                >
                  <Ionicons name="logo-github" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        ListFooterComponent={
          <Animated.Text
            entering={FadeInUp.delay(1000).duration(600)}
            style={styles.footerQuote}
          >
            "DESIGNED & DEVELOPED BY BOSH TEAM"
          </Animated.Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505", // Hitam Pekat
  },

  // Container buat partikel biar di belakang semua konten
  particleContainer: {
    ...StyleSheet.absoluteFillObject, // Full screen absolute
    zIndex: -1,
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
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#fff",
    letterSpacing: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 50,
  },

  // --- GLASS CARD ---
  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    // Warna card lebih gelap dikit biar kontras sama bintang
    backgroundColor: "rgba(20, 20, 20, 0.6)",
    marginBottom: 20,
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)", // Border agak terang dikit
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  myCardHighlight: {
    backgroundColor: "rgba(40, 40, 40, 0.8)", // Highlight lu
    borderColor: "rgba(255, 255, 255, 0.4)",
  },

  // --- FOTO BESAR ---
  bigImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "#222",
  },
  bigImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // --- INFO ---
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    height: 110,
  },

  textGroup: {
    marginBottom: 10,
  },

  name: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  role: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },

  // SOCIAL ICONS
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  footerQuote: {
    textAlign: "center",
    color: "rgba(255,255,255,0.3)",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 40,
  },
});
