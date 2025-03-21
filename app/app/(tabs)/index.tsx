import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListProduct from '@/app/components/product/list_product';
import Header from '@/app/components/layout/header';
import { useRouter } from "expo-router";
import { useAuth } from '@/context/authContext';
import { useCartContext } from '@/context/addCart';

export default function HomeScreen() {
  const router = useRouter();
  const {isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();
  const { cart } = useCartContext();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />
      {/* Danh sách sản phẩm */}
      <ListProduct />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ff4500',
    paddingVertical: 10,
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
