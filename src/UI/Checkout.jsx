import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'Pakistan'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety check for cart
  if (!cart || !Array.isArray(cart)) {
    return (
      <div className="checkout-container">
        <div className="checkout-content">
          <h2>Loading checkout...</h2>
          <p>Please wait while we load your cart.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-content empty-cart">
          <FaCheckCircle className="checkout-icon" />
          <h2>Your cart is empty</h2>
          <p>Please add some products to your cart before checkout.</p>
          <button onClick={() => navigate('/shop')} className="continue-shopping-btn">
            <FaArrowLeft />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user?._id || "64dabc1234567890ef123456", // fallback if auth not connected
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          addressLine: formData.addressLine || formData.address || "",
          city: formData.city || "",
          postalCode: formData.postalCode || "",
          country: formData.country || ""
        },
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
        // Removed totalAmount - backend will calculate it
        // Removed status - backend will set default 'Pending'
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', orderData);

      if (response.status === 201) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/order-success', {
          state: { order: response.data, orderData } // FIXED
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(`Failed to place order: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-btn">
            <FaArrowLeft />
            Back to Cart
          </button>
          <h1 className='heading-checkout'>Checkout</h1>
        </div>

        <div className="checkout-grid">
          {/* Left Form Section */}
          <div className="checkout-form">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <label>Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
              />

              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />



              <label>Address *</label>
              <input
                type="text"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleInputChange}
                placeholder="Street address, apartment, suite, etc."
                required
              />



              <button type="submit" className="place-order-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Right Order Summary Section */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cart.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="item-info">
                    <img
                      src={`http://localhost:5000/images/${item.image}`}
                      alt={item.name}
                      onError={(e) => { e.target.src = 'http://localhost:5000/images/default.jpg'; }}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Color: {item.color}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="item-price">Rs {item.price} PKR</div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toFixed(2)} PKR</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `Rs ${shipping} PKR`}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs {total.toFixed(2)} PKR</span>
              </div>
            </div>

            <div className="shipping-info">
              <FaTruck />
              <span>Free shipping on orders above Rs 2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
