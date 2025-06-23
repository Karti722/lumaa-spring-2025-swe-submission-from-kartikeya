import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
});

export const loginUser = (username: string, password: string) => {
  return api.post('/auth/login', { username, password });
};

export const registerUser = (username: string, password: string) => {
  return api.post('/auth/register', { username, password });
};

export const getTasks = (token: string) => {
  return api.get('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTask = (token: string, task: { title: string; description?: string }) => {
  return api.post('/tasks', task, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateTask = (token: string, id: number, task: Partial<{ title: string; description: string; isComplete: boolean }>) => {
  return api.put(`/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTask = (token: string, id: number) => {
  return api.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAccount = (username: string) => {
  return api.delete('/auth/delete', {
    data: { username },
  });
};