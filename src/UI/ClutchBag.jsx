import React, { useEffect, useState } from 'react';
import Layout from "../components/Layout";
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClutchBag = () => {
  const [sortOption, setSortOption] = useState('latest');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/search/category/Clutch%20Bag");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch Clutch Bag products:", error);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return (a.prices?.medium || 0) - (b.prices?.medium || 0);
      case 'price-high':
        return (b.prices?.medium || 0) - (a.prices?.medium || 0);
      case 'latest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popularity':
        return (b.sold || 0) - (a.sold || 0);
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="summer-page">
        <div className="summer-header">
          <div className="summer-title">
            <h2>Clutch Bag Collection 2025</h2>
            <p className="summer-breadcrumb">
              Home / Shop / Accessories / <span>Clutch Bag</span>
            </p>
          </div>
          <div className="summer-sort">
            <span>
              Showing 1–{products.length} of {products.length} results
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Sort by latest</option>
              <option value="popularity">Sort by popularity</option>
              <option value="price-low">Sort by price: low to high</option>
              <option value="price-high">Sort by price: high to low</option>
            </select>
          </div>
        </div>

        <div className="summer-product-grid">
          {sortedProducts.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="product-card-link login-route"
            >
              <div className="summer-card">
                {product.discount && (
                  <div className="summer-discount-badge">
                    {product.discount}% Off
                  </div>
                )}

                <img
                  src={
                    product.image
                      ? `http://localhost:5000/images/${product.image}`
                      : "/placeholder.png"
                  }
                  alt={product.name}
                  className="summer-card-image"
                />
                <h3 className="summer-card-brand">{product.brand}</h3>
                <p className="summer-card-name">{product.name}</p>
                <div className="summer-card-prices">
                  <span className="summer-card-original">
                    Rs {product.prices?.large || '-'}
                  </span>
                  <span className="summer-card-sale">
                    Rs {product.prices?.medium || '-'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ClutchBag;
