import React from "react";
import { FaFacebookF, FaInstagram, FaPinterest } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <div className="footer-text">
          {/* Logo */}
          <h2>AuraMart</h2>
          <p>
            "Discover the latest trends in Pakistani fashion, only at AuraMart Store"
          </p>
        </div>
        {/* Quick Links */}
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>Return Policy</li>
              <li>Blog</li>
              <li>Contact Us</li>
            </ul>
          </div>
          {/* Why AuraMart */}
          <div className="footer-column">
            <h3>Why AuraMart</h3>
            <ul>
              <li>Cash on Delivery <span>CASH ON DELIVERY</span></li>
              <li>Free Shipping <span>FREE SHIPPING</span></li>
              <li>Return Policy <span>EASY RETURNS & EXCHANGES</span></li>
            </ul>
          </div>
          {/* Contact info */}
          <div className="footer-column">
            <h3>Find Us</h3>
            <ul>
              <li><FaLocationDot /> : Lahore, Pakistan</li>
              <li><IoCall /> : +92 ********</li>
              <li><MdEmail /> : abc@AuraMart.com</li>
            </ul>
          </div>
        </div>
        {/* Social Media links  */}
        <div className="footer-social">
          <span>
            <span> <a href="https://www.AuraMartreplicastore.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a></span>
            <span>  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a></span>
            <span></span> <a href="mailto:minahil@purelogics.net" target="_blank" rel="noopener noreferrer">
              <IoMail />
            </a></span>
          <span> <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer">
            <FaPinterest />
          </a>
          </span>
        </div>
        {/* CopyRight  */}
        <div className="footer-divider"></div>
        <p className="footer-bottom-text">© 2025 AuraMart Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
