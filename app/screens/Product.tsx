import { StyleSheet, Text, View } from "react-native";

export default function Product() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Product Page</Text>
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
