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

const AdminUserPanel = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      setDeletingId(id);
      axios
        .delete(`http://localhost:5000/api/users/${id}`)
        .then(() => setUsers((prev) => prev.filter((u) => u._id !== id)))
        .catch((error) => {
          console.error('Error deleting user:', error);
          toast.error('Error deleting user.');
        })
        .finally(() => setDeletingId(null));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // ✅ Filtering
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      user?.name?.toLowerCase().includes(term) ||
      user?.email?.toLowerCase().includes(term);

    const matchesRole =
      selectedRole === '' ||
      user?.role?.trim().toLowerCase() === selectedRole.trim().toLowerCase();

    return matchesSearch && matchesRole;
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
            <Link to="/order">
              <MdBorderColor /> Orders
            </Link>
            <Link to="/customer">
              <FaUserFriends /> Customers
            </Link>
            <Link to="/user" className="active">
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
          <h1>Users</h1>
          <Link to="/addUser">
            <button className="add-button">
              <FaPlus /> Add User
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {(searchTerm || selectedRole) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('');
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
                <th>User</th>
                <th>Role</th>
         
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="product-info">
                    <img
                      src={`http://localhost:5000/images/${user.image || 'User.jpg'}`}
                      onError={(e) => { e.target.src = "/default-user.jpg"; }}
                      alt={user.name}
                    />
                    <span>{user.name}</span>
                  </td>
                  <td>{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</td>
                
                  <td>{user.email}</td>
                  <td>{user.address || '-'}</td>
                  <td className="actions">
                    <Link to={`/addUser/${user._id}`}>
                      <button><FaEdit /></button>
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingId === user._id}
                    >
                      {deletingId === user._id ? '...' : <MdDelete />}
                    </button>
                    <Link to={`/viewUser/${user._id}`}>
                      <button><FaEye /></button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No users found.
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

export default AdminUserPanel;
