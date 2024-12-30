import React, { useState, useEffect } from 'react';
import { getCategories, getSubcategories, getSubcategoryAttributes, addSubcategory, updateSubcategory, deleteSubcategory, uploadImage } from '../../services/api';
import Modal from '../common/Modal';
import './Subcategories.css';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', categoryId: '', image: null });
  const [attributes, setAttributes] = useState([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const response = await getSubcategories();
      setSubcategories(response.data);
    } catch (err) {
      setError('Failed to load subcategories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchAttributes = async (subcategoryId) => {
    try {
      const response = await getSubcategoryAttributes(subcategoryId);
      setAttributes(
        response.data.map((attr) => ({
          ...attr,
          is_displayable: attr.is_displayable || false, // Default to false if not set
        }))
      );
    } catch (err) {
      console.error('Failed to fetch subcategory attributes:', err);
    }
  };

  useEffect(() => {
    if (editingSubcategory) {
      setFormData({ name: editingSubcategory.name, categoryId: editingSubcategory.category_id, image: null });
      fetchAttributes(editingSubcategory.id);
    } else {
      setFormData({ name: '', categoryId: '', image: null });
      setAttributes([]);
    }
  }, [editingSubcategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAttributeChange = (index, key, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][key] = value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    if (newAttributeName.trim()) {
      setAttributes([...attributes, { name: newAttributeName.trim(), is_displayable: false }]);
      setNewAttributeName('');
    }
  };

  const handleRemoveAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    const { name, categoryId, image } = formData;
    if (!name || !categoryId) {
      alert('Subcategory name and category ID are required.');
      return;
    }
    try {
      let imageUrl = '';
      if (image && image instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', image);
        const uploadResponse = await uploadImage(uploadFormData);
        imageUrl = uploadResponse.data.url;
      }
      const finalSubcategoryData = {
        name,
        category_id: categoryId,
        image: imageUrl,
        attributes,
      };

      if (editingSubcategory) {
        await updateSubcategory({ ...finalSubcategoryData, id: editingSubcategory.id });
      } else {
        await addSubcategory(finalSubcategoryData);
      }

      setFormData({ name: '', categoryId: '', image: null });
      setAttributes([]);
      setEditingSubcategory(null);
      setIsModalOpen(false);
      fetchSubcategories();
    } catch (err) {
      console.error('Error submitting subcategory:', err);
      alert('Failed to submit subcategory. Please try again.');
    }
  };

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingSubcategory(null);
    setFormData({ name: '', categoryId: '', image: null });
    setAttributes([]);
    setIsModalOpen(false);
  };

  return (
    <div className="subcategories-container">
      <h1 className="subcategories-title">Subcategories</h1>
      {loading && <p className="subcategories-loading">Loading...</p>}
      {error && <p className="subcategories-error">{error}</p>}
      <button className="subcategories-add-button" onClick={() => setIsModalOpen(true)}>Add Subcategory</button>
      <ul className="subcategories-list">
        {subcategories.map((subcategory) => (
          <li key={subcategory.id} className="subcategory-item">
            <div className="subcategory-details">
              <img className="subcategory-image" src={subcategory.image} alt={subcategory.name} />
              <span className="subcategory-name">{subcategory.name}</span>
            </div>
            <div className="subcategory-actions">
              <button className="subcategory-edit-button" onClick={() => handleEditSubcategory(subcategory)}>Edit</button>
              <button className="subcategory-delete-button" onClick={() => deleteSubcategory(subcategory.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
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
              Category:
              <select
                className="modal-input"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
              <h4 className="attributes-title">Attributes</h4>
              {attributes.map((attr, index) => (
                <div key={index} className="attribute-item">
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={attr.is_displayable}
                      onChange={(e) => handleAttributeChange(index, 'is_displayable', e.target.checked)}
                    />
                    Displayable
                  </label>
                  <button type="button" onClick={() => handleRemoveAttribute(index)}>Remove</button>
                </div>
              ))}
              <div className="new-attribute-input">
                <input
                  type="text"
                  value={newAttributeName}
                  onChange={(e) => setNewAttributeName(e.target.value)}
                  placeholder="New Attribute"
                />
                <button type="button" onClick={handleAddAttribute}>Add</button>
              </div>
            </div>
            <button className="modal-submit-button" onClick={handleSubmit}>
              {editingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Subcategories;
