import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const checkAuth = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/me`,
                {
                    withCredentials: true
                });
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);
    const loginUser = (userData) => {
        setUser(userData);
        setLoading(false);
    };
    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/logout`, {},
                {
                    withCredentials: true
                }
            );
        } catch (error) {
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, loginUser, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => { return useContext(AuthContext); };