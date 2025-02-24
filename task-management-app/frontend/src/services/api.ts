import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export const loginUser = (username: string, password: string) => {
  return api.post('/auth/login', { username, password });
};

export const registerUser = (username: string, password: string) => {
  return api.post('/auth/register', { username, password });
};