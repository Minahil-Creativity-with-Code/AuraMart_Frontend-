import React from 'react';
import { Link } from 'react-router-dom';
import Layout from "../components/Layout";
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';

const OrderSuccess = () => {
  return (
    <Layout>
      <div className="order-success-container">
        <div className="order-success-content">
          <div className="success-icon">
            <FaCheckCircle size={80}  color='#ff9100'/>
          </div>
          
          <h1>Order Placed Successfully!</h1>
          
          <div className="success-message">
            <p>Thank you for your order. We have received your order and will begin processing it shortly.</p>
            <p>You will receive an email confirmation with your order details and tracking information.</p>
          </div>

          <div className="order-details">
            <h3>What happens next?</h3>
            <ul>
              <li>We'll review your order and confirm it within 24 hours</li>
              <li>You'll receive an email with payment instructions</li>
              <li>Once payment is confirmed, we'll start processing your order</li>
              <li>You'll receive tracking information when your order ships</li>
            </ul>
          </div>

          <div className="success-actions">
            <Link to="/" className="continue-shopping-btn-order">
              <FaHome /> Continue Shopping
            </Link>
            <Link to="/shop" className="browse-more-btn">
              <FaShoppingBag /> Browse More Products
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess; 