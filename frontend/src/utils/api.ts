import axios from 'axios';

// Determine the base URL for API calls based on environment
const getBaseUrl = () => {
  // For client-side requests in production, use relative URLs
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return '';
  }

  // In development, target local API server
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

// Create an axios instance with the appropriate base URL
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Function to fetch meals from the API
export const fetchMeals = async () => {
  try {
    const response = await api.get('/api/meals');
    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

// Function to check API health
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/api');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

export default api;
