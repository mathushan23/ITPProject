import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure cart items have product names and proper structure
  const cart = location.state?.cart?.map(item => ({
    product: item.product || 'Unnamed Product',
    quantity: item.quantity || 1,
    price: item.price || 0,
    image: item.image || null // Include image if available
  })) || [];

  const totalAmount = cart.reduce((total, item) => total + (item.quantity * item.price), 0);

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleContinueToOrders = () => {
    navigate('/customer-orders', {
      state: {
        cart: cart,
        totalAmount: totalAmount
      }
    });
  };

  return (
    <div className="order-confirmation container mt-4">
      <h2 className="text-center mb-4">Order Confirmation</h2>
      <div className="card p-4 mb-4">
        <p className="lead">Thank you for your order! Your order has been successfully placed.</p>

        {cart.length > 0 ? (
          <div className="order-details">
            <h3 className="mb-3">Order Summary</h3>
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product}</td>
                    <td>
                      {item.image ? (
                        <img 
                          src={`http://localhost:4000/uploads/${item.image}`} 
                          alt={item.product} 
                          width="50" 
                        />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                  <td><strong>${totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="alert alert-warning">No items in the cart.</p>
        )}

        <div className="d-flex justify-content-between mt-4">
          <button 
            onClick={handleReturnHome} 
            className="btn btn-outline-primary"
          >
            Return to Home
          </button>
          <button 
            onClick={handleContinueToOrders} 
            className="btn btn-primary"
          >
            Continue to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;