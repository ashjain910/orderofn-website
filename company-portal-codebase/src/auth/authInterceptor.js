import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'https://script.google.com/macros/s/AKfycbzy6ErJ2dEnt3REiy9aPWPaS_TmhmQx0WqWARatc5e0ojJ5cAw_3K4Yjir0-ewnX5pB/exec',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get auth details from localStorage
const auth = JSON.parse(localStorage.getItem('auth')) || {};
const authCheck = auth.token ? { username: auth.username, token: auth.token } : {};

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (authCheck.token) {
      // Add authCheck to the request params
      const params = new URLSearchParams(config.params || {});
      params.append('authCheck', JSON.stringify(authCheck));
      config.params = params;
    } else {
      // If no token, redirect to login
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Return the response if successful
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized, log the user out
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;