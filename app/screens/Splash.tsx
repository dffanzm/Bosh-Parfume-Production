import { router } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/Welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/bosh-dark.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
});
