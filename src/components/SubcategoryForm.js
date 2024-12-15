import React, { useState, useEffect } from 'react';
import { addSubcategoryAttribute, getSubcategoryAttributes } from './api';

const SubcategoryForm = ({ categories, onAddSubcategory, onUpdateSubcategory, editingSubcategory, setEditingSubcategory, token }) => {
  const [subcategoryData, setSubcategoryData] = useState({ name: '', category_id: '' });
  const [attributes, setAttributes] = useState([]);
  const [newAttributeName, setNewAttributeName] = useState('');

  useEffect(() => {
    if (editingSubcategory) {
      setSubcategoryData(editingSubcategory);
      fetchAttributes(editingSubcategory.id);
    } else {
      setSubcategoryData({ name: '', category_id: '' });
      setAttributes([]);
    }
  }, [editingSubcategory]);

  const fetchAttributes = async (subcategoryId) => {
    const response = await getSubcategoryAttributes(token, subcategoryId);
    setAttributes(response.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryData({
      ...subcategoryData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalSubcategoryData = {
      ...subcategoryData,
      attributes
    };

    if (editingSubcategory) {
      await onUpdateSubcategory(finalSubcategoryData);
    } else {
      await onAddSubcategory(finalSubcategoryData);
    }

    setSubcategoryData({ name: '', category_id: '' });
    setAttributes([]);
    setEditingSubcategory(null);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: newAttributeName }]);
    setNewAttributeName('');
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, idx) => idx !== index);
    setAttributes(updatedAttributes);
  };

  return (
    <form className="subcategory-form" onSubmit={handleSubmit}>
      <h3>{editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
      <input
        type="text"
        name="name"
        value={subcategoryData.name}
        onChange={handleChange}
        placeholder="Subcategory Name"
        required
      />
      <select
        name="category_id"
        value={subcategoryData.category_id}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <div>
        <h4>Attributes</h4>
        {attributes.map((attribute, index) => (
          <div key={index}>
            <input
              type="text"
              value={attribute.name}
              readOnly
            />
            <button type="button" onClick={() => handleRemoveAttribute(index)}>Remove</button>
          </div>
        ))}
        <input
          type="text"
          value={newAttributeName}
          onChange={(e) => setNewAttributeName(e.target.value)}
          placeholder="New Attribute"
        />
        <button type="button" onClick={handleAddAttribute}>Add Attribute</button>
      </div>
      <button type="submit">{editingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}</button>
    </form>
  );
};

export default SubcategoryForm;
