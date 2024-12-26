import axios from "../utils/api";
import { setSessionItem, getSessionItem } from "../utils/sessionStorage";
import { setLocalStorageItem, getLocalStorageItem } from "../utils/localStorage";

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

// LocalStore
const addCartToSession = async (product, quantity = 1) => {
  try {
      const cartData = getSessionItem("cart_session") || [];
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

      setSessionItem("cart_session", cartData);

      return cartData;
  } catch (error) {
      console.error("Error adding to session:", error);
      return error;
  }
};

const addCartToLocalStorage = async (product, quantity = 1) => {
  try {
      const cartData = getLocalStorageItem("cart_local") || [];
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

      setLocalStorageItem("cart_local", cartData);

      return cartData;
  } catch (error) {
      console.error("Error adding to localStorage:", error);
      return error;
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

export { addCart, updateCart, getCart, deleteCart, addCartToSession, addCartToLocalStorage, addOrder, getOrder };
