import axios from 'axios';

// API calls for user authentication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const userApi = {
  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  getUser: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'User not found');
    }
  },

  updateUser: async (
    userId: string,
    userData: {
      email?: string;
      password?: string;
      name?: string;
      recipesId?: string[];
      cartId?: string[];
    }
  ) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'User update failed');
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'User deletion failed');
    }
  },
};

export default userApi;
