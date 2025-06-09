import axios from 'axios';

// API calls for user authentication

// In production on Vercel, the API will be at the same domain
const getApiUrl = () => {
  // For client-side requests in production, use relative URLs
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // For development or server-side rendering
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

// Create axios instance with credentials
const api = axios.create({
  withCredentials: true,
});

const userApi = {
  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const response = await api.post(
        `${getApiUrl()}/users/register`,
        userData
      );
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post(
        `${getApiUrl()}/users/login`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  getUser: async (userId: string) => {
    try {
      const response = await api.get(`${getApiUrl()}/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
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
      const response = await api.put(
        `${getApiUrl()}/users/${userId}`,
        userData
      );
      return response.data;
    } catch (error: any) {
      console.error('Update user error:', error);
      throw new Error(error.response?.data?.error || 'User update failed');
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`${getApiUrl()}/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete user error:', error);
      throw new Error(error.response?.data?.error || 'User deletion failed');
    }
  },
};

export default userApi;
