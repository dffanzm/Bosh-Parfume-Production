import { WifiOff } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NoInternetProps {
  onRetry: () => void;
}

export default function NoInternet({ onRetry }: NoInternetProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <WifiOff size={64} color="#94A3B8" />
      </View>

      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.description}>
        Ups, kamu gak punya akses internet nih.{"\n"}Hubungin ke internet ya
        biar bisa liat produk ter-update kami.
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    // Kita biarkan flex: 1 yang bekerja tanpa butuh variabel height di sini
  },
  iconWrapper: {
    width: 120,
    height: 120,
    backgroundColor: "#F1F5F9",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#1E293B",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
});
