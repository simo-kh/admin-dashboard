import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Axios instance with interceptors
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Categories
export const getCategories = () => apiInstance.get('/categories');
export const addCategory = (data) => apiInstance.post('/categories', data);
export const updateCategory = (data) => apiInstance.put(`/categories/${data.id}`, data);
export const deleteCategory = (id) => apiInstance.delete(`/categories/${id}`);
export const getCategoryAttributes = (categoryId) => apiInstance.get(`/categories/${categoryId}/attributes`);
export const addCategoryAttribute = (data) => apiInstance.post('/categories/attributes', data);

// Subcategories
export const getSubcategories = () => apiInstance.get('/subcategories');
export const addSubcategory = (data) => apiInstance.post('/subcategories', data);
export const updateSubcategory = (data) => apiInstance.put(`/subcategories/${data.id}`, data);
export const deleteSubcategory = (id) => apiInstance.delete(`/subcategories/${id}`);
export const getSubcategoryAttributes = (subcategoryId) => apiInstance.get(`/subcategories/${subcategoryId}/attributes`);
export const addSubcategoryAttribute = (data) => apiInstance.post('/subcategories/attributes', data);

// Products
export const getProducts = (query = '') => apiInstance.get(`/products?${query}`);
export const addProduct = (data) => apiInstance.post('/products', data);
export const updateProduct = (data) => apiInstance.put(`/products/${data.id}`, data);
export const deleteProduct = (id) => apiInstance.delete(`/products/${id}`);

// Common attribute deletion
export const deleteAttribute = (id) => apiInstance.delete(`/attributes/${id}`);

// Image Upload
export const uploadImage = async (formData) => {
    const token = localStorage.getItem('token'); // Ensure token is included
    return axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
