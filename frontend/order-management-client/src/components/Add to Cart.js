import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allImages, setAllImages] = useState([]);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/admin');
        console.log('Fetched orders:', data);
        setOrders(data);
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data
          : error.message || 'An unknown error occurred';
        console.error('Error fetching orders:', errorMessage);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const result = await axios.get('http://localhost:5001/get-image');
        setAllImages(result.data.data); // Assuming the images are in `result.data.data`
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchOrders();
    fetchImages();
  }, []);

  const addToCart = (order) => {
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === order.id);
  
    if (existingItem) {
        // If the item exists in the cart, just increase the quantity
        setCart(prevCart =>
          prevCart.map(item =>
            item.id === order.id
              ? { ...item, quantity: item.quantity + 1 }  // Increase quantity by 1
              : item
          )
        );
      } else {
        // If the item doesn't exist in the cart, add it with quantity 1
        setCart(prevCart => [...prevCart, { ...order, quantity: 1 }]);
      }
    };
  

  // Remove item from the cart
  const removeFromCart = (orderId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== orderId));
  };

  // Update quantity in cart (increase or decrease)
  const updateQuantity = (orderId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(orderId); // If quantity is 0 or less, remove item
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === orderId
            ? { ...item, quantity } // Update quantity
            : item
        )
      );
    }
  };

  return (
    
  
    
      
    
    <div>
      <h1>Orders</h1>

      
      {loading && <p>Loading orders...</p>}

      
      {error && <p>{error}</p>}

      
      {orders.length > 0 ? (
        <table border="1" style={{ width: '100%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Product Image</th>
              <th>Amount</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              // Find the image for this order, assuming there's a matching product ID
              const orderImage = allImages.find(image => image.productId === order.id);

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product}</td>
                  <td>
                    {orderImage ? (
                      <img
                        src={`http://localhost:5001/uploads/${orderImage.image}`}
                        height="100px"
                        width="100px"
                        alt={order.product}
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                  </td>
                  <td>${order.price}</td>
                  <td>{order.quantity}</td>
                  <td>${order.price * order.quantity}</td>
                  <td>
                    <button onClick={() => addToCart(order, 1)}>
                      {cart.some(item => item.id === order.id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}

      {/* Cart Table */}
      <h2>Cart</h2>
      {cart.length > 0 ? (
        <table border="1" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product}</td>
                <td>${item.price}</td>
                <td>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  {item.quantity}
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </td>
                <td>${item.price * item.quantity}</td>
                <td>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default OrdersPage;
