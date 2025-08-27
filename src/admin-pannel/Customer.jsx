import React, { useState } from 'react';
import { AiOutlineProduct } from "react-icons/ai";
import { MdSpaceDashboard, MdBorderColor } from "react-icons/md";
import { FaUserFriends, FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";

const customers = [
  { name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-345-6789', address: '789 Pine Rd, Miami, FL', city: 'Miami' },
  { name: 'Diana Parker', email: 'diana.parker@example.com', phone: '555-876-4321', address: '101 Maple St, Chicago, IL', city: 'Chicago' },
  { name: 'Ethan Hall', email: 'ethan.hall@example.com', phone: '555-234-1122', address: '202 Birch Blvd, Seattle, WA', city: 'Seattle' },
  { name: 'Fiona Davis', email: 'fiona.davis@example.com', phone: '555-765-9876', address: '303 Cedar Ct, Houston, TX', city: 'Houston' },
  { name: 'George Miller', email: 'george.miller@example.com', phone: '555-333-4455', address: '404 Elm Dr, Austin, TX', city: 'Austin' },
  { name: 'Hannah Lee', email: 'hannah.lee@example.com', phone: '555-989-1212', address: '505 Spruce Ln, San Diego, CA', city: 'San Diego' },
  { name: 'Isaac Turner', email: 'isaac.turner@example.com', phone: '555-444-7788', address: '606 Walnut Way, Atlanta, GA', city: 'Atlanta' },
  { name: 'Jasmine White', email: 'jasmine.white@example.com', phone: '555-222-6633', address: '707 Willow Rd, Denver, CO', city: 'Denver' },
  { name: 'Kevin Grant', email: 'kevin.grant@example.com', phone: '555-111-3344', address: '808 Magnolia Pl, Orlando, FL', city: 'Orlando' },
  { name: 'Lily Anderson', email: 'lily.anderson@example.com', phone: '555-555-9090', address: '909 Aspen Trl, Boston, MA', city: 'Boston' },
  { name: 'Mason Carter', email: 'mason.carter@example.com', phone: '555-777-2211', address: '111 Oak St, Phoenix, AZ', city: 'Phoenix' },
  { name: 'Natalie Brooks', email: 'natalie.brooks@example.com', phone: '555-888-3344', address: '222 Pine Ave, Dallas, TX', city: 'Dallas' },
  { name: 'Oscar Reed', email: 'oscar.reed@example.com', phone: '555-999-5566', address: '333 Birch Ln, San Jose, CA', city: 'San Jose' },
  { name: 'Paula Scott', email: 'paula.scott@example.com', phone: '555-666-7788', address: '444 Maple Dr, Columbus, OH', city: 'Columbus' },
  { name: 'Quentin Hayes', email: 'quentin.hayes@example.com', phone: '555-123-9900', address: '555 Cedar St, Indianapolis, IN', city: 'Indianapolis' },
  { name: 'Rachel Foster', email: 'rachel.foster@example.com', phone: '555-234-4455', address: '666 Elm Ave, Charlotte, NC', city: 'Charlotte' },
  { name: 'Samuel Price', email: 'samuel.price@example.com', phone: '555-789-5566', address: '777 Walnut Blvd, Nashville, TN', city: 'Nashville' },
  { name: 'Tina Ward', email: 'tina.ward@example.com', phone: '555-876-6677', address: '888 Spruce Cir, Portland, OR', city: 'Portland' },
  { name: 'Umar Khan', email: 'umar.khan@example.com', phone: '555-345-7788', address: '999 Willow Way, Tampa, FL', city: 'Tampa' },
  { name: 'Vanessa Lopez', email: 'vanessa.lopez@example.com', phone: '555-567-8899', address: '1010 Magnolia Rd, Las Vegas, NV', city: 'Las Vegas' }

];

const Customer = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const navigate = useNavigate(); // ✅ moved inside component

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCity === '' || customer.city.toLowerCase() === selectedCity.toLowerCase())
  );

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
            <Link to="/dashboard" className="active">
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
          <h1>Previous Customers</h1>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            <option value="Miami">Miami</option>
            <option value="Chicago">Chicago</option>
            <option value="Houston">Houston</option>
            <option value="Boston">Boston</option>
          </select>
          {(searchTerm || selectedCity) && (
            <button onClick={() => { setSearchTerm(''); setSelectedCity(''); }}>
              <RxCross1 />
            </button>
          )}
        </div>

        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.address}</td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No customers found.
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

export default Customer;
