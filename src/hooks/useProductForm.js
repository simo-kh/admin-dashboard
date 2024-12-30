import { useState, useEffect } from 'react';
import { uploadImage, getCategoryAttributes, getSubcategoryAttributes } from '../services/api';

const useProductForm = (editingProduct = null, categories = [], token) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    subcategory_id: '',
    category_id: '',
    is_promotion: false,
    is_top_product: false,
    is_used: false,
    main_photo: '',
    extra_attributes: {}
  });
  const [images, setImages] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);
  const [mainPhotoFile, setMainPhotoFile] = useState(null);

  useEffect(() => {
    if (editingProduct) {
      setProductData({
        ...editingProduct,
        stock: editingProduct.stock || '',
        extra_attributes: editingProduct.extra_attributes || {}
      });
      if (editingProduct.category_id) {
        fetchCategoryAttributes(editingProduct.category_id);
      }
      if (editingProduct.subcategory_id) {
        fetchSubcategoryAttributes(editingProduct.subcategory_id);
      }
      setImages([]);
    }
  }, [editingProduct]);

  const fetchCategoryAttributes = async (categoryId) => {
    try {
      const response = await getCategoryAttributes(token, categoryId);
      setCategoryAttributes(response.data);
    } catch (error) {
      console.error('Error fetching category attributes:', error);
    }
  };

  const fetchSubcategoryAttributes = async (subcategoryId) => {
    try {
      const response = await getSubcategoryAttributes(token, subcategoryId);
      setSubcategoryAttributes(response.data);
    } catch (error) {
      console.error('Error fetching subcategory attributes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => setImages([...e.target.files]);
  const handleMainPhotoChange = (e) => setMainPhotoFile(e.target.files[0]);

  return {
    productData,
    setProductData,
    images,
    categoryAttributes,
    subcategoryAttributes,
    handleChange,
    handleImageChange,
    handleMainPhotoChange,
    fetchCategoryAttributes,
    fetchSubcategoryAttributes
  };
};

export default useProductForm;
