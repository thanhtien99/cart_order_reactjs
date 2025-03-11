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
import { getCart, updateCart } from "@/services/cart";

const Cart = () => {
  const [cartList, setCartList] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { setCart } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        if (isAuthenticated) {
          const response = await getCart(user);
          setCartList(response.data);
        } else {
          // const response = getLocalStorageItem("cart_local");
          // setCartList(response || []);
        }
      } catch (error) {
        console.error("Error fetching carts:", error);
      }
    };

    fetchCarts();
  }, [isAuthenticated, user]);

  const handleQuantityChange = async (cartId: any, newQuantity: number) => {
    if (isAuthenticated) {
      try {
        await updateCart(cartId, newQuantity);
        setCartList((prevCartList) => {
          return prevCartList.map((cart) => {
            if (cart._id === cartId) {
              cart.quantity = newQuantity;
              cart.total_price = cart.product.price * newQuantity;
            }
            return cart;
          });
        });

        const currentItem = cartList.find((c) => c._id === cartId);
        setCart((prev: any) => prev + (newQuantity - (currentItem?.quantity || 0)));
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      // const localCart = [...cartList];
      // const cartIndex = localCart.findIndex(
      //   (item) => item.product.id === cartId
      // );
      // if (cartIndex > -1) {
      //   localCart[cartIndex].quantity = newQuantity;
      //   localCart[cartIndex].total_price =
      //     localCart[cartIndex].product.price * newQuantity;
      //   setLocalStorageItem("cart_local", localCart);
      //   const totalQuantity = localCart.reduce(
      //     (acc, item) => acc + item.quantity,
      //     0
      //   );
      //   setCart(totalQuantity);
      // }
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

  // const handleRemoveCart = async (cart) => {
  //   if (isAuthenticated) {
  //     try {
  //       await deleteCart(cart);
  //       setCartList((prevCartList) => {
  //         if (!prevCartList || !Array.isArray(prevCartList)) {
  //           console.error("prevCartList invalid:", prevCartList);
  //           return prevCartList;
  //         }
  //         const updatedCartItems = prevCartList.filter((item) => item._id !== cart._id);
  
  //         return updatedCartItems;
  //       });
  //       setCart((prev) => prev - cart.quantity);

  //       // close the modal
  //       const modalElement = document.getElementById(`deleteModal-${cart._id}`);
  //       const backdrop = document.querySelector(".modal-backdrop");
  //       modalElement.classList.remove("show")
  //       if (backdrop) {
  //         backdrop.remove();
  //         document.body.style.overflow = "";
  //         document.body.style.paddingRight = "";
  //         document.body.classList.remove("modal-open");
  //       }
  //     } catch (error) {
  //       console.error("Error updating cart quantity:", error);
  //     }
  //   } else {
  //     const localCart = [...cartList];
  //     const cartIndex = localCart.findIndex(
  //       (item) => item.product.id === cart.product.id
  //     );
  //     if (cartIndex > -1) {
  //       removeCartItemLocalStorage(cart.product.id);
  //       const updatedCart = localCart.filter(
  //         (item) => item.product.id !== cart.product.id
  //       );
  //       const totalQuantity = updatedCart.reduce(
  //         (acc, item) => acc + item.quantity,
  //         0
  //       );
  //       setCartList(updatedCart);
  //       setCart(totalQuantity);

  //       // close the modal
  //       const modalElement = document.getElementById(
  //         `deleteModal-${cart.product.id}`
  //       );
  //       const backdrop = document.querySelector(".modal-backdrop");
  //       modalElement.classList.remove("show");
  //       if (backdrop) {
  //         backdrop.remove();
  //         document.body.style.overflow = "";
  //         document.body.style.paddingRight = "";
  //         document.body.classList.remove("modal-open");
  //       }
  //     }
  //   }
  // };

  return (
    <>
    {/* Header */}
    <Stack.Screen options={{ title: "Giỏ hàng"}} />

    <View style={styles.container}>
      {/* Danh sách sản phẩm trong giỏ hàng */}
      <FlatList
        data={cartList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {/* Delete Button */}
            {/* <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <AntDesign name="close" size={18} color="#999" />
            </TouchableOpacity> */}

            <Image source={{ uri: item.product.thumbnail }} style={styles.image} resizeMode="contain"/>

            <View style={styles.info}>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.product.name}</Text>
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
        <TouchableOpacity style={styles.buyButton} onPress={() => Alert.alert("Mua hàng thành công!")}>
          <Text style={styles.buyText}>Mua hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5",
    // padding: 10
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
    justifyContent: "space-between", // Đẩy quantityContainer ra cuối
    alignItems: "center",
  },
  textContainer: {
    flex: 1, // Chứa thông tin sản phẩm (tên, giá, giá gốc)
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  price: { fontSize: 18, fontWeight: "bold", color: "#ff4500", marginTop: 5 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: 100,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: "flex-end",
  },
  quantity: {
    fontSize: 16,
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
    padding: 5,
    borderRadius: 15,
  },
});

export default Cart;
