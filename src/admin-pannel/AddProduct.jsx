import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    title: '',
    description: '',
    categories: [],
    prices: {
      small: '',
      medium: '',
      large: '',
      xlarge: ''
    },
    stock: '',
    brand: '',
    colors: [],
    sizes: [],
    material: '',
    productImage: null,
    image: '',
  });

  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState({ colors: [], sizes: [] });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // NEW STATES for dropdown
  const [chosenAttributeNames, setChosenAttributeNames] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    fetchCategories();
    fetchAttributes();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Initialize selectedAttributes when attributes are loaded (for new products)
  useEffect(() => {
    if (Object.keys(attributes).length > 0 && !id) {
      const initialAttributes = {};
      Object.keys(attributes).forEach(key => {
        if (key !== 'colors' && key !== 'sizes') {
          initialAttributes[key] = [];
        }
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [attributes, id]);

  // Helper function to convert attribute names for display
  const getAttributeDisplayName = (attrName) => {
    if (attrName === 'colors') return 'Colors';
    if (attrName === 'sizes') return 'Sizes';
    if (attrName === 'brand') return 'Brand';
    if (attrName === 'material') return 'Material';
    // Convert "xyz_attribute" back to "Xyz Attribute"
    return attrName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attributes');
      const allAttributes = response.data;
      
      // Group attributes by name for easy access
      const groupedAttributes = {};
      allAttributes.forEach(attr => {
        // Map attribute names to match backend expectations
        if (attr.name.toLowerCase() === 'color') {
          groupedAttributes['colors'] = attr.values;
        } else if (attr.name.toLowerCase() === 'size') {
          groupedAttributes['sizes'] = attr.values;
        } else if (attr.name.toLowerCase() === 'brand') {
          groupedAttributes['brand'] = attr.values;
        } else if (attr.name.toLowerCase() === 'material') {
          groupedAttributes['material'] = attr.values;
        } else {
          // Handle dynamic attributes (like "xyz Attribute", "abc Attribute")
          const attrKey = attr.name.toLowerCase().replace(/\s+/g, '_'); // Convert "xyz Attribute" to "xyz_attribute"
          groupedAttributes[attrKey] = attr.values;
        }
      });
      
      setAttributes(groupedAttributes);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      const product = response.data;
      
      setProductData({
        title: product.name,
        description: product.description,
        categories: product.categories || [],
        prices: {
          small: product.prices?.small?.toString() || '',
          medium: product.prices?.medium?.toString() || '',
          large: product.prices?.large?.toString() || '',
          xlarge: product.prices?.xlarge?.toString() || ''
        },
        stock: product.stockQuantity?.toString() || '',
        brand: product.attributes?.brand?.[0] || '', // Get first brand value
        colors: product.attributes?.colors || [],
        sizes: product.attributes?.sizes || [],
        material: product.attributes?.material?.[0] || '', // Get first material value
        productImage: null,
        image: product.image || '',
      });
      setSelectedCategories(product.categories || []);
      setSelectedColors(product.attributes?.colors || []);
      setSelectedSizes(product.attributes?.sizes || []);
      
      // Set all other attributes for backward compatibility
      const otherAttributes = {};
      
      // Load main attributes (brand, material) from attributes field
      if (product.attributes) {
        Object.entries(product.attributes).forEach(([key, value]) => {
          if (key !== 'colors' && key !== 'sizes') {
            // Ensure all attributes are arrays for the multiselect interface
            otherAttributes[key] = Array.isArray(value) ? value : [value];
          }
        });
      }
      
      // Also handle brand and material specifically for the input fields
      if (product.attributes?.brand && product.attributes.brand.length > 0) {
        otherAttributes.brand = product.attributes.brand;
      }
      if (product.attributes?.material && product.attributes.material.length > 0) {
        otherAttributes.material = product.attributes.material;
      }
      
      // Load additional attributes from additionalAttributes field
      if (product.additionalAttributes) {
        const additionalAttrs = product.additionalAttributes instanceof Map 
          ? Object.fromEntries(product.additionalAttributes) 
          : product.additionalAttributes;
          
        Object.entries(additionalAttrs).forEach(([key, value]) => {
          if (value && value.length > 0) {
            otherAttributes[key] = Array.isArray(value) ? value : [value];
          }
        });
      }
      
      // Also check allAttributes virtual field as fallback for backward compatibility
      if (product.allAttributes && Object.keys(otherAttributes).length === 0) {
        Object.entries(product.allAttributes).forEach(([key, value]) => {
          if (key !== 'colors' && key !== 'sizes' && value && value.length > 0) {
            otherAttributes[key] = Array.isArray(value) ? value : [value];
          }
        });
      }
      
      // Map attribute keys to match the frontend format (convert spaces to underscores)
      const mappedAttributes = {};
      const chosenAttrs = [];
      Object.entries(otherAttributes).forEach(([key, value]) => {
        const mappedKey = key.toLowerCase().replace(/\s+/g, '_');
        mappedAttributes[mappedKey] = value;
        // Add to chosen attributes for dropdown (exclude brand and material as they have input fields)
        if (value && value.length > 0 && key !== 'brand' && key !== 'material') {
          chosenAttrs.push(mappedKey);
        }
      });
      
      setSelectedAttributes(mappedAttributes);
      setChosenAttributeNames(chosenAttrs);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found!');
    }
  };

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    const val = type === 'file' ? files[0] : value;

    if (name.startsWith('price_')) {
      const size = name.replace('price_', '');
      setProductData(prev => ({
        ...prev,
        prices: {
          ...prev.prices,
          [size]: value
        }
      }));
    } else {
      setProductData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(name => name !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleAttributeChange = (attributeName, value) => {
    setSelectedAttributes(prev => {
      const currentValues = prev[attributeName] || [];
      
      if (currentValues.includes(value)) {
        const newValues = currentValues.filter(v => v !== value);
        return {
          ...prev,
          [attributeName]: newValues
        };
      } else {
        const newValues = [...currentValues, value];
        return {
          ...prev,
          [attributeName]: newValues
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    if (selectedSizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    // Validate that prices are set for all selected sizes
    const missingPrices = selectedSizes.filter(size => {
      let sizeKey = size.toLowerCase();
      // Map "Extra Large" to "xlarge" for price validation
      if (sizeKey === 'extra large') {
        sizeKey = 'xlarge';
      }
      return !productData.prices[sizeKey] || productData.prices[sizeKey] === '';
    });

    if (missingPrices.length > 0) {
      toast.error(`Please set prices for: ${missingPrices.join(', ')}`);
      return;
    }

    try {
      let imageName = '';

      if (productData.productImage) {
        const formData = new FormData();
        formData.append('productImage', productData.productImage);

        const uploadRes = await axios.post('http://localhost:5000/api/products/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageName = uploadRes.data.filename;
      }

      // Prepare the payload with proper attribute structure
      const payload = {
        name: productData.title,
        image: imageName || productData.image || 'default.jpg',
        prices: {
          small: selectedSizes.includes('Small') ? parseFloat(productData.prices.small) : undefined,
          medium: selectedSizes.includes('Medium') ? parseFloat(productData.prices.medium) : undefined,
          large: selectedSizes.includes('Large') ? parseFloat(productData.prices.large) : undefined,
          xlarge: selectedSizes.includes('Extra Large') ? parseFloat(productData.prices.xlarge) : undefined
        },
        stockQuantity: parseInt(productData.stock),
        categories: selectedCategories,
        description: productData.description,
        // Main attributes (predefined schema attributes)
        attributes: {
          colors: selectedColors,
          sizes: selectedSizes,
          brand: productData.brand ? [productData.brand] : [],
          material: selectedAttributes.material || []
        },
        // Additional dynamic attributes (custom attributes)
        additionalAttributes: (() => {
          const customAttrs = {};
          Object.entries(selectedAttributes).forEach(([key, value]) => {
            // Exclude predefined attributes that go in the main attributes field
            if (key !== 'brand' && key !== 'material' && key !== 'colors' && key !== 'sizes') {
              if (value && value.length > 0) {
                customAttrs[key] = value;
              }
            }
          });
          return customAttrs;
        })(),
        isCustomizable: true,
        CustomizationDescription: "Upload your design or add text"
      };

      if (id) {
        await axios.put(`http://localhost:5000/api/products/${id}`, payload);
        toast.success('✅ Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        toast.success('✅ Product added successfully!');
      }

      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="signup-container">
      <div className="form-box">
        <h2 className="title">{id ? 'Edit Product' : 'Add Product'}</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="grid">
            <input
              name="title"
              type="text"
              placeholder="Product Title"
              value={productData.title}
              onChange={handleChange}
              required
            />
            <input
              name="brand"
              type="text"
              placeholder="Brand"
              value={productData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Categories *</label>
            <div className="multiselect-container">
              {categories.map((category) => (
                <label key={category._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          {/* Sizes Selection - Moved above Size Prices */}
          {attributes.sizes && attributes.sizes.length > 0 && (
            <div className="form-group">
              <label>Sizes *</label>
              <div className="multiselect-container">
                {attributes.sizes.map((size) => (
                  <label key={size} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Size Prices *</label>
            <div className="size-prices-grid">
              <div className="size-price-input">
                <label>Small</label>
                <input
                  name="price_small"
                  type="number"
                  placeholder="Price for Small"
                  value={productData.prices.small}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  disabled={!selectedSizes.includes('Small')}
                />
              </div>
              <div className="size-price-input">
                <label>Medium</label>
                <input
                  name="price_medium"
                  type="number"
                  placeholder="Price for Medium"
                  value={productData.prices.medium}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  disabled={!selectedSizes.includes('Medium')}
                />
              </div>
              <div className="size-price-input">
                <label>Large</label>
                <input
                  name="price_large"
                  type="number"
                  placeholder="Price for Large"
                  value={productData.prices.large}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  disabled={!selectedSizes.includes('Large')}
                />
              </div>
              <div className="size-price-input">
                <label>XLarge</label>
                <input
                  name="price_xlarge"
                  type="number"
                  placeholder="Price for XLarge"
                  value={productData.prices.xlarge}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  disabled={!selectedSizes.includes('Extra Large')}
                />
              </div>
            </div>
          </div>

          <div className="grid">
            <input
              name="stock"
              type="number"
              placeholder="Stock Quantity"
              value={productData.stock}
              onChange={handleChange}
              required
            />
            <div></div>
          </div>

          {/* Only show Colors */}
        {attributes.colors && (
          <div className="form-group">
            <label>{getAttributeDisplayName('colors')}</label>
            <div className="multiselect-container">
              {attributes.colors.map((color) => (
                <label key={color} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => handleColorChange(color)}
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>
        )}

  {/* Attribute Dropdown */}
          <div className="form-group">
            <label>Select Attributes to Show</label>
            <div className="attr-dropdown-container">
              <button
                type="button"
                className="attr-dropdown-btn"
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                Choose Attributes ▼
              </button>
              {dropdownOpen && (
                <div className="attr-dropdown-list">
                  {Object.keys(attributes).map(attrName => {
                    if (attrName === 'sizes' || attrName === 'colors') return null;
                    return (
                      <label key={attrName} className="attr-checkbox-item">
                        <input
                          style={{
                            width: "20px",
                            padding: "10px",
                            border: "1px solid #ff9100",
                            borderRadius: "4px",
                            fontSize: "14px"
                          }}
                          type="checkbox"
                          checked={chosenAttributeNames.includes(attrName)}
                          onChange={() => {
                            setChosenAttributeNames(prev =>
                              prev.includes(attrName)
                                ? prev.filter(name => name !== attrName)
                                : [...prev, attrName]
                            );
                          }}
                        />
                        {getAttributeDisplayName(attrName)}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Attributes Section */}
          {chosenAttributeNames.map(attrName => (
            <div key={attrName} className="form-group">
              <label>{getAttributeDisplayName(attrName)}</label>
              <div className="multiselect-container">
                {attributes[attrName]?.map(value => (
                  <label key={value} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedAttributes[attrName]?.includes(value) || false}
                      onChange={() => handleAttributeChange(attrName, value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          ))} 
          <textarea
            name="description"
            rows="4"
            placeholder="Product Description"
            value={productData.description}
            onChange={handleChange}
            required
          ></textarea>

          <div className="upload-section">
            <label>Product Image</label>
            <input
              type="file"
              name="productImage"
              accept="image/*"
              onChange={handleChange}
            />

            {!productData.productImage && id && productData.image && (
              <img
                src={`http://localhost:5000/images/${productData.image}`}
                alt="Current Product"
                style={{ width: '150px', marginTop: '10px', borderRadius: '8px' }}
              />
            )}
          </div>

          <button type="submit" className="submit-btn">
            {id ? 'Update Product' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
