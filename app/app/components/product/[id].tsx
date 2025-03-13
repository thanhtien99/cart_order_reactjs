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
  Button
} from 'react-native';
import Header from '@/app/components/layout/header';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { productDetail } from '@/services/product';
import { useAuth } from '@/context/authContext';
import { useCartContext } from '@/context/addCart';
import { addCart } from '@/services/cart';
import { notifySuccess, notifyError } from '@/utils/toastify' ;

const { width } = Dimensions.get('window');

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();
  const { setCart } = useCartContext();
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

  const handleAddToCart = async (product: any, quantity: number) => {
    try {
      if (isAuthenticated){
        await addCart(user._id, product, quantity);
      } else{
        // await addCartToLocalStorage(product, quantity);
      }

      setCart((prevCart: any) => prevCart + quantity);
      notifySuccess("Sản phẩm đã được thêm vào giỏ hàng!")

    } catch (error) {
      console.error('Error adding to cart:', error);
      notifyError("Không thêm được vào giỏ hàng. Vui lòng thử lại.")
    }
  };

  const handleBuy = async (product: any, quantity: number) => {
    try {
      if (isAuthenticated){
        await addCart(user._id, product, quantity);
      } else{
        // await addCartToLocalStorage(product, quantity);
      }
      setCart((prevCart: any) => prevCart + quantity);
      router.push("/components/cart/cart_order");
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      notifyError("Không thêm được vào giỏ hàng. Vui lòng thử lại.")
    }
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
    <>
      <Stack.Screen options={{ headerShown: false}} />

      {/* Header */}
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Info Product */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
          <Text style={styles.originalPrice}>
            <Text style={styles.priceLabel}>Giá gốc: </Text>
            <Text style={styles.strikethrough}>{product.original_price.toLocaleString()} đ</Text>
          </Text>

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quanity */}
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(product, quantity)}>
              <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowButton} onPress={() => handleBuy(product, quantity)}>
              <Text style={styles.addToCartText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>

          
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "100%", 
    height: width * 0.9,
    borderRadius: 10,
    aspectRatio: 1,
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ff4500",
    marginBottom: 5,
  },
  originalPrice: {
    marginBottom: 15,
  },
  priceLabel: {
    color: "#666",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  quantityButton: {
    padding: 10,
  },
  quantity: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#ff4500",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  successMessage: {
    position: "absolute",
    top: 50,
    left: "50%",
    transform: [{ translateX: -100 }],
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 1000,
  },
  successText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
});


export default ProductDetail;