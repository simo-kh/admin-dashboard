import React, { useState, useEffect } from 'react';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  uploadImage, 
  getCategoryAttributes, 
  deleteCategory 
} from '../../services/api';
import Modal from '../common/Modal';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to load categories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryAttributes = async (categoryId) => {
    try {
      const response = await getCategoryAttributes(categoryId);
      setAttributes(
        response.data.map((attr) => ({
          name: attr.name,
          is_displayable: attr.is_displayable || false,
        }))
      );
    } catch (err) {
      console.error('Error fetching category attributes:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAttributeChange = (index, key, value) => {
    setAttributes((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const addAttributeField = () => {
    setAttributes((prev) => [...prev, { name: '', is_displayable: false }]);
  };

  const removeAttributeField = (index) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = async () => {
    const { name, image } = formData;
    if (!name) {
      alert('Category name is required.');
      return;
    }
    try {
      let imageUrl = '';
      if (image) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', image);
        const uploadResponse = await uploadImage(uploadFormData);
        imageUrl = uploadResponse.data.url;
      }

      const requestBody = { 
        name, 
        image: imageUrl, 
        attributes 
      };

      await addCategory(requestBody);
      setIsModalOpen(false);
      setFormData({ name: '', image: null });
      setAttributes([]);
      fetchCategories();
    } catch (err) {
      console.error('Error adding category:', err.response || err.message || err);
      alert('Failed to add category. Please check your input and network connection.');
    }
  };

  const handleEditCategory = async (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, image: null });
    await fetchCategoryAttributes(category.id);
    setIsModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    const { name, image } = formData;
    try {
      let imageUrl = editingCategory.image;
      if (image) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', image);
        const uploadResponse = await uploadImage(uploadFormData);
        imageUrl = uploadResponse.data.url;
      }

      const requestBody = { 
        id: editingCategory.id, 
        name, 
        image: imageUrl, 
        attributes 
      };

      await updateCategory(requestBody);
      setEditingCategory(null);
      setIsModalOpen(false);
      setFormData({ name: '', image: null });
      setAttributes([]);
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err.response || err.message || err);
      alert('Failed to update category. Please check your input and network connection.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleSubmit = () => {
    if (editingCategory) {
      handleUpdateCategory();
    } else {
      handleAddCategory();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', image: null });
    setAttributes([]);
  };

  return (
    <div className="categories-container">
      <h1 className="categories-title">Categories</h1>
      {loading && <p className="categories-loading">Loading...</p>}
      {error && <p className="categories-error">{error}</p>}
      <button 
        className="categories-add-button" 
        onClick={() => setIsModalOpen(true)}
      >
        Add Category
      </button>
      <ul className="categories-list">
        {categories.map((category) => (
          <li key={category.id} className="category-item">
            <div className="category-details">
              <img 
                className="category-image" 
                src={category.image} 
                alt={category.name} 
              />
              <span className="category-name">{category.name}</span>
            </div>
            <div className="category-actions">
              <button 
                className="category-edit-button" 
                onClick={() => handleEditCategory(category)}
              >
                Edit
              </button>
              <button 
                className="category-delete-button" 
                onClick={() => handleDeleteCategory(category.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingCategory ? 'Edit Category' : 'Add Category'}
        >
          <div className="modal-body">
            <label className="modal-label">
              Name:
              <input
                className="modal-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label className="modal-label">
              Image:
              <input
                className="modal-input"
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </label>
            <div className="attributes-section">
              <h4 className="attributes-title">Attributes:</h4>
              {attributes.map((attr, index) => (
                <div key={index} className="attribute-field">
                  <input
                    className="attribute-input"
                    type="text"
                    value={attr.name}
                    onChange={(e) =>
                      handleAttributeChange(index, 'name', e.target.value)
                    }
                    placeholder="Attribute Name"
                  />
                  <label className="displayable-checkbox">
                    <input
                      type="checkbox"
                      checked={attr.is_displayable}
                      onChange={(e) =>
                        handleAttributeChange(index, 'is_displayable', e.target.checked)
                      }
                    />
                    Displayable
                  </label>
                  <button
                    className="attribute-remove-button"
                    onClick={() => removeAttributeField(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button className="attribute-add-button" onClick={addAttributeField}>
                Add Attribute
              </button>
            </div>
            <button className="modal-submit-button" onClick={handleSubmit}>
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Categories;
