import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useAuth } from '@/context/authContext';
import { useCartContext } from '@/context/addCart';
import socket from "@/app/socket";
import { searchProducts } from '@/services/product';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, setCart } = useCartContext();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  //Socket
  useEffect(() => {
    if (isAuthenticated) {
      socket.on("update-cart-qty", (cart) => {
        setCart(cart);
      });
    }
  }, []);

  const handleSearchChange = async (value: string) => {
    setKeyword(value);

    if (value.length > 1) {
      const result = await searchProducts(value);
      if (result.success) {
        setSuggestions(result.products);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (product : any) => {
    setKeyword("");
    setSuggestions([]);
    router.push({ pathname: '/components/product/[id]', params: { id: product._id } });
  };

  return (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#888"
          value={keyword}
          onChangeText={handleSearchChange}
        />
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
              <Image source={{ uri: item.thumbnail }} style={styles.suggestionImage} />
              <View>
                <Text style={styles.suggestionName}>{item.name}</Text>
                <Text style={styles.suggestionPrice}>{item.price.toLocaleString()}đ</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}
      <TouchableOpacity style={styles.cartButton} onPress={() => router.push("/components/cart/cart")}>
        <Ionicons name="cart-outline" size={28} color="#fff" />
        {cart ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cart}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
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
    position: 'relative',
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
  suggestionsList: {
    position: 'absolute',
    top: 95,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1000,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 5,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionPrice: {
    fontSize: 14,
    color: '#ff5a5f',
  },
});
