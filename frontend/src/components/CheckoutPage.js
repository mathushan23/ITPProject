import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cookies from 'js-cookie';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};

  const customerName = userSession?.user?.username || '';
  
  const PhoneNumber = userSession?.user?.phone || '';
  const Address = userSession?.user?.address || '';
  const Email = userSession?.user?.email || '';

  const handleConfirmOrder = async () => {
    const orderData = {
      customerName,
      PhoneNumber,
      Address,
      Email,
      products: cartItems.map(item => ({
        productId: item._id || null,
        productName: item.title || item.name || item.product || 'Unnamed Product', // ✅ safer fallback
        quantity: item.quantity,
        Amount: item.price,
        image: item.imageUrl ? item.imageUrl.replace('http://localhost:4000/uploads/', '') : null
      })),
      Image: '',
      TotalAmount: totalPrice
    };
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/orders/checkout', orderData);
      clearCart();
      if (response) {
        alert('Order placed successfully!');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
    navigate('/client/customerorder');
  };
  

  const handleCancelOrder = () => {
    navigate('/client/addCart');
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Checkout</h2>
        <p className="text-muted">Review your cart before confirming your order.</p>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Order Summary</h5>
        </div>
        <div className="card-body">
          {cartItems.length > 0 ? (
            <>
              {/* Customer Details */}
              <div className="mb-3">
                <h5 className="mb-2">Customer Details</h5>
                <p><strong>Name:</strong> {customerName}</p>
              
                <p><strong>Phone:</strong> {PhoneNumber}</p>
                <p><strong>Address:</strong> {Address}</p>
                <p><strong>Email:</strong> {Email}</p>
              </div>

              {/* Estimated Delivery */}
              <div className="alert alert-info">
                Estimated delivery within 3–5 working days.
              </div>

              {/* Product Table */}
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Image</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.title}</td>
                        <td>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <span className="text-muted">No image</span>
                          )}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toFixed(2)} LKR</td>
                        <td>{(item.price * item.quantity).toFixed(2)} LKR</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-end fw-bold">Total:</td>
                      <td className="fw-bold">{totalPrice.toFixed(2)} LKR</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <p className="text-muted">Your cart is empty.</p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" onClick={handleCancelOrder}>
          Cancel
        </button>
        <button
          className="btn btn-success"
          onClick={handleConfirmOrder}
          disabled={cartItems.length === 0 || loading}
        >
          {loading ? 'Processing...' : 'Confirm & Continue'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
