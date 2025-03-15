import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [NIC, setNic] = useState('');
  const [AccountNumber, setAccountNumber] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Address, setAddress] = useState('');
  const [Email, setEmail] = useState('');
  const[Amount,setAmount]= useState('');
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/orders')
      .then(response => {
        setOrderData(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleCreateOrder = async () => {
    // Basic validation to check if required fields are filled
    if (!customerName || !product || !NIC || !AccountNumber || !PhoneNumber || !Address || !Email ||!Amount) {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/orders', {
        customerName,
        product,
        quantity,
        NIC,
        AccountNumber,
        PhoneNumber,
        Address,
        Email,
        Amount,
      });

      // Update the state with the newly created order
      setOrders([...orders, response.data]);
    } catch (error) {
      // Handle errors during the request
      if (error.response) {
        console.error('Error Response:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Failed to create order.'}`);
      } else {
        console.error('Error:', error.message);
        alert('An error occurred while creating the order.');
      }
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/orders/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order.');
    }
  };

  return (
    <div>
      <h1>Customer Orders</h1>
      <input
        type="text"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Your Name"
      />
      <br />
      <input
        type="text"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Product"
      />
      <br />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <br />
      <input
        type="text"
        value={NIC}
        onChange={(e) => setNic(e.target.value)}
        placeholder="Enter the NIC"
      />
      <br />
      <input
        type="text"
        value={AccountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        placeholder="Enter the AccountNumber"
      />
      <br />
      <input
        type="text"
        value={PhoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter the PhoneNumber"
      />
      <br />
      <input
        type="text"
        value={Address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter the Address"
      />
      <br />
      <input
        type="text"
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter the Email"
      />
      <br />
      <br />
      <input
        type="text"
        value={Amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter the amount"
      />
      <br />
      <button onClick={handleCreateOrder}>Create Order</button>

      <h2>Your Orders</h2>
      <table >
        <thead>
          <tr>
            <th>CustomerName</th>
            <th>product</th>
            <th>quantity</th>
            <th>NIC</th>
            <th>AccountNumber</th>
            <th>PhoneNumber</th>
            <th>Address</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.customerName}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>{order.NIC}</td>
              <td>{order.AccountNumber}</td>
              <td>{order.PhoneNumber}</td>
              <td>{order.Address}</td>
              <td>{order.Email}</td>
              <td>{order.Amount}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleCancelOrder(order._id)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOrders;
