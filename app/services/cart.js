import axios from "../utils/api";
import { getAsyncStorageItem, setAsyncStorageItem } from "@/utils/asyncStorage";

const addCart = async (user_id, product, quantity = 1) => {
  try {
    const cartData = {
      user: user_id,
      product_id: product._id,
      quantity: quantity,
    };
    
    const response = await axios.post('/cart/', cartData);
    return response.data; 
  } catch (error) {
    return error;
  }
};

const updateCart = async (cart_id, quantity) => {
  try {
    const response = await axios.put(`/cart/${cart_id}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    return { error: error.response?.data?.error || 'Unknown error' };
  }
};


const getCart = async (user) => {
  try {
    const response = await axios.get('/cart', {
      params: { user: user._id }
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return { error: error.response?.data?.error || "Unknown error" };
  }
};

const deleteCart = async (cart) => {
  const cart_id = cart._id;
  try {
    const response = await axios.delete(`/cart/${cart_id}`);
    return response.data; 
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return { error: error.response?.data?.error || "Unknown error" };
  }
};

// Order
const addOrder = async (user_id) => {
  try {
    const cartData = {
      user: user_id,
    };
    
    const response = await axios.post('/cart/order', cartData);
    return response.data; 
  } catch (error) {
    return error;
  }
};

const getOrder = async (user) => {
  try {
    const response = await axios.get('/cart/order', {
      params: { user: user._id }
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return { error: error.response?.data?.error || "Unknown error" };
  }
};

//AsyncStorage
const addCartToAsyncStorage = async (product, quantity = 1) => {
  try {
    const cartData = await getAsyncStorageItem('cart_local') || [];
    const existingProductIndex = cartData.findIndex(item => item.product.id === product._id);
    const totalPrice = product.price * quantity;

    if (existingProductIndex !== -1) {
      cartData[existingProductIndex].quantity += quantity;
      cartData[existingProductIndex].total_price = cartData[existingProductIndex].quantity * product.price;
    } else {
        cartData.push({
          product: {
            id: product._id,
            name: product.name,
            thumbnail: product.thumbnail,
            price: product.price,
          },
          quantity: quantity,
          total_price: totalPrice,
        });
    }

    await setAsyncStorageItem('cart_local', cartData);

    return cartData;
  } catch (error) {
      console.error("Error adding to AsyncStorage:", error);
      return error;
  }
};

export { addCart, updateCart, getCart, deleteCart, addOrder, getOrder, addCartToAsyncStorage };
