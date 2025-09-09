import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaTruck, FaCheckCircle, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StripePayment from './StripePayment';

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

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
      <div className="emptycart-container">
        <div className="emptycart-box">
          <FaCheckCircle className="emptycart-icon" />
          <h2>Your cart is empty</h2>
          <p>Please add some products to your cart before checkout.</p>
          <button onClick={() => navigate('/shop')} className="emptycart-btn">
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

    // live validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors(prev => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "Invalid email address"
      }));
    }

    if (name === "phone") {
      setErrors(prev => ({
        ...prev,
        phone: /^\d{11}$/.test(value) ? "" : "Phone number must be 11 digits"
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{11}$/.test(formData.phone)) newErrors.phone = "Phone number must be 11 digits";

    if (!formData.addressLine) newErrors.addressLine = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user?._id || "64dabc1234567890ef123456",
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
        })),
        paymentMethod: paymentMethod
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', orderData);

      if (response.status === 201) {
        if (paymentMethod === 'Cash on Delivery') {
          toast.success('Order placed successfully! Pay on delivery.');
          clearCart();
          navigate('/order-success', {
            state: { order: response.data, orderData }
          });
        } else {
          setCurrentOrder(response.data);
          setOrderPlaced(true);
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(`Failed to place order: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (order) => {
    toast.success('Payment successful! Order confirmed.');
    clearCart();
    navigate('/order-success', {
      state: { order: order, orderData: { ...formData, paymentMethod: 'Stripe' } }
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 200;
  const total = subtotal + shipping;

  // Stripe form after order
  if (orderPlaced && paymentMethod === 'Stripe' && currentOrder) {
    return (
      <div className="payment-container">
        <div className="payment-box">
          <div className="payment-header">
            <button onClick={() => setOrderPlaced(false)} className="back-btn">
              <FaArrowLeft /> Back to Checkout
            </button>
            <h1>Complete Payment</h1>
          </div>

          <div className="payment-content">
            <h2>Order Summary</h2>
            <div className="payment-summary">
              <p><strong>Order ID:</strong> {currentOrder._id}</p>
              <p><strong>Total Amount:</strong> Rs {total.toFixed(2)} PKR</p>
            </div>

            <h2>Payment Details</h2>
            <StripePayment
              amount={total}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              orderId={currentOrder._id}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-btn">
            <FaArrowLeft /> Back to Cart
          </button>
          <h1>Checkout</h1>
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
              {errors.customerName && <p className="error">{errors.customerName}</p>}

              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}

              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                maxLength="11"
              />
              {errors.phone && <p className="error">{errors.phone}</p>}

              <label>Address *</label>
              <input
                type="text"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleInputChange}
                placeholder="Street address, apartment, suite, etc."
                required
              />
              {errors.addressLine && <p className="error">{errors.addressLine}</p>}

              {/* Payment Method Selection */}
              <div className="payment-method-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => handlePaymentMethodChange('Cash on Delivery')}
                    />
                    <FaMoneyBillWave className="payment-icon" />
                    <span>Cash on Delivery</span>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'Stripe' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Stripe"
                      checked={paymentMethod === 'Stripe'}
                      onChange={() => handlePaymentMethodChange('Stripe')}
                    />
                    <FaCreditCard className="payment-icon" />
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="place-order-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' :
                  paymentMethod === 'Cash on Delivery' ? 'Place Order (Cash on Delivery)' :
                    'Place Order & Proceed to Payment'
                }
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

            {/* Payment Method Info */}
            <div className="payment-info">
              <h4>Selected Payment Method:</h4>
              <div className="selected-payment">
                {paymentMethod === 'Cash on Delivery' ? (
                  <>
                    <FaMoneyBillWave />
                    <span>Cash on Delivery - Pay when you receive your order</span>
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    <span>Credit/Debit Card - Secure payment via Stripe</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
