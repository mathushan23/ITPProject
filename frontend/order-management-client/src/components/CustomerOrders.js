import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar1 from './usernavbar';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [NIC, setNic] = useState(''); 
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Address, setAddress] = useState('');
  const [Email, setEmail] = useState('');
   const [Amount, setAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [image, setImage] = useState(null);
 


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
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

  const validateNIC = (NIC) => {
    const nicRegex = /^[0-9]{12}$/;
    if (!nicRegex.test(NIC)) {
      alert("NIC must be a 12-digit number.");
      return false;
    }
    return true;
  };
  
  const onInputChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  
  const submitImage = async () => {
    if (!image) {
      return '';  
    }

   
    const existingImage = allImages.find((img) => img.image === image.name);
    if (existingImage) {
      alert('This image has already been uploaded.');
      return existingImage.image; 
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const result = await axios.post('http://localhost:5001/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Image uploaded successfully:', result);
      return result.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      return '';  
    }
  };

  
 
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };


  
  
  const handleCreateOrder = async () => {
    if (!customerName || !product || !NIC || !PhoneNumber || !Address || !Email || !Amount) {
      alert('Please fill in all the fields.');
      return;
    }

    if (!validateNIC(NIC)) {
      return; 
    }

    if (Address.trim().length < 10) {
      alert('Address must be at least 10 characters long.');
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = imageUrl;  

     
      if (image) {
        uploadedImageUrl = await submitImage();
        if (!uploadedImageUrl) {
          alert('Image upload failed, please try again');
          setLoading(false);
          return;
        }
      }

      const orderData = {
        customerName,
        product,
        quantity,
        NIC,
        PhoneNumber,
        Address,
        Email,
        Amount,
        image: uploadedImageUrl,  
      };

      const response = await axios.post('http://localhost:5001/api/orders', orderData);
      setOrders((prevOrders) => [...prevOrders, response.data]);
      resetForm();
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error.response ? error.response.data : error.message);
      alert(`Error: ${error.response ? error.response.data.message : 'Failed to create order'}`);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleEditOrder = (order) => {
    if (order.status !== 'Pending') {
      alert('You can only edit orders with "Pending" status.');
      return;
    }

    setIsEditing(true);
    setEditOrderId(order._id);
    setCustomerName(order.customerName);
    setProduct(order.product);
    setImage(order.image);
    setQuantity(order.quantity);
    setNic(order.NIC);
    setPhoneNumber(order.PhoneNumber);
    setAddress(order.Address);
    setEmail(order.Email);
    setAmount(order.Amount);
  };

  const handleUpdateOrder = async () => {
    if (!customerName || !product || !NIC  || !PhoneNumber || !Address || !Email || !Amount) {
      alert('Please fill in all the fields.');
      return;
    }

    if (!validateNIC(NIC)) {
      return; 
    }

    if (Address.trim().length < 10) {
      alert('Address must be at least 10 characters long.');
      return;
    }
    

    const orderData = {
      customerName,
      product,
      quantity,
      NIC,
      PhoneNumber,
      Address,
      Email,
      Amount,
      status: 'Pending', 
    };

    setLoading(true);  

    try {
      const response = await axios.put(`http://localhost:5001/api/orders/${editOrderId}`, orderData);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === editOrderId ? response.data : order))
      );
      resetForm();
      alert('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update the order');
    } finally {
      setLoading(false);  
    }
  };
  const handleCancelOrder = async (orderId) => {
    const confirmation = window.confirm("Are you sure you want to cancel this order?");
  
    if (confirmation) {
      try {
        const response = await axios.delete(`http://localhost:5001/api/orders/${orderId}`);
        alert("Order canceled successfully");
  
        
        const updatedOrders = await axios.get('http://localhost:5001/api/orders');
        setOrders(updatedOrders.data);  
      } catch (error) {
        console.error('Error canceling order:', error.response ? error.response.data : error.message);
        alert('Failed to cancel the order');
      }
    } else {
      console.log('Order cancelation has been canceled.');
    }
  };
  

  const resetForm = () => {
    setIsEditing(false);
    setEditOrderId(null);
    setCustomerName('');
    setProduct('');
    setQuantity(1);
    setNic('');
    setPhoneNumber('');
    setAddress('');
    setEmail('');
    setAmount('');
    setImage(null); 
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
     <div>
     <Navbar1/>
     </div>
     <div
  style={{
    backgroundImage: 'url(/images/p1.jpg)', 
    backgroundSize: 'cover',              
    backgroundPosition: 'center center',   
    backgroundRepeat: 'no-repeat',         
    height: '150vh', 
                          
  }}
>



      <center><h1 class="customerorders">Customer Orders</h1></center>

     
      {isEditing ? (
        <div className="div">
          <h2 class="editorder">Edit Order</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateOrder(); }} className="editform">
            
            <label>Customer Name:</label><br />
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your Name" /><br />
            <label>Product:</label><br />
            <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Product" /><br />
            <label>Quantity:</label><br />
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /><br />
            <label>NIC:</label><br />
            <input type="number" value={NIC} onChange={(e) => setNic(e.target.value)} placeholder="Enter the NIC" /><br />
           
            <label>Phone Number:</label><br />
            <input type="number" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter the Phone Number" /><br />
            <label>Address:</label><br />
            <input type="text" value={Address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter the Address" /><br />
            <label>Email:</label><br />
            <input type="text" value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter the Email" /><br />
            <label>Amount:</label><br />
            <input type="text" value={Amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter the amount" /><br />
            <button type="submit" id="updatebtn">Update Order</button><br /><br/>
            <button type="button" onClick={() => setIsEditing(false)} id="cancelEditbtn">Cancel</button>
          </form>
        </div>
      ) : (
        <div className="div">
          <form onSubmit= { (e) => { e.preventDefault(); handleCreateOrder(); } } className="editform">
          
            <label>Customer Name:</label><br />
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your Name" /><br />
            <label>Product:</label><br />
            <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Product" /><br />
            <form >
            <input type="file"  onSubmit={submitImage} accept="image/*" onChange={onInputChange} />
         
          </form>
            <label>Quantity:</label><br />
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /><br />
            <label>NIC:</label><br />
            <input type="text" value={NIC} onChange={(e) => setNic(e.target.value)} placeholder="Enter the NIC" /><br />
           
            <label>Phone Number:</label><br />
            <input type="text" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter the Phone Number" /><br />
            <label>Address:</label><br />
            <input type="text" value={Address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter the Address" /><br />
            <label>Email:</label><br />
            <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter the Email" /><br />
            <label>Amount:</label><br />
            <input type="number" value={Amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter the amount" /><br />
            <button type="submit" id="createbtn">Create Order</button><br/><br/>
            
          </form>
         
        </div>
        
       
      )}
      <br/>
      <br/>
      <br/>

      <center><h2 class="userorders">User Orders</h2></center>
      <center>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Product Image</th>
              <th>Quantity</th>
              <th>NIC</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created At</th> 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="12">Loading...</td></tr>
            ) : (
              orders.map((order) => (
             
                <tr key={order._id}>
                  <td>{order.customerName}</td>
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
                    ))}

</td>
                  <td>{order.quantity}</td>
                  <td>{order.NIC}</td>
               
                  <td>{order.PhoneNumber}</td>
                  <td>{order.Address}</td>
                  <td>{order.Email}</td>
                
                  <td>{order.Amount}</td>
                  <td style={{ color: getStatusColor(order.status) }}>{order.status}</td>
                  <td>{formatDate(order.createdAt)}</td> 
                  <td>
                    <button onClick={() => handleEditOrder(order)} id="editbtn">Edit</button><br /><br />
                    <button onClick={() => handleCancelOrder(order._id)} id="cancelbtn">Cancel</button>
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

export default CustomerOrders;
