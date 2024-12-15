import React, { useState, useEffect } from 'react';
import { uploadImage, getCategoryAttributes, getSubcategoryAttributes } from './api';
import './ProductForm.css';

const ProductForm = ({ categories, subcategories, onAddProduct, onUpdateProduct, editingProduct, setEditingProduct, token }) => {
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

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleMainPhotoChange = (e) => {
        setMainPhotoFile(e.target.files[0]);
    };

    const handleExtraAttributesChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            extra_attributes: {
                ...productData.extra_attributes,
                [name]: value
            }
        });
    };

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setProductData({ ...productData, category_id: categoryId, subcategory_id: '' });
        await fetchCategoryAttributes(categoryId);
    };

    const handleSubcategoryChange = async (e) => {
        const subcategoryId = e.target.value;
        setProductData({ ...productData, subcategory_id: subcategoryId });
        await fetchSubcategoryAttributes(subcategoryId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log('Submitting form...'); // Log form submission
        console.log('Token:', token); // Log the token
    
        let mainPhotoUrl = productData.main_photo;
        if (mainPhotoFile) {
            const formData = new FormData();
            formData.append('image', mainPhotoFile);
    
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            console.log('Uploading image with token:', token); // Log the token before upload
    
            try {
                const response = await uploadImage(token, formData);
                mainPhotoUrl = response.data.url;
                console.log('Main photo uploaded:', mainPhotoUrl);
            } catch (error) {
                console.error('Error uploading main photo:', error);
            }
        }
    
        const imageUrls = [];
        for (const image of images) {
            const formData = new FormData();
            formData.append('image', image);
    
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            console.log('Uploading image with token:', token); // Log the token before upload
    
            try {
                const response = await uploadImage(token, formData);
                imageUrls.push(response.data.url);
                console.log('Image uploaded:', response.data.url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    
        const finalProductData = {
            ...productData,
            main_photo: mainPhotoUrl,
            photos: imageUrls
        };
    
        console.log('Submitting Product Data:', finalProductData);
    
        if (editingProduct) {
            await onUpdateProduct(finalProductData);
        } else {
            await onAddProduct(finalProductData);
        }
    
        setProductData({
            name: '',
            description: '',
            price: '',
            original_price: '',
            stock: '',
            subcategory_id: '',
            category_id: '',
            is_promotion: false,
            is_top_product:false,
            is_used: false,
            main_photo: '',
            extra_attributes: {}
        });
        setImages([]);
        setMainPhotoFile(null);
        setEditingProduct(null);
    };
    
    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <input 
                type="text" 
                name="name" 
                value={productData.name || ''} 
                onChange={handleChange} 
                placeholder="Name" 
                required 
            />
            <textarea 
                name="description" 
                value={productData.description || ''} 
                onChange={handleChange} 
                placeholder="Description" 
                required 
            />
            <input 
                type="number" 
                name="price" 
                value={productData.price || ''} 
                onChange={handleChange} 
                placeholder="Price" 
                required 
            />
            {productData.is_promotion && (
                <input 
                    type="number" 
                    name="original_price" 
                    value={productData.original_price || ''} 
                    onChange={handleChange} 
                    placeholder="Original Price" 
                    required 
                />
            )}
            <input 
                type="number" 
                name="stock" 
                value={productData.stock || ''} 
                onChange={handleChange} 
                placeholder="Stock" 
                required 
            />
            <select 
                name="category_id" 
                value={productData.category_id || ''} 
                onChange={handleCategoryChange} 
                required
            >
                <option value="">Select Category</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <select 
                name="subcategory_id" 
                value={productData.subcategory_id || ''} 
                onChange={handleSubcategoryChange} 
                required
            >
                <option value="">Select Subcategory</option>
                {subcategories
                    .filter(subcategory => subcategory.category_id === parseInt(productData.category_id))
                    .map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                    ))}
            </select>
            <input 
                type="file" 
                name="main_photo" 
                onChange={handleMainPhotoChange} 
            />
            <input 
                type="file" 
                name="images" 
                multiple 
                onChange={handleImageChange} 
            />
            <label>
                Is top product:
                <input 
                    type="checkbox" 
                    name="is_top_product" 
                    checked={productData.is_top_product} 
                    onChange={handleChange} 
                />
            </label>
            <label>
                On Sale:
                <input 
                    type="checkbox" 
                    name="is_promotion" 
                    checked={productData.is_promotion} 
                    onChange={handleChange} 
                />
            </label>
            <label>
                Is Used:
                <input 
                    type="checkbox" 
                    name="is_used" 
                    checked={productData.is_used} 
                    onChange={handleChange} 
                />
            </label>
            <div>
                <h4>Category Attributes</h4>
                {categoryAttributes.map(attr => (
                    <input
                        key={attr.id}
                        type="text"
                        name={attr.name}
                        value={productData.extra_attributes[attr.name] || ''}
                        onChange={handleExtraAttributesChange}
                        placeholder={attr.name}
                    />
                ))}
            </div>
            <div>
                <h4>Subcategory Attributes</h4>
                {subcategoryAttributes.map(attr => (
                    <input
                        key={attr.id}
                        type="text"
                        name={attr.name}
                        value={productData.extra_attributes[attr.name] || ''}
                        onChange={handleExtraAttributesChange}
                        placeholder={attr.name}
                    />
                ))}
            </div>
            <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
        </form>
    );
};

export default ProductForm;
