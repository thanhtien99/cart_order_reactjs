import React, { useContext, createContext, useEffect, useState } from "react";
import AuthService from "../services/account";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AuthService.isAuthenticated().then(data =>{
            setUser(data.user);
            setIsAuthenticated(data.isAuthenticated);
            setIsLoaded(true);
        });
    }, []);

    return(
        <>
            {!isLoaded ? (
                <p>Loading.....</p>
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
