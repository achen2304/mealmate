import axios from 'axios';

// Determine the base URL for API calls based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, the API is served from the same domain
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
});

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
