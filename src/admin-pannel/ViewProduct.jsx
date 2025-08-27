import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch product:', err);
        toast.error('Product not found.');
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="view-product-wrapper">
      <div className="view-product">
        {/* LEFT SIDE: Single Main Image */}
        <div className="main-image-only">
          <img src={`http://localhost:5000/images/${product.image || 'default.jpg'}`} alt={product.name} />
        </div>

        {/* RIGHT SIDE: Product Info */}
        <div className="product-details">
          <h2>{product.name}</h2>
          <div className="ratings">
            {'★'.repeat(product.ratings || 3)}{'☆'.repeat(5 - (product.ratings || 3))} &nbsp;
            <span>{product.ratings || 3} Ratings & {product.reviews || 1} Reviews</span>
          </div>

          <p className="price">${product.prices?.medium || product.price}</p>

          <p className={`stock ${product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
          </p>

          <p className="short-desc">{product.description}</p>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          {product.CustomizationDescription && (
            <div className="expandable-description">
              <h4>Description</h4>
              <p>{product.CustomizationDescription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
