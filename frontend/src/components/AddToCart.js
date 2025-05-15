import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const AddToCart = () => {
  const { cartItems, addToCart } = useCart();
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(100);
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setAmount(newQuantity * 100);
  };

  const handleAddToCart = () => {
    if (product.trim() === "") {
      alert("Please enter a product name!");
      return;
    }

    if (isPreOrder && !deliveryDate) {
      alert("Please select a delivery date for pre-order items.");
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      _id: product._id, // must be from Task model if available
      title: product,
      price: 100,
      quantity,
      isPreOrder,
      deliveryDate,
    };

    addToCart(newItem);
    alert('Item added to cart!');
    setProduct('');
    setQuantity(1);
    setAmount(100);
    setIsPreOrder(false);
    setDeliveryDate('');
  };

  const handleCheckout = () => {
    navigate('/client/checkout');
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🛒 Pre-Order Electronics</h2>


      <div className="card shadow-sm p-4 rounded-4">
        <h5 className="mb-3">🧾 Cart Summary</h5>
        {cartItems.length === 0 ? (
          <p className="text-muted">Your cart is empty.</p>
        ) : (
          <ul className="list-group mb-3">
            {cartItems.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.title}</strong> 
                  <span className="badge bg-secondary ms-2">{item.quantity} pcs</span>
                  {item.isPreOrder && (
                    <span className="badge bg-warning text-dark ms-2">Pre-order</span>
                  )}
                  {item.isPreOrder && item.deliveryDate && (
                    <div className="text-muted small">Delivery: {item.deliveryDate}</div>
                  )}
                </div>
                <span className="text-success">{item.price * item.quantity} LKR</span>
              </li>
            ))}
          </ul>
        )}

        <button
          className="btn btn-success w-100"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          ✅ Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
