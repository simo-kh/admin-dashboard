import React, { useState, useEffect } from 'react';
import {
  getProducts,
  deleteProduct,
  getCategories, // Add this import
  getSubcategories, // Add this import
} from '../../services/api'; // Ensure these functions are exported from the `api.js` file
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filters, setFilters] = useState({ category: '', subcategory: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category_id', filters.category);
      if (filters.subcategory) params.append('subcategory_id', filters.subcategory);

      const response = await getProducts(params.toString());
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await getSubcategories();
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [filterName]: value };

      if (filterName === 'category') {
        const filteredSubs = subcategories.filter(
          (sub) => sub.category_id === parseInt(value, 10)
        );
        setFilteredSubcategories(filteredSubs);
        updatedFilters.subcategory = ''; // Reset subcategory filter
      }

      return updatedFilters;
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    navigate('/admin/products/edit', { state: { product } });
  };

  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="filters">
        <label>
          Category:
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Subcategory:
          <select
            value={filters.subcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
          >
            <option value="">All Subcategories</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="products-add-button" onClick={handleAddProduct}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <div className="product-details">
              <img
                className="product-image"
                src={product.main_photo}
                alt={product.name}
                width="100px"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Price: {product.price} Dhs</p>
                <p>Stock: {product.stock}</p>
              </div>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEditProduct(product)}>Edit</button>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
