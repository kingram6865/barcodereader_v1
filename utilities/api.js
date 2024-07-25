import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_BASE_URI, // Replace with your API base URL
  timeout: 10000, // Timeout after 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  request => {
    console.log('Starting Request', request);
    return request;
  },
  error => {
    console.log('Request Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.log('Response Error:', error);
    return Promise.reject(error);
  }
);

export default api;