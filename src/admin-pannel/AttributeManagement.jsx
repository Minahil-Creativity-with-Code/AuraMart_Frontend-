import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaRegUser, FaUserFriends } from 'react-icons/fa';
import { MdDelete, MdSpaceDashboard, MdBorderColor } from 'react-icons/md';
import { AiOutlineProduct } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GoDotFill } from "react-icons/go";
import { toast } from 'react-toastify';

const AttributeManagement = () => {
  const [attributes, setAttributes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    values: []
  });
  const [newValue, setNewValue] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const navigate = useNavigate(); // ✅ Added here

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attributes');
      setAttributes(response.data);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      toast.error('Failed to fetch attributes');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      setFormData(prev => ({
        ...prev,
        values: [...prev.values, newValue.trim()]
      }));
      setNewValue('');
    }
  };

  const handleRemoveValue = (index) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.values.length === 0) {
              toast.error('Please add at least one value');
      return;
    }

    try {
      if (editingAttribute) {
        await axios.put(`http://localhost:5000/api/attributes/${editingAttribute._id}`, formData);
        toast.success('Attribute updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/attributes', formData);
        toast.success('Attribute added successfully!');
      }

      setIsModalOpen(false);
      setEditingAttribute(null);
      setFormData({ name: '', type: 'color', values: [] });
      fetchAttributes();
    } catch (error) {
      console.error('Error saving attribute:', error);
              toast.error('Failed to save attribute');
    }
  };

  const handleEdit = (attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      values: [...attribute.values]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (attributeId) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        await axios.delete(`http://localhost:5000/api/attributes/${attributeId}`);
        toast.success('Attribute deleted successfully!');
        fetchAttributes();
      } catch (error) {
        console.error('Error deleting attribute:', error);
        toast.error('Failed to delete attribute');
      }
    }
  };

  const openModal = () => {
    setEditingAttribute(null);
    setFormData({ name: '', values: [] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAttribute(null);
    setFormData({ name: '', values: [] });
    setNewValue('');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // ✅ now works
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
                <Link to="/categories">
                  <GoDotFill /> Categories
                </Link>
              </li>
              <li>
                <Link to="/attributes"  className="active">
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
          <h1>Attributes</h1>
          <button onClick={openModal} className="add-button">
            <FaPlus /> Add Attribute
          </button>
        </div>
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Values</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attribute) => (
                <tr key={attribute._id}>
                  <td>{attribute.name}</td>
                  <td>
                    {attribute.values.map((value, index) => (
                      <span key={index} className="value-tag">
                        {value}
                      </span>
                    ))}
                  </td>
                  <td className="actions">
                    <button onClick={() => handleEdit(attribute)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(attribute._id)}>
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              {attributes.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No attributes found.</td>
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
                <h2>{editingAttribute ? 'Edit Attribute' : 'Add Attribute'}</h2>
                <button onClick={closeModal} className="close-btn">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Attribute Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Values *</label>
                  <div className="values-input">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Add a value"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddValue())}
                    />
                    <button type="button" onClick={handleAddValue} className="add-value-btn">
                      Add
                    </button>
                  </div>
                  <div className="values-list">
                    {formData.values.map((value, index) => (
                      <span key={index} className="value-tag">
                        {value}
                        <button
                          type="button"
                          onClick={() => handleRemoveValue(index)}
                          className="remove-value-btn"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingAttribute ? 'Update' : 'Save'} Attribute
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

export default AttributeManagement;
