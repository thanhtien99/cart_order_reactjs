import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EmptyCart = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AntDesign name="shoppingcart" size={64} color="#ccc" />

      <Text style={styles.text}>Giỏ hàng trống</Text>

      <TouchableOpacity onPress={() => router.push("/")} style={styles.button}>
        <Text style={styles.buttonText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff5722",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmptyCart;
