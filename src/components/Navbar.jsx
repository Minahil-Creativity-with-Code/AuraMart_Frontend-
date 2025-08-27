import React, { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { getCartCount, getCartTotal } = useCart();

  // toggle dropdown for mobile
  const handleDropdownToggle = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="grace-navbar">
      {/* Logo */}
      <Link to='/' className="logo route">
        <span className="grace">AuraMart</span>
        <sup>®</sup>
      </Link>

      {/* Hamburger Icon (only visible on small screens) */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      {/* Navbar Links */}
      <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <li>
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}>
            Shop
          </NavLink>
        </li>

        {/* Summer Collection */}
        <li>
          <div
            className="nav-parent"
            onClick={() => handleDropdownToggle('summer')}
          >
            <span className="nav-route">Summer Collection ▾</span>
          </div>
          <div className={`dropdown ${openDropdown === 'summer' ? 'open' : ''}`}>
            <NavLink to="/category/lawn">Lawn</NavLink>
            <NavLink to="/category/embroidered-lawn">Embroidered</NavLink>
          </div>
        </li>

        {/* Winter Collection */}
        <li>
          <div
            className="nav-parent"
            onClick={() => handleDropdownToggle('winter')}
          >
            <span className="nav-route">Winter Collection ▾</span>
          </div>
          <div className={`dropdown ${openDropdown === 'winter' ? 'open' : ''}`}>
            <NavLink to="/category/linen">Linen</NavLink>
            <NavLink to="/category/silk">Silk</NavLink>
          </div>
        </li>

        <li>
          <NavLink to="/category/gents" className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}>
            Gents
          </NavLink>
        </li>

        <li>
          <NavLink to="/category/featured" className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}>
            Featured
          </NavLink>
        </li>

        {/* Party Wear */}
        <li>
          <div
            className="nav-parent"
            onClick={() => handleDropdownToggle('party')}
          >
            <span className="nav-route">Party Wear ▾</span>
          </div>
          <div className={`dropdown ${openDropdown === 'party' ? 'open' : ''}`}>
            <NavLink to="/category/clutch-bag">Clutch Bag</NavLink>
            <NavLink to="/category/silk">Silk</NavLink>
            <NavLink to="/category/organza">Organza</NavLink>
          </div>
        </li>

        {/* Home Decor */}
        <li>
          <div
            className="nav-parent"
            onClick={() => handleDropdownToggle('home')}
          >
            <span className="nav-route">Home Decor ▾</span>
          </div>
          <div className={`dropdown ${openDropdown === 'home' ? 'open' : ''}`}>
            <NavLink to="/category/bedding">Bedding</NavLink>
            <NavLink to="/category/mattress-covers">Mattress Covers</NavLink>
            <NavLink to="/category/sofa-covers">Sofa Covers</NavLink>
            <NavLink to="/category/washing-machine-covers">Washing Machine Covers</NavLink>
          </div>
        </li>
      </ul>

      {/* Cart */}
      <div className="cart">
        <NavLink to='/cart' className='nav-route'>
          CART / <span>Rs{getCartTotal()}</span> PKR <FaShoppingCart />
          {getCartCount() > 0 && (
            <span className="cart-count">{getCartCount()}</span>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
