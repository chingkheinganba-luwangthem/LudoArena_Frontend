import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Validate token and fetch user profile
            api.get('/auth/me')
                .then(response => {
                    setUser(response.data.data);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (credentials) => {
        const res = await api.post('/auth/login', credentials);
        const { token: newToken, userId, ...rest } = res.data.data;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setUser({ id: userId, ...rest });
        return res.data;
    };

    const signup = async (data) => {
        const res = await api.post('/auth/signup', data);
        const { token: newToken, userId, ...rest } = res.data.data;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setUser({ id: userId, ...rest });
        return res.data;
    };

    const guestLogin = async () => {
        const res = await api.post('/auth/guest');
        const { token: newToken, userId, ...rest } = res.data.data;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        setUser({ id: userId, ...rest });
        return res.data;
    };

    const updateProfile = async (profileData) => {
        const res = await api.put('/auth/profile', profileData);
        setUser(res.data.data); // Update local user state with the response
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, guestLogin, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
