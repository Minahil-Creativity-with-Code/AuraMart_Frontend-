import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('latest');
  const [loading, setLoading] = useState(true);

  // Category display names mapping
  const categoryDisplayNames = {
    'summer': 'Summer Collection 2025',
    'winter': 'Winter Collection 2025',
    'lawn': 'Lawn',
    'embroidered-lawn': 'Embroidered Lawn',
    'linen': 'Linen',
    'silk': 'Silk',
    'organza': 'Organza',
    'gents': 'Gents Collection',
    'party': 'Party Wear',
    'home-decor': 'Home Decor',
    'bedding': 'Bedding',
    'clothing': 'Clothing',
    'clutch-bag': 'Clutch Bag',
    'mattress-covers': 'Mattress Covers',
    'sofa-covers': 'Sofa Covers',
    'washing-machine-covers': 'Washing Machine Cover',
    'featured': 'Featured Products'
  };

  // Category breadcrumb mapping
  const categoryBreadcrumbs = {
    'summer': 'Home / Shop / Clothing',
    'winter': 'Home / Shop / Clothing',
    'lawn': 'Home / Shop / Clothing',
    'embroidered-lawn': 'Home / Shop / Clothing',
    'linen': 'Home / Shop / Clothing',
    'silk': 'Home / Shop / Clothing',
    'organza': 'Home / Shop / Clothing',
    'gents': 'Home / Shop / Clothing',
    'party': 'Home / Shop / Clothing',
    'home-decor': 'Home / Shop / Home Decor',
    'bedding': 'Home / Shop / Home Decor',
    'clothing': 'Home / Shop / Clothing',
    'clutch-bag': 'Home / Shop / Accessories',
    'mattress-covers': 'Home / Shop / Home Decor',
    'sofa-covers': 'Home / Shop / Home Decor',
    'washing-machine-covers': 'Home / Shop / Home Decor',
    'featured': 'Home / Shop / Featured'
  };

  // API category mapping (for backend calls)
  const apiCategoryMapping = {
    'summer': 'Summer',
    'winter': 'Winter',
    'lawn': 'Lawn',
    'embroidered-lawn': 'Embroidered Lawn',
    'linen': 'Linen',
    'silk': 'Silk',
    'organza': 'Organza',
    'gents': 'Gents',
    'party': 'Party Wear',
    'home-decor': 'Home Decor',
    'bedding': 'Bedding',
    'clothing': 'Clothing',
    'clutch-bag': 'Clutch%20Bag',
    'mattress-covers': 'Mattress Covers',
    'sofa-covers': 'Sofa Covers',
    'washing-machine-covers': 'Washing Machine Cover',
    'featured': 'Featured'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiCategory = apiCategoryMapping[category] || category;
        console.log(`Fetching products for category: ${category} -> API category: ${apiCategory}`);
        const res = await axios.get(`http://localhost:5000/api/products/search/category/${apiCategory}`);
        console.log(`Products found:`, res.data);
        setProducts(res.data);
      } catch (error) {
        console.error(`Failed to fetch ${category} products:`, error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

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

  if (loading) {
    return (
      <Layout>
        <div className="summer-page">
          <div className="summer-header">
            <div className="summer-title">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="summer-page">
        <div className="summer-header">
          <div className="summer-title">
            <h2>{categoryDisplayNames[category] || category}</h2>
            <p className="summer-breadcrumb">
              {categoryBreadcrumbs[category] || 'Home / Shop'} / <span>{categoryDisplayNames[category] || category}</span>
            </p>
          </div>
          <div className="summer-sort">
            <span>Showing 1–{products.length} of {products.length} results</span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="latest">Sort by latest</option>
              <option value="popularity">Sort by popularity</option>
              <option value="price-low">Sort by price: low to high</option>
              <option value="price-high">Sort by price: high to low</option>
            </select>
          </div>
        </div>

        <div className="summer-product-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <Link 
                key={product._id} 
                to={`/product/${product._id}`} 
                className="product-card-link login-route"
              >
                <div className="summer-card">
                  {product.discount && (
                    <div className="summer-discount-badge">{product.discount}% Off</div>
                  )}

                  <img
                    src={`http://localhost:5000/images/${product.image}`}
                    alt={product.name}
                    className="summer-card-image"
                  />
                  <h3 className="summer-card-brand">{product.brand}</h3>
                  <p className="summer-card-name">{product.name}</p>
                  <div className="summer-card-prices">
                    {product.prices?.medium && product.prices?.large ? (
                      <span className="summer-card-range">
                        Rs{product.prices.medium} – Rs{product.prices.large}
                      </span>
                    ) : (
                      <span className="summer-card-single">
                        Rs{product.prices?.medium || product.prices?.large || '-'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-products">
              <p>No products found in this category.</p>
              <p>Category: {category}</p>
              <p>API Category: {apiCategoryMapping[category] || category}</p>
              <p>Total products: {products.length}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
