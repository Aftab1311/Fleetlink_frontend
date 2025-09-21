import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and authentication
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    // Add authentication headers here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

    // Handle specific status codes
    switch (error.response?.status) {
      case 401:
        // Handle unauthorized access
        console.warn('🔒 Unauthorized access');
        break;
      case 403:
        // Handle forbidden access
        console.warn('🚫 Forbidden access');
        break;
      case 404:
        // Handle not found
        console.warn('🔍 Resource not found');
        break;
      case 500:
        // Handle server error
        console.error('🔥 Server error');
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
