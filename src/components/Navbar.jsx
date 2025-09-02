import React, { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getCartCount, getCartTotal } = useCart();

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
          <NavLink
            to="/shop"
            className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}
          >
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/category/summer"
            className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}
          >
            Summer Collection  ▾
          </NavLink>
          <div className="dropdown">
            <NavLink to="/category/lawn">Lawn</NavLink>
            <NavLink to="/category/embroidered-lawn">Embroidered </NavLink>
          </div>
        </li>

        <li>
          <NavLink
            to="/category/winter"
            className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}
          >
            Winter Collection  ▾
          </NavLink>
          <div className="dropdown">
            <NavLink to="/category/linen">Linen</NavLink>
            <NavLink to="/category/silk">Silk</NavLink>
          </div>
        </li>

        <li>
          <NavLink
            to="/category/gents"
            className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}
          >
            Gents
          </NavLink>
        </li>
         <li>
          <NavLink
            to="/category/featured"
            className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}
          >
            Featured
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/category/party"
            className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}
          >
            Party Wear ▾
          </NavLink>
          <div className="dropdown">
            <NavLink to="/category/clutch-bag">Clutch Bag</NavLink>
            <NavLink to="/category/silk">Silk</NavLink>
            <NavLink to="/category/organza">Organza</NavLink>
          </div>
        </li>

        <li>
          <NavLink
            to="/category/home-decor"
            className={({ isActive }) => isActive ? 'nav-route active' : 'nav-route'}
          >
            Home Decor ▾
          </NavLink>
          <div className="dropdown">
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
