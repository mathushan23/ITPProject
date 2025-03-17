import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/admin');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle canceling an order
  const handleCancelOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/${id}`);
      // Remove canceled order from UI
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel the order.');
    }
  };

  // Function to handle updating the status of an order
  const handleUpdateStatus = async (id, status) => {
    try {
      // Update the status of the order
      const response = await axios.put(
        `http://localhost:5001/api/admin/${id}`,
        { status }
      );
      const updatedOrder = response.data;

      // Update the status locally in the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      // Handle error and provide detailed feedback
      if (error.response) {
        console.error('Error updating order status:', error.response.data);
        alert(`Failed to update order status: ${error.response.data.message || 'Unknown error'}`);
      } else {
        console.error('Error:', error.message);
        alert('An unexpected error occurred while updating the order status.');
      }
    }
  };
  console.log('Orders:', orders);

  // Display a loading message while fetching data
  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div>
      <center><h1>Admin Order Management</h1></center>
     <center><table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>NIC</th>
            <th>Amount</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.customerName}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.NIC}</td>
              <td>{order.Amount}</td>
              <td>{order.PhoneNumber}</td>
              <td>{order.Address}</td>

              <td>{order.Email}</td>
              <td>{order.status}</td>
              <td>
                {/* Disable Cancel button if order is already completed or shipped */}
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={order.status === 'Shipped' || order.status === 'Completed'}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                  disabled={order.status === 'Shipped' || order.status === 'Completed'}
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() => handleUpdateStatus(order._id, 'Completed')}
                  disabled={order.status === 'Completed'}
                >
                  Mark as Completed
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></center> 
    </div>
  );
};



export default AdminOrderTable;
