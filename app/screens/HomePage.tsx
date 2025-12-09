import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomePage() {
  const router = useRouter();

  const data = [
    {
      id: "1",
      title: "iPhone 14 Pro",
      price: "$999",
      image: "https://i.imgur.com/3h3QbJF.png",
    },
    {
      id: "2",
      title: "Samsung S23 Ultra",
      price: "$1199",
      image: "https://i.imgur.com/C9pR0Gx.png",
    },
    {
      id: "3",
      title: "iPad Mini 6",
      price: "$599",
      image: "https://i.imgur.com/5PRqYpS.png",
    },
    {
      id: "4",
      title: "Macbook Air M2",
      price: "$1099",
      image: "https://i.imgur.com/O2LhJtX.png",
    },
  ];

  return (
    <View style={styles.container}>
      {/* ======================= */}
      {/* 🔥 Section 1 - Banner   */}
      {/* ======================= */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Welcome Back 👋</Text>
        <Text style={styles.subBanner}>Find your next favorite gadget.</Text>
      </View>

      {/* ======================= */}
      {/* 🔥 Section 2 - Featured */}
      {/* ======================= */}
      <Text style={styles.sectionTitle}>Featured Products</Text>

      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/screens/Product?id=${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardPrice}>{item.price}</Text>
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

  /* ---------------- Banner Section ---------------- */
  banner: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  bannerText: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
  },
  subBanner: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
    color: "#555",
  },

  /* ---------------- Featured Section ---------------- */
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    marginBottom: 12,
  },

  /* ---------------- Product Cards ---------------- */
  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  cardTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginTop: 8,
  },
  cardPrice: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#3D7BFF",
    marginTop: 2,
  },
});
