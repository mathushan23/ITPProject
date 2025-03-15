// src/components/AdminOrderTable.js
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle canceling an order
  const handleCancelOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/${id}`);
      setOrders(orders.filter((order) => order._id !== id)); // Remove canceled order from UI
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  // Function to handle updating the status of an order
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/${id}`, { status });
      // Update the status locally in the UI
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Display a loading message while fetching data
  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div>
      <h1>Admin Order Management</h1>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>NIC</th>
            <th>Amount</th>
            <th>Address</th>
            <th>PhoneNumber</th>
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
              <td>{order.Address}</td>
              <td>{order.NIC}</td>
              <td>{order.amount}</td>
              <td>{order.PhoneNumber}</td>
              <td>{order.Email}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleCancelOrder(order._id)}>
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(order._id, 'Shipped')
                  }
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(order._id, 'Completed')
                  }
                >
                  Mark as Completed
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable;
