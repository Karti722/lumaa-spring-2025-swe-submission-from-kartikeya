import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks'; // Adjust the URL as needed

export const getTasks = async (token: string) => {
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createTask = async (taskData: { title: string; description?: string }, token: string) => {
    const response = await axios.post(API_URL, taskData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateTask = async (id: string, taskData: { title?: string; description?: string; isComplete?: boolean }, token: string) => {
    const response = await axios.put(`${API_URL}/${id}`, taskData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteTask = async (id: string, token: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};