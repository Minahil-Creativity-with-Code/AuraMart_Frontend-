import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch order:', err);
        toast.error('Order not found.');
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="view-product-wrapper">
      <div className="product-details">
        <h2>Order #{order._id}</h2>

        <div className="ratings">
          <strong>Status:</strong> {order.status}
        </div>

        <p className="price">
          Total Amount: ${order.totalAmount}
        </p>

        <p className="stock">
          <strong>Shipping:</strong>{' '}
          {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.street || ''}
        </p>

        <p className="short-desc">
          <strong>Customer Name:</strong> {order.customerName || order.user?.name || 'N/A'}
        </p>

        <div className="expandable-description">
          <h4>Order Items</h4>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <p><strong>Product:</strong> {item.productId?.name || 'Unknown Product'}</p>
                <p><strong>Category:</strong> {item.productId?.category || 'N/A'}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No items found in this order.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
