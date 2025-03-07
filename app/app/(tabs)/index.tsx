import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListProduct from '@/components/product/ListProduct';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <ListProduct />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Tránh bị che bởi thanh trạng thái
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
});
