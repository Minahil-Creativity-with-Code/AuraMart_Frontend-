import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaRegUser, FaUserFriends } from 'react-icons/fa';
import { MdDelete, MdSpaceDashboard, MdBorderColor } from 'react-icons/md';
import { AiOutlineProduct } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GoDotFill } from "react-icons/go";
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sortOrder: 0,
    image: null
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('sortOrder', formData.sortOrder);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingCategory) {
        await axios.put(`http://localhost:5000/api/categories/${editingCategory._id}`, formDataToSend);
        toast.success('Category updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/categories', formDataToSend);
        toast.success('Category added successfully!');
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', sortOrder: 0, image: null });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      sortOrder: category.sortOrder || 0,
      image: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${categoryId}`);
        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const openModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', sortOrder: 0, image: null });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', sortOrder: 0, image: null });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <Link to="/dashboard">
              <MdSpaceDashboard /> Dashboard
            </Link>
            <div className="div-sidebar">
              <div id='active'
                className={`dropdown-product ${productDropdownOpen ? "active" : ""}`}
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              >
                <AiOutlineProduct /> Products ▾
              </div>
            </div>
            <ul className={`extend ${productDropdownOpen ? "show" : ""}`}>
              <li>
                <Link to="/products" >
                  <GoDotFill /> All Products
                </Link>
              </li>
              <li>
                <Link to="/addproduct">
                  <GoDotFill /> Add Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="active">
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

      {/* Main Content */}

      <main className="main-content">
        <div className="header">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <GiHamburgerMenu />
          </button>
          <h1>Categories</h1>
          <button onClick={openModal} className="add-button">
            <FaPlus /> Add Category
          </button>
        </div>

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Sort Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="product-info">
                    <img
                      src={category.image
                        ? `http://localhost:5000/images/${category.image}`
                        : 'http://localhost:5000/images/default.jpg'}
                      alt={category.name}
                    />
                  </td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>{category.sortOrder}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(category)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(category._id)}>
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={closeModal} className="close-btn">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Category Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingCategory ? 'Update' : 'Save'} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryManagement;
