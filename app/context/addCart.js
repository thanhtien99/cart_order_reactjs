import React, { useContext, createContext, useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getCart } from "../services/cart";

export const AddCartContext = createContext();

const AddCartProvider = ({children}) => {
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState(0);
    
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                if (user && isAuthenticated) {
                    const response = await getCart(user);
                    if (response.data && Array.isArray(response.data)) {
                        const cartItems = response.data || [];
                        const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
                        setCart(totalQuantity);
                    } else {
                        setCart(0); 
                    }
                } else{
                    // const cartData = getLocalStorageItem("cart_local");
                    // if(cartData){
                    //     const totalQuantity = cartData.reduce((acc, item) => acc + item.quantity, 0);
                    //     setCart(totalQuantity);
                    // } else{
                    //     setCart(0)
                    // }
                    
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };
    
        fetchCartData();
    }, [user, isAuthenticated]);    

    return(
        <AddCartContext.Provider value={{ cart, setCart }}>
        {children}
        </AddCartContext.Provider>
    );
}

export default AddCartProvider;

export const useCartContext = () => useContext(AddCartContext);