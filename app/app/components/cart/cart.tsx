import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "@/context/authContext";
import { useCartContext } from "@/context/addCart";
import { getCart, updateCart, deleteCart, addOrder } from "@/services/cart";
import socket from "@/app/socket";
import { notifySuccess, notifyError } from '@/utils/toastify' ;
import { getAsyncStorageItem, setAsyncStorageItem, removeCartItemAsyncStorage } from "@/utils/asyncStorage";
import EmptyCart from "./cart_empty";

const Cart = () => {
  const [cartList, setCartList] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { cart, setCart } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        if (isAuthenticated) {
          const response = await getCart(user);
          setCartList(response.data);
        } else {
          const response = await getAsyncStorageItem("cart_local");
          setCartList(response || []);
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };

    fetchCarts();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if(isAuthenticated){
      if(cart > 0){
        socket.emit('add-to-cart', cart)
      }
    }
  }, [cart]);

  const handleQuantityChange = async (cartId: any, newQuantity: number) => {
    if (isAuthenticated) {
      try {
        await updateCart(cartId, newQuantity);
        setCartList((prevCartList : any) =>
          prevCartList.map((cart: any) =>
            cart._id === cartId
              ? { ...cart, quantity: newQuantity, total_price: cart.product.price * newQuantity }
              : cart
          )
        );

        const updatedTotalQuantity = cartList.reduce(
          (acc, item) => acc + (item._id === cartId ? newQuantity : item.quantity),
          0
        );
        setCart(updatedTotalQuantity);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      const localCart = [...cartList];
      const cartIndex = localCart.findIndex((item) => item.product.id === cartId);

      if (cartIndex > -1) {
        localCart[cartIndex].quantity = newQuantity;
        localCart[cartIndex].total_price = localCart[cartIndex].product.price * newQuantity;

        await setAsyncStorageItem("cart_local", localCart);

        const totalQuantity = localCart.reduce((acc, item) => acc + item.quantity, 0);
        setCart(totalQuantity);
      }
    }
  };

  const handleIncrement = (cartId: any, currentQuantity: number) => {
    handleQuantityChange(cartId, currentQuantity + 1);
  };

  const handleDecrement = (cartId: any, currentQuantity: number) => {
    if (currentQuantity > 1) {
      handleQuantityChange(cartId, currentQuantity - 1);
    }
  };

  const handleRemoveItem = async (cart: any) => {
    Alert.alert(
      "Xác nhận", 
      "Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?",
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xoá",
          onPress: async () => {
            try {
              if (isAuthenticated) {
                await deleteCart(cart);
                setCartList((prevCartList) => {
                  if (!prevCartList || !Array.isArray(prevCartList)) {
                    console.error("prevCartList invalid:", prevCartList);
                    return prevCartList;
                  }
                  const updatedCartItems = prevCartList.filter((item) => item._id !== cart._id);
            
                  return updatedCartItems;
                });
                setCart((prev: any) => prev - cart.quantity);
              } else {
                const localCart = [...cartList];
                const cartIndex = localCart.findIndex(
                  (item) => item.product.id === cart.product.id
                );
                if (cartIndex > -1) {
                  await removeCartItemAsyncStorage(cart.product.id);
                  const updatedCart = localCart.filter(
                    (item) => item.product.id !== cart.product.id
                  );
                  const totalQuantity = updatedCart.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  );
                  setCartList(updatedCart);
                  setCart(totalQuantity);
                }
              }
              notifySuccess("Xoá thành công khỏi giỏ hàng");
            } catch (error) {
              console.error("Error removing item:", error);
              notifyError("Xoá không thành công, hãy thử lại");
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (productId: string) => {
    router.push({pathname: '/components/product/[id]', params: { id: productId }});
  }; 

  const handleAddOrder = async (user: any) => {
    if (isAuthenticated) {
      Alert.alert(
        "Xác nhận", 
        "Bạn có chắc chắn muốn mua những sản phẩm này?",
        [
          {
            text: "Huỷ",
            style: "cancel",
          },
          {
            text: "Mua",
            onPress: async () => {
              try {
                await addOrder(user._id);
                setCartList([]);
                setCart(0);
                notifySuccess("Mua hàng thành công");
              } catch (error) {
                console.error('Error adding to cart:', error);
                notifyError("Mua hàng không thành công. Vui lòng thử lại.");
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Thông báo", 
        "Bạn cần đăng nhập để mua hàng",
        [
          {
            text: "Huỷ",
            style: "cancel",
          },
          {
            text: "Đăng nhập",
            onPress: () => {
              router.push('/components/auth/login' as any);
            },
          },
        ]
      );
    }
  };

  return (
    <>
    {/* Header */}
    <Stack.Screen options={{ title: "Giỏ hàng"}} />

    <View style={styles.container}>
      { isAuthenticated ? 
        <> {/* Login */}
          { Array.isArray(cartList) && cartList.length > 0 ? 
            <>
              {/* Danh sách sản phẩm trong giỏ hàng */}
              <FlatList
                data={cartList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.cartItem}>
                    {/* Delete Button */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleRemoveItem(item)}
                    >
                      <AntDesign name="close" size={18} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleViewDetails(item.product._id)}>
                      <Image source={{ uri: item.product.thumbnail }} style={styles.image} resizeMode="contain"/>
                    </TouchableOpacity>
                    
                    <View style={styles.info}>
                      <View style={styles.textContainer}>

                        <TouchableOpacity onPress={() => handleViewDetails(item.product._id)}>
                          <Text style={styles.name}>{item.product.name}</Text>
                        </TouchableOpacity>
              
                        <Text style={styles.price}>{item.product.price.toLocaleString()}đ</Text>
                      </View>

                      {/* Chọn số lượng */}
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrement(item._id, item.quantity)}>
                          <AntDesign name="minus" size={20} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncrement(item._id, item.quantity)}>
                          <AntDesign name="plus" size={20} color="#333" />
                        </TouchableOpacity>
                        
                      </View>
                    </View>
                  </View>
                )}
              />

              {/* Thanh tổng tiền & nút mua hàng */}
              <View style={styles.footer}>
                <Text style={styles.totalText}>
                  Tổng tiền: <Text style={styles.totalPrice}> {cartList.reduce((total, item) => total + item.total_price, 0).toLocaleString()}đ</Text>
                </Text>
                <TouchableOpacity style={styles.buyButton} onPress={() => handleAddOrder(user)}>
                  <Text style={styles.buyText}>Mua hàng</Text>
                </TouchableOpacity>
              </View>
            </> 
            : 
            <> 
              <EmptyCart />
            </> 
          }
        </>
        :
        <> {/* UnLogin */}
          { Array.isArray(cartList) && cartList.length > 0 ? 
            <>
              {/* Danh sách sản phẩm trong giỏ hàng */}
              <FlatList
                data={cartList}
                keyExtractor={(item) => item.product.id}
                renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  {/* Delete Button */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveItem(item)}
                  >
                    <AntDesign name="close" size={18} color="#999" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleViewDetails(item.product.id)}>
                    <Image source={{ uri: item.product.thumbnail }} style={styles.image} resizeMode="contain"/>
                  </TouchableOpacity>
                  
                  <View style={styles.info}>
                    <View style={styles.textContainer}>

                    <TouchableOpacity onPress={() => handleViewDetails(item.product.id)}>
                      <Text style={styles.name}>{item.product.name}</Text>
                    </TouchableOpacity>
            
                      <Text style={styles.price}>{item.product.price.toLocaleString()}đ</Text>
                    </View>

                    {/* Chọn số lượng */}

                    <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrement(item.product.id, item.quantity)}>
                      <AntDesign name="minus" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncrement(item.product.id, item.quantity)}>
                      <AntDesign name="plus" size={20} color="#333" />
                    </TouchableOpacity>
                      
                    </View>
                  </View>
                </View>
                )}
              />

              {/* Thanh tổng tiền & nút mua hàng */}
              <View style={styles.footer}>
                <Text style={styles.totalText}>
                  Tổng tiền: <Text style={styles.totalPrice}> {cartList.reduce((total, item) => total + item.total_price, 0).toLocaleString()}đ</Text>
                </Text>
                <TouchableOpacity style={styles.buyButton} onPress={() => handleAddOrder(user)}>
                  <Text style={styles.buyText}>Mua hàng</Text>
                </TouchableOpacity>
              </View>
            </> 
            :
            <>
              <EmptyCart />
            </>
          }
        </>
      }
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5",
    padding: 8
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginHorizontal: 10 },
  info: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1, 
    flexShrink: 1,
    marginRight: 8
  },  
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  price: { fontSize: 16, fontWeight: "bold", color: "#ff4500", marginTop: 5 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 6,
    width: 90,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: "flex-end",
  },
  quantity: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    width: 20,
  },
  quantityButton: {
    padding: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },
  totalText: { fontSize: 18, fontWeight: "bold" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#ff4500" },
  buyButton: { backgroundColor: "#ff4500", padding: 12, borderRadius: 8 },
  buyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 4,
    borderRadius: 12,
  },
});

export default Cart;