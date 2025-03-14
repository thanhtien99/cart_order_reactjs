import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListProduct from '@/app/components/product/list_product';
import { useRouter } from "expo-router";
import { useAuth } from '@/context/authContext';
import { useCartContext } from '@/context/addCart';
import socket from "@/app/socket";

export default function Header() {
  const router = useRouter();
  const {isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();
  const { cart, setCart } = useCartContext();

  //Socket
  useEffect(() => {
    if(isAuthenticated){
      socket.on("update-cart-qty", (cart) => {
        setCart(cart);
    });
    }
  }, []);

  return (
    <>
      {/* Thanh tìm kiếm + Icon giỏ hàng */}
      <View style={styles.header}>
          <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
              style={styles.searchBar}
              placeholder="Tìm kiếm sản phẩm..."
              placeholderTextColor="#888"
          />
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={() => router.push("/components/cart/cart")}>
          <Ionicons name="cart-outline" size={28} color="#fff" />
          { cart ? (
              <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart}</Text>
              </View>
          ) : <></>
          }
          </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ff4500',
    paddingVertical: 10,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  cartButton: {
    marginLeft: 10,
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'red',
    fontSize: 12,
    fontWeight: "bold"
  },
});
