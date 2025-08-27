import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const CartEmpty = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart || !Array.isArray(cart)) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <FaShoppingCart className="cart-empty-icon" />
          <h2>Loading cart...</h2>
          <p>Please wait while we load your cart.</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    const item = cart.find(item => item.id === itemId);
    if (newQuantity > 0 && newQuantity <= item?.maxQuantity) {
      updateQuantity(itemId, newQuantity);
      if (newQuantity === 1) {
        toast.info(`Quantity updated to ${newQuantity}`);
      } else {
        toast.success(`Quantity updated to ${newQuantity}`);
      }
    } else if (newQuantity === 0) {
      updateQuantity(itemId, 0);
      toast.error(`${item?.name || 'Product'} removed from cart`);
      
      if (cart.length === 1) {
        toast.info('Cart is now empty');
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    const willBeEmpty = cart.length === 1;
    
    removeFromCart(itemId);
    toast.error(`${item?.name || 'Product'} removed from cart`);
    
    if (willBeEmpty) {
      toast.info('Cart is now empty');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="cart-empty">
          <div className="cart-empty-content">
            <FaShoppingCart className="cart-empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <button onClick={handleContinueShopping} className="continue-shopping-btn">
              <FaArrowLeft />
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <span className="cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
          </div>

          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={`http://localhost:5000/images/${item.image}`} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'http://localhost:5000/images/default.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-attributes">
                      {item.size && <span className="attribute">Size: {item.size}</span>}
                      {item.color && <span className="attribute">Color: {item.color}</span>}
                    </div>
                    <div className="item-price">Rs {item.price} PKR</div>
                  </div>

                  <div className="item-quantity">
                    <label>Qty:</label>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (item.maxQuantity || 999)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <span className="stock-info">Max: {item.maxQuantity || 'N/A'}</span>
                  </div>

                  <div className="item-total">
                    <span className="total-amount">Rs {(item.price * item.quantity).toFixed(2)} PKR</span>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'}):</span>
                <span>Rs {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} PKR</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} PKR</span>
              </div>
              
              <div className="cart-actions">
                <button onClick={handleCheckout} className="checkout-btn">
                  Proceed to Checkout
                </button>
                <button onClick={() => {
                  clearCart();
                  toast.success('Cart cleared successfully');
                }} className="clear-cart-btn">
                  Clear Cart
                </button>
              </div>
              
              <button onClick={handleContinueShopping} className="continue-shopping-btn">
                <FaArrowLeft />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartEmpty;
