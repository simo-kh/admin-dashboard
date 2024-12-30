import React, { useState, useEffect } from 'react';
import { getCategoryAttributes, uploadImage } from './api';

const CategoryForm = ({ onAddCategory, onUpdateCategory, editingCategory, setEditingCategory, token }) => {
  const [categoryData, setCategoryData] = useState({ name: '', image: null });
  const [attributes, setAttributes] = useState([]);
  const [newAttributeName, setNewAttributeName] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setCategoryData(editingCategory);
      fetchAttributes(editingCategory.id);
    } else {
      setCategoryData({ name: '', image: null });
      setAttributes([]);
    }
  }, [editingCategory]);

  const fetchAttributes = async (categoryId) => {
    const response = await getCategoryAttributes(token, categoryId);
    setAttributes(response.data.map(attr => ({ ...attr, is_displayable: attr.is_displayable || false })));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setCategoryData({
      ...categoryData,
      image: e.target.files[0],
    });
  };

  const handleAttributeChange = (index, key, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][key] = value;
    setAttributes(updatedAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = categoryData.image;

    if (categoryData.image && categoryData.image instanceof File) {
      const formData = new FormData();
      formData.append('image', categoryData.image);
      const response = await uploadImage(token, formData);
      imageUrl = response.data.url;
    }

    const finalCategoryData = {
      ...categoryData,
      image: imageUrl,
      attributes,
    };

    if (editingCategory) {
      await onUpdateCategory(finalCategoryData);
    } else {
      await onAddCategory(finalCategoryData);
    }

    setCategoryData({ name: '', image: null });
    setAttributes([]);
    setEditingCategory(null);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: newAttributeName, is_displayable: false }]);
    setNewAttributeName('');
  };

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, idx) => idx !== index);
    setAttributes(updatedAttributes);
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
      <input
        type="text"
        name="name"
        value={categoryData.name}
        onChange={handleChange}
        placeholder="Category Name"
        required
      />
      <input
        type="file"
        name="image"
        onChange={handleImageChange}
        placeholder="Category Image"
      />
      <div>
  <h4>Attributes</h4>
  {attributes.map((attribute, index) => (
    <div key={index} className="attribute-row">
      <input
        type="text"
        value={attribute.name}
        onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
        placeholder="Attribute Name"
      />
      <label>
        <input
          type="checkbox"
          checked={attribute.is_displayable}
          onChange={(e) => handleAttributeChange(index, 'is_displayable', e.target.checked)}
        />
        Displayable
      </label>
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

      <button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</button>
    </form>
  );
};

export default CategoryForm;
