import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "@/context/authContext";
import { getOrder } from "@/services/cart";

const Order = () => {
  const [orderList, setOrderList] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isAuthenticated) {
          const response = await getOrder(user);
          const orders = response.data.orders;
          const orderItems = response.data.order_items;

          const ordersWithItems = orders.map((order: any) => {
            const itemsForOrder = orderItems
              .filter((item: any) => item.order.toString() === order._id.toString())
              .map((item: any) => ({
                ...item,
                product: item.product || {},
              }));
            return { ...order, items: itemsForOrder };
          });

          setOrderList(ordersWithItems);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  return (
    <>
      <Stack.Screen options={{ title: "Đơn hàng đã mua" }} />
      <View style={styles.container}>
        <FlatList
          data={orderList}
          keyExtractor={(order) => order._id}
          renderItem={({ item: order }) => (
            <View style={styles.orderContainer}>
              <View style={styles.shopHeader}>
                <Text style={styles.successText}><AntDesign name="checkcircle" size={16} color="green" />   Hoàn thành</Text>
                <Text style={styles.dateText}>
                    {new Date(order.createdAt).toLocaleString()}
                </Text>
              </View>
              {order.items.map((item) => (
                <View key={item._id} style={styles.cartItem}>
                  <Image source={{ uri: item.product.thumbnail }} style={styles.image} resizeMode="contain" />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.product.name}</Text>

                    <View style={styles.info_price}>
                        <Text style={styles.quantity}>SL: {item.quantity}</Text>
                        <Text style={styles.price}>{item.product.price.toLocaleString()}đ</Text>
                    </View>
                    
                  </View>
                </View>
              ))}
              <View style={styles.footer}>
                <Text style={styles.total}>Tổng tiền: {(order.items.reduce((total: any, item: any) => total + item.total_price, 0)).toLocaleString()}đ</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Mua lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 8,
  },
  orderContainer: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  shopHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  shopTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  successText: {
    fontSize: 14,
    color: "green",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  info_price: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "400",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4500",
  },
  buyButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ff4500"
  },
  buyButtonText: {
    color: "#ff4500",
    fontSize: 16,
    fontWeight: "700",
  },
  dateText:{
    fontWeight: "bold",
  }
});

export default Order;
