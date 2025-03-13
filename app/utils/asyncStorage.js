import AsyncStorage from '@react-native-async-storage/async-storage';


export const getAsyncStorageItem = async (name) => {
    try {
      const jsonValue = await AsyncStorage.getItem(name);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Error retrieving AsyncStorage item:", e);
        return null;
    }
};

export const setAsyncStorageItem = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error("Error saving AsyncStorage item:", e);
    }
};

export const removeCartItemAsyncStorage = async (productId) => {
    try {
        const cartData = await getAsyncStorageItem("cart_local");
        if (cartData) {
            const updatedCartData = cartData.filter(item => item.product.id !== productId);
            await setAsyncStorageItem("cart_local", updatedCartData);
        }
    } catch(e) {
        console.error("Error removing cart item from AsyncStorage:", e);
    }
};
