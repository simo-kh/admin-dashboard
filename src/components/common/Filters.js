import React from 'react';
import './Filters.css'; // Add styles if needed

const Filters = ({ filters, onFilterChange }) => {
  return (
    <div className="filters">
      <select name="category" onChange={(e) => onFilterChange('category', e.target.value)}>
        <option value="">All Categories</option>
        {filters.categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select name="subcategory" onChange={(e) => onFilterChange('subcategory', e.target.value)}>
        <option value="">All Subcategories</option>
        {filters.subcategories.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
