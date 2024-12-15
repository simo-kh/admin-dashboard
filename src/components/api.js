import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Change this to your server's address

export const getCategories = async (token) => {
  return await axios.get(`${API_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getSubcategories = async (token, categoryId = null) => {
  const url = categoryId ? `${API_URL}/categories/${categoryId}/subcategories` : `${API_URL}/subcategories`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getProducts = async (token) => {
  return await axios.get(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addCategory = async (token, category) => {
  return await axios.post(`${API_URL}/categories`, category, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateCategory = async (token, category) => {
  return await axios.put(`${API_URL}/categories/${category.id}`, category, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteCategory = async (token, categoryId) => {
  return await axios.delete(`${API_URL}/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addSubcategory = async (token, subcategory) => {
  return await axios.post(`${API_URL}/subcategories`, subcategory, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateSubcategory = async (token, subcategory) => {
  return await axios.put(`${API_URL}/subcategories/${subcategory.id}`, subcategory, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteSubcategory = async (token, subcategoryId) => {
  return await axios.delete(`${API_URL}/subcategories/${subcategoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addProduct = async (token, product) => {
  return await axios.post(`${API_URL}/products`, product, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateProduct = async (token, product) => {
  return await axios.put(`${API_URL}/products/${product.id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteProduct = async (token, productId) => {
  return await axios.delete(`${API_URL}/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getCategoryAttributes = async (token, categoryId) => {
  return await axios.get(`${API_URL}/categories/${categoryId}/attributes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addCategoryAttribute = async (token, attribute) => {
  return await axios.post(`${API_URL}/categories/attributes`, attribute, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getSubcategoryAttributes = async (token, subcategoryId) => {
  return await axios.get(`${API_URL}/subcategories/${subcategoryId}/attributes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const addSubcategoryAttribute = async (token, attribute) => {
  return await axios.post(`${API_URL}/subcategories/attributes`, attribute, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const uploadImage = async (token, formData) => {
    console.log("Uploading image with token:", token);  // Log the token
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        return await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        console.error('Image upload failed:', error.response.data);
        throw error;
    }
};