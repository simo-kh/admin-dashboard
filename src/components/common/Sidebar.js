import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Add styles if needed

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin/categories" activeClassName="active">Categories</NavLink>
          </li>
          <li>
            <NavLink to="/admin/subcategories" activeClassName="active">Subcategories</NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" activeClassName="active">Products</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
