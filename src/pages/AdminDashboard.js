import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header'; // Correct path
import Sidebar from '../components/common/Sidebar'; // Correct path
import Categories from '../components/entities/Categories'; // Correct path
import Subcategories from '../components/entities/Subcategories'; // Correct path
import Products from '../components/entities/Products'; // Correct path
import ProductForm from '../components/entities/ProductForm'; // Correct path

import '../styles/AdminDashboard.css'; // Correct path

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Header />
      <div className="admin-dashboard-content">
        <Sidebar />
        <div className="admin-dashboard-main">
          <Routes>
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<ProductForm isEdit={false} />} />
            <Route path="products/edit" element={<ProductForm isEdit={true} />} />
      
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
