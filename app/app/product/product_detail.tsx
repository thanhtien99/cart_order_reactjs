import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { productDetail } from '@/services/product';
import { useAuth } from '@/context/authContext';

const { width } = Dimensions.get('window');

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productDetail(id as string);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
        Alert.alert("Lỗi", "Không thể tải chi tiết sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ fontSize: 16 }}>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hình ảnh sản phẩm */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      {/* Thông tin sản phẩm */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.originalPrice}>
          <Text style={styles.priceLabel}>Giá gốc: </Text>
          <Text style={styles.strikethrough}>{formatPrice(product.original_price)}</Text>
        </Text>

        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Chọn số lượng */}
        <View style={styles.quantityContainer}>
          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
              <AntDesign name="minus" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <AntDesign name="plus" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nút Thêm vào giỏ hàng */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    backgroundColor: '#fff',
  },
  mainImage: {
    width: width,
    height: width,
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff4500',
    marginBottom: 5,
  },
  originalPrice: {
    marginBottom: 15,
  },
  priceLabel: {
    color: '#666',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: 10,
  },
  quantity: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#ff4500',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetail;
