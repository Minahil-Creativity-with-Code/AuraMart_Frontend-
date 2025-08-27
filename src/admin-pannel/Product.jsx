import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaPlus, FaRegUser, FaUserFriends } from 'react-icons/fa';
import { MdDelete, MdSpaceDashboard, MdBorderColor } from 'react-icons/md';
import { AiOutlineProduct } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxCross1 } from "react-icons/rx";
import { GoDotFill } from "react-icons/go";
import { toast } from 'react-toastify';

const AdminProductPanel = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setDeletingId(id);
      axios
        .delete(`http://localhost:5000/api/products/${id}`)
        .then(() => setProducts((prev) => prev.filter((p) => p._id !== id)))
        .catch((error) => {
          console.error('Error deleting product:', error);
          toast.error('Error deleting product.');
        })
        .finally(() => setDeletingId(null));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // ✅ Filtering same as order page
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product?.name?.toLowerCase().includes(term) ||
      product?._id?.toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === '' ||
      product?.categories?.some(
        (cat) =>
          typeof cat === 'string' &&
          cat.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <Link to="/dashboard">
              <MdSpaceDashboard /> Dashboard
            </Link>
            <div className="div-sidebar">
              <div
                className={`dropdown-product ${productDropdownOpen ? 'active' : ''}`}
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              >
                <AiOutlineProduct /> Products ▾
              </div>
            </div>
            <ul className={`extend ${productDropdownOpen ? 'show' : ''}`}>
              <li>
                <Link to="/products" className="active">
                  <GoDotFill /> All Products
                </Link>
              </li>
              <li>
                <Link to="/addproduct">
                  <GoDotFill /> Add Products
                </Link>
              </li>
              <li>
                <Link to="/categories">
                  <GoDotFill /> Categories
                </Link>
              </li>
              <li>
                <Link to="/attributes">
                  <GoDotFill /> Attributes
                </Link>
              </li>
            </ul>
            <Link to="/order">
              <MdBorderColor /> Orders
            </Link>
            <Link to="/customer">
              <FaUserFriends /> Customers
            </Link>
            <Link to="/user">
              <FaRegUser /> User
            </Link>
          </ul>
        </nav>

        <div className="support">
          Customer Support
          <br />
          <Link to="/addproduct">
            <button>Connect Now</button>
          </Link>
        </div>

        <div className="user-profile">
          <img src="admin.jpg" alt="Admin" className="adminImage" />
          <div className="user-details">
            <div>
              Admin <br />
              <Link to="/userProfile" className="view">
                View Profile
              </Link>
            </div>
          </div>
        </div>
        <br />
        <button onClick={handleLogout} className="logout-button" title="Logout">
          Logout
        </button>
      </aside>

      <main className="main-content">
        <div className="header">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <GiHamburgerMenu />
          </button>
          <h1>Products</h1>
          <Link to="/addproduct">
            <button className="add-button">
              <FaPlus /> Add Product
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Featured">Featured</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>

          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              aria-label="Clear Filters"
            >
              <RxCross1 />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Categories</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="product-info">
                    <img
                      src={
                        product.image?.startsWith('http')
                          ? product.image
                          : `http://localhost:5000/images/${product.image || 'default.jpg'}`
                      }
                      alt={product.name || 'No Name'}
                    />
                    <span>{product.name || 'Unnamed Product'}</span>
                  </td>
                  <td className="categories-cell">
                    {product.categories && product.categories.length > 0 ? (
                      <div className="category-tags">
                        {product.categories.map((category, index) => (
                          <span key={index} className="category-tag">
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-category">No categories</span>
                    )}
                  </td>
                  <td>${product.prices?.medium ?? '-'}</td>
                  <td>{product.stockQuantity ?? '-'}</td>
                  <td className="actions">
                    <Link to={`/addproduct/${product._id}`}>
                      <button>
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                    >
                      {deletingId === product._id ? '...' : <MdDelete />}
                    </button>
                    <Link to={`/viewproduct/${product._id}`}>
                      <button>
                        <FaEye />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminProductPanel;
