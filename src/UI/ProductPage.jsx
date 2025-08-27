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
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const price = product.prices[selectedSize.toLowerCase()];
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

    const price = product.prices[selectedSize.toLowerCase()];
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
    const price = product.prices[selectedSize.toLowerCase()];
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
            <div className="main-image">
              <img 
                src={`http://localhost:5000/images/${product.image}`} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'http://localhost:5000/images/default.jpg';
                }}
              />
            </div>
          </div>

          <div className = "detail-details">
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
              {product.attributes?.colors && product.attributes.colors.length > 0 && (
                <div className="option-group">
                  <label>Color:</label>
                  <div className="color-options">
                    {product.attributes.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.attributes?.sizes && product.attributes.sizes.length > 0 && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="size-options">
                    {product.attributes.sizes.map((size) => {
                      const price = product.prices[size.toLowerCase()];
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
            
          </div>
        </div>
      </div>

    </Layout>
  );
  
};

export default ProductPage;
