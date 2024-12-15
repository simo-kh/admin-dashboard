import React, { useState, useEffect } from 'react';
import {
  getCategories,
  addCategory,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateCategory,
  deleteCategory,
  getSubcategories,
  addSubcategory,
  updateSubcategory, // Ensure this is imported
  deleteSubcategory, // Ensure this is imported
  getCategoryAttributes,
  getSubcategoryAttributes,
  addCategoryAttribute,
  addSubcategoryAttribute
} from './api';
import CategoryForm from './CategoryForm';
import SubcategoryForm from './SubcategoryForm';
import ProductForm from './ProductForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterSubcategory, setFilterSubcategory] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      const categoriesResponse = await getCategories(token);
      setCategories(categoriesResponse.data);
      const subcategoriesResponse = await getSubcategories(token);
      setSubcategories(subcategoriesResponse.data);
      const productsResponse = await getProducts(token);
      setProducts(productsResponse.data);
    };
    fetchData();
  }, [token]);

  const handleAddCategory = async (category) => {
    await addCategory(token, category);
    const categoriesResponse = await getCategories(token);
    setCategories(categoriesResponse.data);
  };

  const handleUpdateCategory = async (category) => {
    await updateCategory(token, category);
    const categoriesResponse = await getCategories(token);
    setCategories(categoriesResponse.data);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(token, categoryId);
      const categoriesResponse = await getCategories(token);
      setCategories(categoriesResponse.data);
    }
  };

  const handleAddSubcategory = async (subcategory) => {
    await addSubcategory(token, subcategory);
    const subcategoriesResponse = await getSubcategories(token);
    setSubcategories(subcategoriesResponse.data);
  };

  const handleUpdateSubcategory = async (subcategory) => {
    await updateSubcategory(token, subcategory);
    const subcategoriesResponse = await getSubcategories(token);
    setSubcategories(subcategoriesResponse.data);
    setEditingSubcategory(null);
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      await deleteSubcategory(token, subcategoryId);
      const subcategoriesResponse = await getSubcategories(token);
      setSubcategories(subcategoriesResponse.data);
    }
  };

  const handleAddProduct = async (product, images) => {
    await addProduct(token, product);
    const productsResponse = await getProducts(token);
    setProducts(productsResponse.data);
  };

  const handleUpdateProduct = async (product, images) => {
    await updateProduct(token, product);
    const productsResponse = await getProducts(token);
    setProducts(productsResponse.data);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(token, productId);
      const productsResponse = await getProducts(token);
      setProducts(productsResponse.data);
    }
  };

  const handleFilterCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFilterCategory(categoryId);
    if (categoryId) {
      const attributesResponse = await getCategoryAttributes(token, categoryId);
      setCategoryAttributes(attributesResponse.data);
      const subcategoriesResponse = await getSubcategories(token, categoryId);
      setSubcategories(subcategoriesResponse.data);
    } else {
      setCategoryAttributes([]);
      const subcategoriesResponse = await getSubcategories(token);
      setSubcategories(subcategoriesResponse.data);
    }
  };

  const handleFilterSubcategoryChange = async (e) => {
    const subcategoryId = e.target.value;
    setFilterSubcategory(subcategoryId);
    if (subcategoryId) {
      const attributesResponse = await getSubcategoryAttributes(token, subcategoryId);
      setSubcategoryAttributes(attributesResponse.data);
    } else {
      setSubcategoryAttributes([]);
    }
  };

  const filteredProducts = filterSubcategory
    ? products.filter(product => product.subcategory_id === parseInt(filterSubcategory))
    : filterCategory
      ? products.filter(product => product.subcategory.category_id === parseInt(filterCategory))
      : products;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <CategoryForm
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        token={token}
      />
      <SubcategoryForm
        categories={categories}
        onAddSubcategory={handleAddSubcategory}
        onUpdateSubcategory={handleUpdateSubcategory}
        editingSubcategory={editingSubcategory}
        setEditingSubcategory={setEditingSubcategory}
        token={token}
      />
      <ProductForm
        categories={categories}
        subcategories={subcategories}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        categoryAttributes={categoryAttributes}
        subcategoryAttributes={subcategoryAttributes}
        token={token} 
      />
      <h3>Categories</h3>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
            <div>
              <button className="edit-button" onClick={() => setEditingCategory(category)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Subcategories</h3>
      <ul>
        {subcategories.map(subcategory => (
          <li key={subcategory.id}>
            {subcategory.name}
            <div>
              <button className="edit-button" onClick={() => setEditingSubcategory(subcategory)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteSubcategory(subcategory.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Products</h3>
      <label htmlFor="categoryFilter">Filter by Category:</label>
      <select id="categoryFilter" onChange={handleFilterCategoryChange}>
        <option value="">All</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <label htmlFor="subcategoryFilter">Filter by Subcategory:</label>
      <select id="subcategoryFilter" onChange={handleFilterSubcategoryChange}>
        <option value="">All</option>
        {subcategories.map(subcategory => (
          <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
        ))}
      </select>
      <ul>
        {filteredProducts.map(product => (
          <li key={product.id}>
            {product.name}
            <div>
              <button className="edit-button" onClick={() => setEditingProduct(product)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
