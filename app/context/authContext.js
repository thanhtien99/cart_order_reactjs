import React, { useContext, createContext, useEffect, useState } from "react";
import AuthService from "../services/account";
import { View } from 'react-native';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const data = await AuthService.isAuthenticated();
                setUser(data.user);
                setIsAuthenticated(data.isAuthenticated);
            } catch (error) {
                console.error("Error fetching authentication status:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchAuthStatus();
    }, []);

    return(
        <>
            {!isLoaded ? (
                <View>Loading.....</View>
            ) : (
                <AuthContext.Provider
                value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
                    {children}
                </AuthContext.Provider>
            )}
        </>
    )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
