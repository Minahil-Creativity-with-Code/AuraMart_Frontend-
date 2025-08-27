import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ShopCards = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading categories...</p>;
  }

  return (
    <div className="shop-container">
      <h2 className="shop-title">Shop</h2>
      <p className="breadcrumb">
        Home / <span>Shop</span>
      </p>
      <div className="categories-grid">
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
            key={cat._id}
            className="category-card"
          >
            <img
              src={`http://localhost:5000/images/${cat.image}`}
              alt={cat.name}
              onError={(e) => {
                e.target.src = "http://localhost:5000/images/default.jpg";
              }}
            />
            <div className="category-info">
              <h3>{cat.name}</h3>
              <p>{cat.productCount ? `${cat.productCount} PRODUCTS` : ""}</p>
            </div>
          </Link>
        ))}
        {categories.length === 0 && (
          <p style={{ textAlign: "center" }}>No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default ShopCards;
