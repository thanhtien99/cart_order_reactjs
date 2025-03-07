import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productList } from "../../services/product";

export default function ListProduct() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await productList();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      {/* Danh sách sản phẩm */}
      <FlatList
      
        data={products}
        keyExtractor={(item) => item._id} // Ensure unique key
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
            </View>
          </View>
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  cartButton: {
    marginLeft: 10,
    padding: 5,
  },
  listContainer: {
    paddingBottom: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  productInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#ff5a5f',
    marginTop: 3,
  },
});

