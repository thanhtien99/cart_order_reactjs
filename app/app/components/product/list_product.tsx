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
import { productList } from '@/services/product';
import { useRouter } from 'expo-router';
import FilterProduct from './filter_product';
import { categoryList } from '@/services/category';

interface Product {
  _id: string;
  name: string;
  thumbnail: string;
  price: number;
  original_price: number;
}

interface Category {
  _id: string;
  name: string;
}

export default function ListProduct() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  // filter & sort
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setfilterCategory] = useState<string[]>([]);
  const [filterPrice, setfilterPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productList({
          category: filterCategory, 
          price_range: filterPrice,
          sort: sortBy
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [filterCategory, filterPrice, sortBy]);

  const handleViewDetails = (productId: string) => {
    router.push({pathname: '/components/product/[id]', params: { id: productId }});
  }; 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryList();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <FilterProduct 
        categories={categories}
        filterCategory={filterCategory} 
        setfilterCategory={setfilterCategory}
        filterPrice={filterPrice}
        setfilterPrice={setfilterPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
        

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => handleViewDetails(item._id)}>
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
              <Text style={styles.originalPrice}>{item.original_price.toLocaleString()}đ</Text>
            </View>
          </TouchableOpacity>
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
    width: '48%',
    backgroundColor: '#fff',
    margin: '1%',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
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
  originalPrice: { 
    textDecorationLine: "line-through", 
    color: "#999", 
    fontSize: 12 
  }
});