import axios from 'axios';

const API_URL = 'http://localhost:5000/auth/';

export const register = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}register`, { username, password });
    return response.data;
};

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};