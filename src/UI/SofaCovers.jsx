import React, { useEffect, useState } from 'react';
import Layout from "../components/Layout";
import { Link } from 'react-router-dom';
import axios from 'axios';

const SofaCovers = () => {
  const [sortOption, setSortOption] = useState('latest');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/search/category/Sofa Covers");
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
      <div className="textile-wrapper">
        <div className="textile-header">
          <div className="textile-info">
            <h2>Sofa Covers</h2>
            <p className="breadcrumb">Home / Shop / <span>Sofa Covers</span></p>
          </div>
          <div className="summer-sort">
            <span>Showing 1–{sortedProducts.length} of {products.length} results</span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="latest">Sort by latest</option>
              <option value="popularity">Sort by popularity</option>
              <option value="price-low">Sort by price: low to high</option>
              <option value="price-high">Sort by price: high to low</option>
            </select>
          </div>
        </div>

        <div className="textile-grid">
          {sortedProducts.map((product) => (
             <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="product-card-link login-route"
          >
            <div className="textile-card" key={product._id}>
              <div className="textile-image-wrapper">
                {product.tag && <span className="badge tag">{product.tag}</span>}
                {product.discount && <span className="badge discount">{product.discount}</span>}
                 <img
                  src={`http://localhost:5000/images/${product.image}`}
                  alt={product.name}
                />
                {product.outOfStock && <div className="badge stock-status">OUT OF STOCK</div>}
              </div>
              <h4>{product.name}</h4>
              {product.prices?.medium && <p className="price">PKR {product.prices.medium}</p>}
            </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SofaCovers;
