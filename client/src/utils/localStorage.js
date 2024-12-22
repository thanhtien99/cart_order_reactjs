export const getLocalStorageItem = (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;  
};

export const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const removeCartItemLocalStorage = (productId) => {
    const cartData = getLocalStorageItem("cart_local");

    if (cartData) {
        const updatedCartData = cartData.filter(item => item.product.id !== productId);
        setLocalStorageItem("cart_local", updatedCartData);
    }
};

