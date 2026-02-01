/**
 * API Service - Axios instance configurada
 */
import axios, { AxiosInstance } from 'axios';

export const API_BASE_URL = 'http://192.168.110.51:3000';

// Crear instancia de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
    return Promise.reject({ message: errorMessage, status: error.response?.status });
  }
);

/**
 * Hacer request con token de autorización
 */
export const authRequest = (token: string): AxiosInstance => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

/**
 * Auth API
 */
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('api/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await apiClient.post('api/auth/register', userData);
    return response.data;
  },
  getProfile: async (token: string) => {
    const response = await authRequest(token).get('/auth/profile');
    return response.data;
  },
  getUsers: async (token: string) => {
    const response = await authRequest(token).get('/auth/users');
    return response.data;
  }
};

/**
 * Plants API
 */
export const plantsAPI = {
  getAll: async (token: string, params: any = {}) => {
    const response = await authRequest(token).get('/plants', { params });
    return response.data;
  },
  getById: async (token: string, id: string) => {
    const response = await authRequest(token).get(`/plants/${id}`);
    return response.data;
  },
  create: async (token: string, plantData: any) => {
    const response = await authRequest(token).post('/plants', plantData);
    return response.data;
  },
  update: async (token: string, id: string, plantData: any) => {
    const response = await authRequest(token).put(`/plants/${id}`, plantData);
    return response.data;
  },
  delete: async (token: string, id: string) => {
    const response = await authRequest(token).delete(`/plants/${id}`);
    return response.data;
  },
  getStats: async (token: string) => {
    const response = await authRequest(token).get('/plants/stats');
    return response.data;
  }
};

/**
 * Public API (sin autenticación)
 */
export const publicAPI = {
  getSpecimen: async (occurrenceID: string) => {
    const response = await apiClient.get(`/public/specimen/${occurrenceID}`);
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/public/stats');
    return response.data;
  }
};