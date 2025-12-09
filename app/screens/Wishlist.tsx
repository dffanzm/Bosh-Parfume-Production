import { StyleSheet, Text, View } from "react-native";

export default function Wishlist() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wishlist Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
