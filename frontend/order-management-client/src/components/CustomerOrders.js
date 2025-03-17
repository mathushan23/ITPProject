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
  const [Amount, setAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/orders')
      .then(response => {
        setOrders(response.data); // Directly set orders here
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handleCreateOrder = async () => {
    if (!customerName || !product || !NIC || !AccountNumber || !PhoneNumber || !Address || !Email || !Amount) {
      alert('Please fill in all the fields.');
      return;
    }
    // Address Validation
  if (Address.trim().length < 10) {
    alert('Address must be at least 10 characters long.');
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

      setOrders([...orders, response.data]);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Error: ${error.response ? error.response.data.message : 'Failed to create order'}`);
    }


     // Address Validation - Make sure the address is not empty and meets a minimum length
  //if (Address.trim().length < 10) {
    ////alert('Address must be at least 10 characters long.');
    //return;
//}
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

  const handleEditOrder = (order) => {
    setIsEditing(true);
    setEditOrderId(order._id);
    setCustomerName(order.customerName);
    setProduct(order.product);
    setQuantity(order.quantity);
    setNic(order.NIC);
    setAccountNumber(order.AccountNumber);
    setPhoneNumber(order.PhoneNumber);
    setAddress(order.Address);
    setEmail(order.Email);
    setAmount(order.Amount);
  };

  const handleUpdateOrder = async () => {
    if (!customerName || !product || !NIC || !AccountNumber || !PhoneNumber || !Address || !Email || !Amount) {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5001/api/orders/${editOrderId}`, {
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

      const updatedOrders = orders.map(order =>
        order._id === editOrderId ? response.data : order
      );
      setOrders(updatedOrders);

      setIsEditing(false);
      setEditOrderId(null);
      setCustomerName('');
      setProduct('');
      setQuantity(1);
      setNic('');
      setAccountNumber('');
      setPhoneNumber('');
      setAddress('');
      setEmail('');
      setAmount('');
    } catch (error) {
      console.error('Error updating order:', error);
      alert(`Failed to update the order: ${error.response ? error.response.data.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h1>Customer Orders</h1><br />
      
      {isEditing && (
       <center><div>
          <h2>Edit Order</h2>
          <label>CustomerName:</label><br />
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your Name"
          />
          <br />
          <label>Product:</label><br />
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Product"
          />
          <br />
          <label>Quantity:</label><br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <br />
          <label>NIC:</label><br />
          <input
            type="text"
            value={NIC}
            onChange={(e) => setNic(e.target.value)}
            placeholder="Enter the NIC"
          />
          <br />
          <label>AccountNumber:</label><br />
          <input
            type="text"
            value={AccountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter the AccountNumber"
          />
          <br />
          <label>PhoneNumber:</label><br />
          <input
            type="text"
            value={PhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter the PhoneNumber"
          />
          <br />
          <label>Address:</label><br />
          <input
            type="text"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter the Address"
          />
          <br />
          <label>Email:</label><br />
          <input
            type="text"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter the Email"
          />
          <br />
          <label>Amount:</label><br />
          <input
            type="text"
            value={Amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount"
          />
          <br />
          <button onClick={handleUpdateOrder} id="updatebtn">Update Order</button>
          <button onClick={() => setIsEditing(false)} id="cancelEditbtn">Cancel</button>
        </div></center>
      )}

      {!isEditing && (
        <div>
          <h2>Create Order</h2>
          <label>CustomerName:</label><br />
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your Name"
          />
          <br />
          <label>Product:</label><br />
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Product"
          />
          <br />
          <label>Quantity:</label><br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <br />
          <label>NIC:</label><br />
          <input
            type="text"
            value={NIC}
            onChange={(e) => setNic(e.target.value)}
            placeholder="Enter the NIC"
          />
          <br />
          <label>AccountNumber:</label><br />
          <input
            type="text"
            value={AccountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter the AccountNumber"
          />
          <br />
          <label>PhoneNumber:</label><br />
          <input
            type="text"
            value={PhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter the PhoneNumber"
          />
          <br />
          <label>Address:</label><br />
          <input
            type="text"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter the Address"
          />
          <br />
          <label>Email:</label><br />
          <input
            type="text"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter the Email"
          />
          <br />
          <label>Amount:</label><br />
          <input
            type="text"
            value={Amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount"
          />
          <br />
          <button onClick={handleCreateOrder} id="createbtn">Create Order</button>
        </div>
      )}

     <center><h2>Your Orders</h2></center> 
     <center> <table>
        <thead>
          <tr>
            <th>CustomerName</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>NIC</th>
            <th>AccountNumber</th>
            <th>PhoneNumber</th>
            <th>Address</th>
            <th>Email</th>
            <th>Amount</th>
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
              <td>{order.AccountNumber}</td>
              <td>{order.PhoneNumber}</td>
              <td>{order.Address}</td>
              <td>{order.Email}</td>
              <td>{order.Amount}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleEditOrder(order)} id="editbtn">Edit</button>
                <button onClick={() => handleCancelOrder(order._id)} id="cancelbtn">Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></center>
    </div>
  );
};

export default CustomerOrders;
