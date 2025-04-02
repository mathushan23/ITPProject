import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminOrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
   const [allImages, setAllImages] = useState([]);
  
   
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/admin');
        console.log(data); 
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
      setAllImages(result.data.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  fetchOrders();
  fetchImages();
}, []);

  
  const handleCancelOrder = async (id) => {
    try {
      const { data } = await axios.put(`http://localhost:5001/api/admin/${id}`, {
        status: 'Canceled'
      });
      console.log(data); 
     
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: 'Canceled' } : order
        )
      );
      alert('Order status updated to canceled!');
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || 'An unknown error occurred';
      console.error('Error canceling order:', errorMessage);
      alert('Failed to cancel the order.');
    }
  };
  
 
  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5001/api/admin/${id}`,
        { status }
      );
    
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: data.status } : order
        )
      );
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || 'An unknown error occurred';
      console.error('Error updating order status:', errorMessage);
      alert('Failed to update the order status.');
    }
  };


  if (loading) {
    return <div>Loading orders...</div>;
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date'; 
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Shipped':
        return 'blue'; 
      case 'Completed':
        return 'green'; 
      case 'Canceled':
        return 'red'; 
      default:
        return 'gray'; 
    }
  };

  return (
    <div>
      
      {error && (
        <div className="error-message" style={{ color: 'white', backgroundColor: 'red', padding: '10px', borderRadius: '5px' }}>
          {error}
        </div>
      )}

      <div>
      <Navbar/>
      </div>
      <div
  style={{
    backgroundImage: 'url(/images/p1.jpg)',
    backgroundSize: 'cover',              
    backgroundPosition: 'center center',  
    backgroundRepeat: 'no-repeat',         
   height:"40vh"
                         
  }}
>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      
     


      <center><h1 class="adminordermanagment">Admin Order Management</h1></center>
      <br/>

      <center>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Product</th>
              <th>Product Image</th>
              <th>NIC</th>
            
              <th>Amount</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="12">No orders available</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.product}</td>
                  <td>
                  {allImages && allImages.map((image) => (
                      <img
                        key={image.image}
                        src={`http://localhost:5001/uploads/${image.image}`}
                        height="100px"
                        width="100px"
                        alt="Uploaded"
                      />
                    ))}</td>
                  <td>{order.NIC}</td>
                  <td>{order.Amount}</td>
                  <td>{order.PhoneNumber}</td>
                  <td>{order.Address}</td>
                  <td>{order.Email}</td>
                  <td style={{ color: getStatusColor(order.status) }}>
                    {order.status}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatDate(order.updatedAt)}</td>
                  <td>
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={order.status !== 'Pending' || order.status === 'Canceled'}
                      className="canclebutton"
                    >
                      Cancel
                    </button><br/><br/>
                    <button
                      color="background-color:red;"onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                      disabled={order.status !== 'Pending'}
                      className="shippedbutton"
                    >
                      Shipped
                    </button><br/><br/>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Completed')}
                      disabled={order.status !== 'Shipped'}
                      className="completedbutton"
                    >
                      Completed
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </center>
    </div>
    </div>
  );
};

export default AdminOrderTable;
