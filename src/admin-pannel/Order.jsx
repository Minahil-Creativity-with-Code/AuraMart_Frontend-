import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaPlus, FaRegUser, FaUserFriends } from 'react-icons/fa';
import { MdDelete, MdSpaceDashboard, MdBorderColor } from 'react-icons/md';
import { AiOutlineProduct } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import { GoDotFill } from "react-icons/go";
import { toast } from 'react-toastify';

const AdminOrderPanel = () => {
  const [orders, setOrders] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      axios.delete(`http://localhost:5000/api/orders/${id}`)
        .then(() => setOrders(prev => prev.filter(o => o._id !== id)))
        .catch(err => {
          console.error('Failed to delete order:', err);
          toast.error('Error deleting order.');
        });
    }
  };

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      order.user?.name?.toLowerCase().includes(term) ||
      order._id?.toLowerCase().includes(term) ||
      order.status?.toLowerCase().includes(term)
    );
    const matchesCategory = selectedCategory === '' || order.status === selectedCategory;
    return matchesSearch && matchesCategory;
  });
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
            <Link to="/dashboard" >
              <MdSpaceDashboard /> Dashboard
            </Link>
            <div className="div-sidebar">
              <div
                className={`dropdown-product ${productDropdownOpen ? "active" : ""}`}
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              >
                <AiOutlineProduct /> Products ▾
              </div>
            </div>
            <ul className={`extend ${productDropdownOpen ? "show" : ""}`}>
              <li>
                <Link to="/products">
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
            <Link to="/order" className="active">
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
          <h1>Orders</h1>
          <Link to="/addorder">
            <button className="add-button"><FaPlus /> Add Order</button>
          </Link>
        </div>

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
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
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

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.status}</td>
                  <td>${order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/addorder/${order._id}`}>
                      <button><FaEdit /></button>
                    </Link>
                    <button onClick={() => handleDelete(order._id)}>
                      <MdDelete />
                    </button>
                    <Link to={`/vieworder/${order._id}`}>
                      <button><FaEye /></button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderPanel;
