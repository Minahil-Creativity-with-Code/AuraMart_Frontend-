import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { MdLocationOn, MdLocalShipping, MdSecurity, MdRefresh } from 'react-icons/md';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colorToProductMap, setColorToProductMap] = useState({});
  const [availableColors, setAvailableColors] = useState([]);
  const [isSwitchingVariant, setIsSwitchingVariant] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      
      // Set default selections
      if (response.data.attributes?.sizes?.length > 0) {
        setSelectedSize(response.data.attributes.sizes[0]);
      }
      if (response.data.attributes?.colors?.length > 0) {
        setSelectedColor(response.data.attributes.colors[0]);
      }

      // Fetch color variants if product has colors
      if (response.data.attributes?.colors?.length > 0) {
        await fetchColorVariants(response.data.name);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchColorVariants = async (productName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/variants/${encodeURIComponent(productName)}`);
      setColorToProductMap(response.data.colorToProductMap);
      setAvailableColors(Object.keys(response.data.colorToProductMap));
    } catch (error) {
      console.error('Error fetching color variants:', error);
      // If no variants found, just use the current product's colors
      if (product?.attributes?.colors) {
        setAvailableColors(product.attributes.colors);
      }
    }
  };

  const handleColorVariantClick = async (color) => {
    try {
      // Find the product variant for this color
      if (colorToProductMap[color] && colorToProductMap[color].length > 0) {
        setIsSwitchingVariant(true);
        
        const variant = colorToProductMap[color][0]; // Get first variant of this color
        
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update the URL without page reload
        window.history.replaceState({}, '', `/product/${variant._id}`);
        
        // Ensure the variant has the correct structure for the component
        const normalizedVariant = {
          ...variant,
          // Ensure prices are properly structured
          prices: variant.prices || {},
          // Ensure attributes are properly structured
          attributes: {
            ...variant.attributes,
            sizes: variant.attributes?.sizes || variant.allAttributes?.sizes || [],
            colors: variant.attributes?.colors || variant.allAttributes?.colors || [],
            brand: variant.attributes?.brand || variant.allAttributes?.brand || [],
            material: variant.attributes?.material || variant.allAttributes?.material || []
          }
        };
        
        // Update the current product data smoothly
        setProduct(normalizedVariant);
        
        
        // Update the selected color
        setSelectedColor(color);
        
        // Reset size selection if the variant has different sizes
        if (normalizedVariant.attributes?.sizes?.length > 0) {
          setSelectedSize(normalizedVariant.attributes.sizes[0]);
        }
        
        setIsSwitchingVariant(false);
      }
    } catch (error) {
      console.error('Error switching to color variant:', error);
      toast.error('Error switching to selected color variant');
      setIsSwitchingVariant(false);
    }
  };

  const isColorVariant = (color) => {
    // Check if this color exists in variants and if it's a different product
    if (colorToProductMap[color] && colorToProductMap[color].length > 0) {
      // Check if any variant of this color has a different ID than current product
      return colorToProductMap[color].some(variant => variant._id !== product?._id);
    }
    return false;
  };

  const getVariantForColor = (color) => {
    if (colorToProductMap[color] && colorToProductMap[color].length > 0) {
      // Find a variant that's different from current product
      return colorToProductMap[color].find(variant => variant._id !== product?._id);
    }
    return null;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Map size names to price keys
    const sizeKeyMap = {
      'Small': 'small',
      'Medium': 'medium', 
      'Large': 'large',
      'Extra Large': 'xlarge',
      'XL': 'xlarge',
      'XXL': 'xxlarge'
    };
    const priceKey = sizeKeyMap[selectedSize] || selectedSize.toLowerCase().replace(/\s+/g, '');
    const price = product.prices[priceKey];
    
    if (!price) {
      toast.error('Price not available for selected size');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      image: product.image,
      price: price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      maxQuantity: product.stockQuantity
    };

    addToCart(cartItem);
    toast.success('Product added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Map size names to price keys
    const sizeKeyMap = {
      'Small': 'small',
      'Medium': 'medium', 
      'Large': 'large',
      'Extra Large': 'xlarge',
      'XL': 'xlarge',
      'XXL': 'xxlarge'
    };
    const priceKey = sizeKeyMap[selectedSize] || selectedSize.toLowerCase().replace(/\s+/g, '');
    const price = product.prices[priceKey];
    
    if (!price) {
      toast.error('Price not available for selected size');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      image: product.image,
      price: price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      maxQuantity: product.stockQuantity
    };

    addToCart(cartItem);
    navigate('/cart');
  };

  const getPriceDisplay = () => {
    if (!product) return null;
    
    const prices = product.prices;
    const availableSizes = Object.keys(prices).filter(size => prices[size]);
    
    if (availableSizes.length === 0) return <span className="no-price">Price not available</span>;
    
    if (availableSizes.length === 1) {
      const size = availableSizes[0];
      return (
        <div className="single-price">
          <span className="price">Rs {prices[size]} PKR</span>
          <span className="size-label">({size.charAt(0).toUpperCase() + size.slice(1)})</span>
        </div>
      );
    }
    
    return (
      <div className="price-range">
        <span className="price-label">Starting from:</span>
        <span className="price">Rs {Math.min(...availableSizes.map(size => prices[size]))} PKR</span>
      </div>
    );
  };

  const getSelectedPrice = () => {
    if (!selectedSize || !product) return null;
    
    // Map size names to price keys
    const sizeKeyMap = {
      'Small': 'small',
      'Medium': 'medium', 
      'Large': 'large',
      'Extra Large': 'xlarge',
      'XL': 'xlarge',
      'XXL': 'xxlarge'
    };
    const priceKey = sizeKeyMap[selectedSize] || selectedSize.toLowerCase().replace(/\s+/g, '');
    const price = product.prices[priceKey];
    return price ? `Rs ${price} PKR` : 'Price not available';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <button onClick={() => navigate('/shop')} className="back-btn">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div className = "detail-page">
        <div className = "detail-container">
          <div className = "detail-images">
            <div className="main-image" style={{ position: 'relative' }}>
              <img 
                src={`http://localhost:5000/images/${product.image}`} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'http://localhost:5000/images/default.jpg';
                }}
                style={{
                  opacity: isSwitchingVariant ? 0.7 : 1,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
              {isSwitchingVariant && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333',
                  zIndex: 10
                }}>
                  Switching variant...
                </div>
              )}
            </div>
          </div>

          <div className = "detail-details" style={{
            opacity: isSwitchingVariant ? 0.8 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}>
            <div className = "detail-header">
              <h1 className = "detail-title">{product.name}</h1>
              <div className = "detail-rating">
                <FaStar className="star filled" />
                <FaStar className="star filled" />
                <FaStar className="star filled" />
                <FaStar className="star filled" />
                <FaStarHalfAlt className="star half" />
                <span className="rating-text">(4.5 out of 5)</span>
              </div>
            </div>

            <div className = "detail-price">
              {getPriceDisplay()}
              {selectedSize && (
                <div className="selected-price">
                  <strong>Selected Size ({selectedSize}):</strong> {getSelectedPrice()}
                </div>
              )}
            </div>

            <div className = "detail-description">
              <p>{product.description}</p>
            </div>

            <div className = "detail-options">
              {availableColors && availableColors.length > 0 && (
                <div className="option-group">
                  <label>Available Colors:</label>
                  <div className="color-options">
                    {availableColors.map((color) => {
                      const isVariant = isColorVariant(color);
                      const variant = getVariantForColor(color);
                      const isCurrentProductColor = product?.attributes?.colors?.includes(color);
                      
                      return (
                        <button
                          key={color}
                          className={`color-option ${selectedColor === color ? 'selected' : ''} ${isVariant ? 'variant' : ''}`}
                          onClick={() => {
                            if (isVariant && variant) {
                              handleColorVariantClick(color);
                            } else {
                              setSelectedColor(color);
                            }
                          }}
                          style={{ 
                            backgroundColor: color.toLowerCase(),
                            opacity: isSwitchingVariant ? 0.6 : 1,
                            transition: 'all 0.3s ease-in-out',
                            cursor: isSwitchingVariant ? 'wait' : 'pointer'
                          }}
                          disabled={isSwitchingVariant}
                          title={`${color}${isVariant ? ' - Click to view variant' : ' - Current product color'}`}
                        >
                          {color}
                          {isVariant && variant && (
                            <span className="variant-indicator">→</span>
                          )}
                          {!isVariant && isCurrentProductColor && (
                            <span className="current-indicator">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.attributes?.sizes && product.attributes.sizes.length > 0 && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="size-options">
                    {product.attributes.sizes.map((size) => {
                      // Map size names to price keys
                      const sizeKeyMap = {
                        'Small': 'small',
                        'Medium': 'medium', 
                        'Large': 'large',
                        'Extra Large': 'xlarge',
                        'XL': 'xlarge',
                        'XXL': 'xxlarge'
                      };
                      const priceKey = sizeKeyMap[size] || size.toLowerCase().replace(/\s+/g, '');
                      const price = product.prices[priceKey];
                      return (
                        <button
                          key={size}
                          className={`size-option ${selectedSize === size ? 'selected' : ''} ${!price ? 'unavailable' : ''}`}
                          onClick={() => price && setSelectedSize(size)}
                          disabled={!price}
                        >
                          <span className="size-name">{size}</span>
                          {price && <span className="size-price">Rs {price} PKR</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Fallback size display if attributes.sizes is not available */}
              {(!product.attributes?.sizes || product.attributes.sizes.length === 0) && product.prices && Object.keys(product.prices).length > 0 && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="size-options">
                    {Object.keys(product.prices).map((size) => {
                      const price = product.prices[size];
                      const displaySize = size.charAt(0).toUpperCase() + size.slice(1);
                      return (
                        <button
                          key={size}
                          className={`size-option ${selectedSize === displaySize ? 'selected' : ''} ${!price ? 'unavailable' : ''}`}
                          onClick={() => price && setSelectedSize(displaySize)}
                          disabled={!price}
                        >
                          <span className="size-name">{displaySize}</span>
                          {price && <span className="size-price">Rs {price} PKR</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="option-group">
                <label>Quantity:</label>
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    disabled={quantity >= product.stockQuantity}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <span className="stock-info">Available: {product.stockQuantity}</span>
              </div>
            </div>
            {/* For Additional Attributes */}

            {product.additionalAttributes && Object.keys(product.additionalAttributes).length > 0 && (
              <div className="additional-attributes">
                <h3>Additional Attributes</h3>
                <ul>
                  {Object.entries(product.additionalAttributes).map(([key, values]) => (
                    <li key={key}>
                      <strong>{key.replace(/_/g, ' ')}:</strong> {values.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className = "detail-actions">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                <FaShoppingCart />
                Add to Cart
              </button>
              <button 
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={!selectedSize}
              >
                Buy Now
              </button>
            </div>

            <div className = "detail-features">
              <div className="feature">
                <MdLocationOn />
                <span>Free delivery on orders above Rs 2000</span>
              </div>
              <div className="feature">
                <MdLocalShipping />
                <span>Fast delivery within 2-3 business days</span>
              </div>
              <div className="feature">
                <MdSecurity />
                <span>Secure payment with SSL encryption</span>
              </div>
              <div className="feature">
                <MdRefresh />
                <span>Easy returns within 7 days</span>
              </div>
            </div>

            {product.attributes?.brand && (
              <div className = "detail-info">
                <strong>Brand:</strong> {product.attributes.brand}
              </div>
            )}
            
            {product.attributes?.material && (
              <div className = "detail-info">
                <strong>Material:</strong> {product.attributes.material}
              </div>
            )}
          </div>
        </div>
      </div>

    </Layout>
  );
  
};

export default ProductPage;
