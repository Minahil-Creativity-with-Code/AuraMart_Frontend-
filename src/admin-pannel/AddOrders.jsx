import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialState = {
    customerName: '',
    email: '',
    phone: '',
    address: '',
    selectedProducts: [],
    quantity: 1,
    status: 'Pending',
  };

  const [orderData, setOrderData] = useState(initialState);
  const [productOptions, setProductOptions] = useState([]);

  const getId = (maybeObj) =>
    typeof maybeObj === 'object' && maybeObj !== null ? String(maybeObj._id) : String(maybeObj);
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProductOptions(res.data || []);
      } catch (err) {
        console.error('Error fetching products:', err.message);
      }
    };
    fetchProducts();
  }, []);
  // Fetch order when editing
  useEffect(() => {
    if (!id || productOptions.length === 0) return;

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        const order = res.data;

        const selectedProds = order.items
          .map((item) => {
            const itemProdId = getId(item.productId);
            return productOptions.find((p) => String(p._id) === itemProdId) || null;
          })
          .filter(Boolean);

        setOrderData({
          customerName: order.customerName || '',
          email: order.email || '',
          phone: order.phone || '',
          address: order.shippingAddress?.addressLine || '',
          selectedProducts: selectedProds,
          quantity: order.items?.[0]?.quantity || 1,
          status: order.status || 'Pending',
        });
      } catch (err) {
        console.error('Error fetching order:', err.message);
        toast.error('Order not found!');
        navigate('/order');
      }
    };
    fetchOrder();
  }, [id, productOptions, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };
  const handleProductSelect = (selectedList) =>
    setOrderData((prev) => ({ ...prev, selectedProducts: selectedList }));

  const handleProductRemove = (selectedList) =>
    setOrderData((prev) => ({ ...prev, selectedProducts: selectedList }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = '64dabc1234567890ef123456'; // replace with real auth user

    const items = orderData.selectedProducts.map((prod) => {
      const price = prod.prices?.medium ?? 0;
      return {
        productId: prod._id,
        quantity: parseInt(orderData.quantity, 10),
        price,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const payload = {
      userId,
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      items,
      totalAmount,
      shippingAddress: {
        addressLine: orderData.address || '',
        city: '',
        postalCode: '',
        country: '',
      },
      status: orderData.status,
    };

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/orders/${id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('✅ Order updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/orders', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('✅ Order created successfully!');
      }
      navigate('/order');
    } catch (err) {
      console.error('❌ Error saving order:', err.response?.data || err.message);
      toast.error('Failed to save order.');
    }
  };

  return (
    <div className="order-container">
      <div className="order-form-box">
        <h2 className="title">{id ? 'Edit Order' : 'Add Order'}</h2>

        <form className="order-form" onSubmit={handleSubmit}>
          <div className="grid">
            <input
              name="customerName"
              type="text"
              placeholder="Customer Name"
              value={orderData.customerName}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={orderData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid">
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={orderData.phone}
              onChange={handleChange}
            />
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={orderData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Select Products</label>
            <Multiselect
              options={productOptions}
              displayValue="name"
              selectedValues={orderData.selectedProducts}
              onSelect={handleProductSelect}
              onRemove={handleProductRemove}
              showCheckbox
              placeholder="Choose products"
              avoidHighlightFirstOption
              className="order-multiselect"
            />
          </div>
          <div className="grid">
            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Quantity"
              value={orderData.quantity}
              onChange={handleChange}
              required
            />
            <select name="status" value={orderData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit" className="order-submit-btn">
            {id ? 'Update Order' : 'Add Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrders;
