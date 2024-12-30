import React, { useState, useEffect } from 'react';
import {
  getCategories,
  getSubcategories,
  getCategoryAttributes,
  getSubcategoryAttributes,
  uploadImage,
  addProduct,
  updateProduct,
} from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product || null;

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);
  const conditionOptions = [
    'Neuf',
    "D'occasion - Comme neuf",
    "D'occasion - Etat parfait",
    "D'occasion - Très bon état",
    "D'occasion - Bon état",
    "D'occasion - Etat correct",
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    subcategory_id: '',
    category_id: '',
    is_promotion: false,
    is_top_product: false,
    main_photo: null,
    photos: [],
    condition: 'Neuf', // Default condition
    extra_attributes: {},
  });

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        main_photo: null, // Allow updating the main photo
        photos: editingProduct.photos || [],
        extra_attributes: Object.fromEntries(
          Object.entries(editingProduct.extra_attributes || {}).map(([key, value]) => [
            key,
            typeof value === 'object' ? value : { value },
          ])
        ),
      });

      if (editingProduct.category_id) fetchCategoryAttributes(editingProduct.category_id);
      if (editingProduct.subcategory_id) fetchSubcategoryAttributes(editingProduct.subcategory_id);
    }
  }, [editingProduct]);

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

  const fetchCategoryAttributes = async (categoryId) => {
    try {
      const response = await getCategoryAttributes(categoryId);
      setCategoryAttributes(response.data);
    } catch (error) {
      console.error('Error fetching category attributes:', error);
    }
  };

  const fetchSubcategoryAttributes = async (subcategoryId) => {
    try {
      const response = await getSubcategoryAttributes(subcategoryId);
      setSubcategoryAttributes(response.data);
    } catch (error) {
      console.error('Error fetching subcategory attributes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('extra_attributes.')) {
      const attributeName = name.replace('extra_attributes.', '');
      setFormData((prev) => ({
        ...prev,
        extra_attributes: {
          ...prev.extra_attributes,
          [attributeName]: { ...prev.extra_attributes[attributeName], value },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, main_photo: e.target.files[0] }));
  };

  const handlePhotosChange = (e) => {
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...e.target.files] }));
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleInputChangeCondition = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleSaveProduct = async () => {
    try {
      let mainPhotoUrl = formData.main_photo;
      const existingPhotoUrls = formData.photos.filter((photo) => typeof photo === 'string');
      const newPhotoUrls = [];

      if (formData.main_photo && typeof formData.main_photo !== 'string') {
        const uploadFormData = new FormData();
        uploadFormData.append('image', formData.main_photo);
        const response = await uploadImage(uploadFormData);
        mainPhotoUrl = response.data.url;
      }

      for (const photo of formData.photos) {
        if (typeof photo !== 'string') {
          const uploadFormData = new FormData();
          uploadFormData.append('image', photo);
          const response = await uploadImage(uploadFormData);
          newPhotoUrls.push(response.data.url);
        }
      }

      const finalPhotos = [...existingPhotoUrls, ...newPhotoUrls];

      const extraAttributesFlattened = Object.fromEntries(
        Object.entries(formData.extra_attributes).map(([key, attr]) => [key, attr.value])
      );

      const finalData = {
        ...formData,
        main_photo: mainPhotoUrl,
        photos: finalPhotos,
        extra_attributes: extraAttributesFlattened,
      };

      if (editingProduct) {
        await updateProduct({ ...finalData, id: editingProduct.id });
      } else {
        await addProduct(finalData);
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="product-form-container">
      <h1>{editingProduct ? 'Edit Product' : 'Add Product'}</h1>
      <form>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
        </label>
        <label>
          Price:
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
        </label>
        <label>
          Original Price:
          <input type="number" name="original_price" value={formData.original_price} onChange={handleInputChange} />
        </label>
        <label>
          Stock:
          <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} />
        </label>
        <label>
        Condition:
        <select
          name="condition"
          value={formData.condition}
          onChange={handleInputChangeCondition}
        >
          {conditionOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
        <label>
          Category:
          <select
            name="category_id"
            value={formData.category_id}
            onChange={(e) => {
              handleInputChange(e);
              fetchCategoryAttributes(e.target.value);
            }}
          >
            <option value="">Select a category</option>
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
            name="subcategory_id"
            value={formData.subcategory_id}
            onChange={(e) => {
              handleInputChange(e);
              fetchSubcategoryAttributes(e.target.value);
            }}
          >
            <option value="">Select a subcategory</option>
            {subcategories
              .filter((sub) => sub.category_id === parseInt(formData.category_id))
              .map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Main Photo:
          <input type="file" name="main_photo" onChange={handleImageChange} />
        </label>
        <label>
          Additional Photos:
          <input type="file" name="photos" multiple onChange={handlePhotosChange} />
        </label>
        <div className="photos-preview">
          {formData.photos.map((photo, index) => (
            <div key={index} className="photo-item">
              {typeof photo === 'string' ? (
                <img src={photo} alt={`Photo ${index + 1}`} width="100px" />
              ) : (
                <div className="file-placeholder">
                  <img src="https://via.placeholder.com/100" alt="Placeholder" width="100px" />
                </div>
              )}
              <button type="button" onClick={() => handleRemovePhoto(index)}>
                X
              </button>
            </div>
          ))}
        </div>
        <label>
          Promotion:
          <input
            type="checkbox"
            name="is_promotion"
            checked={formData.is_promotion}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Top Product:
          <input
            type="checkbox"
            name="is_top_product"
            checked={formData.is_top_product}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Used:
          <input
            type="checkbox"
            name="is_used"
            checked={formData.is_used}
            onChange={handleInputChange}
          />
        </label>
        {categoryAttributes.map((attr) => (
          <label key={attr.id}>
            {attr.name}:
            <input
              type="text"
              name={`extra_attributes.${attr.name}`}
              value={formData.extra_attributes[attr.name]?.value || ''}
              onChange={handleInputChange}
            />
          </label>
        ))}
        {subcategoryAttributes.map((attr) => (
          <label key={attr.id}>
            {attr.name}:
            <input
              type="text"
              name={`extra_attributes.${attr.name}`}
              value={formData.extra_attributes[attr.name]?.value || ''}
              onChange={handleInputChange}
            />
          </label>
        ))}
        <button type="button" onClick={handleSaveProduct}>
          Save
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
