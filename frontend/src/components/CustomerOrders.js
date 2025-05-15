import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Table, Badge, Button, Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import Chatbox from './CustomerChatbox';
import EditOrderForm from './EditOrderForm';
const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
const myemail  = userSession?.user?.email;


const CustomerOrders = () => {
  
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [product, setProduct] = useState('');
  const [Amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const [PhoneNumber, setPhoneNumber] = useState(userSession?.user?.phone);
  const [Address, setAddress] = useState('');
  const [Email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const [chatboxVisible, setChatboxVisible] = useState(false);



  // Chatbox related state
  
  
  const [message, setMessage] = useState('');

  const [isChatOpen, setIsChatOpen] = useState(false); // Track if chatbox is open or closed


// Fix for your errors
//const handleCloseEditModal = () => {
 // setShowEditModal(false);
 // setSelectedOrder(null);
//};



//Handle showing modal with the selected order's details
  const handleShowEditModal = (order) => {
    setSelectedOrder(order); // Set the selected order for editing
    setShowEditModal(true); // Show the modal
  };

  // Handle closing modal
  const handleCloseEditModal = () => {
    setShowEditModal(false); // Close the modal
    setSelectedOrder(null); // Reset selected order after closing
  };

  // Function to toggle the chatbox visibility
  const toggleChatbox = () => {
    setIsChatOpen(!isChatOpen);
  };
  const location = useLocation();
  const pricePerItem = 100;

  useEffect(() => {
    if (location.state?.cart && location.state?.totalAmount !== undefined) {
      const formattedCart = location.state.cart.map(item => ({
        productName: item.title || 'Unnamed Product',
        quantity: item.quantity || 1,
        amount: item.price || 0,
        image: item.image || null // Ensure you have the image
      }));
      setCart(formattedCart);
      setTotalAmount(location.state.totalAmount || 0);
    }
  }, [location.state]);
  

 /* useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersResponse = await axios.get('http://localhost:4000/api/orders');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);*/



/*const sendMessage = async () => {
  if (!selectedOrder || !message.trim()) return;
  await axios.post(`/api/orders/${selectedOrder._id}/chat`, {
    sender: 'customer',
    message
  });
  setMessage('');
  const updatedOrder = await axios.get(`/api/orders/${selectedOrder._id}/chat`);
  setSelectedOrder({ ...selectedOrder, chat: updatedOrder.data });
};
*/
  

  const onInputChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };
 
  
  const submitImage = async () => {
    if (!image) {
      alert("No image selected for upload.");
      return '';
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('customerName', customerName);

    try {
      const result = await axios.post('http://localhost:4000/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedImageUrl = result.data.imageUrl.replace('/uploads/', '');
      setImageUrl(uploadedImageUrl);
      return uploadedImageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Image upload failed: ${error.message}`);
      return '';
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
// ✅ Define fetchOrders
const fetchOrders = async () => {
  try {
    const response = await axios.get('/api/orders/');
    setOrders(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// ✅ Fetch orders on load
useEffect(() => {
  fetchOrders();
}, []);

  const handleUpdateOrder = async () => {
  let uploadedImageUrl = imageUrl;
  if (image instanceof File) {
    uploadedImageUrl = await submitImage();
    if (!uploadedImageUrl) return;
  }

  const calculatedTotalAmount = cart.length > 0
    ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : Amount * quantity;

  const orderData = {
    customerName: userSession?.user?.username,
    PhoneNumber: editPhone ? newPhoneNumber : userSession?.user?.phone,
    Address: userSession?.user?.address,
    Email: userSession?.user?.email,
    Image: uploadedImageUrl,
    status: 'Pending',
    gpsLocation,
    TotalAmount: calculatedTotalAmount, // ✅ Always set this!
  };

  if (cart.length > 0) {
    orderData.products = cart.map((item, index) => ({
      productName: item.title || item.product || `Product ${index + 1}`,
      quantity: item.quantity || 1,
      price: item.price  ||item.Amount|| 0,
      image: item.image || null
    }));
  } else {
    orderData.productName = product || 'Product 1'; // For consistency
    orderData.quantity = quantity;
    orderData.Amount = Amount;
  }

  setLoading(true);
  try {
    const response = await axios.put(
      `http://localhost:4000/api/orders/${editOrderId}`,
      orderData
    );
    setOrders(prevOrders =>
      prevOrders.map(order => order._id === editOrderId ? response.data : order)
    );
    resetForm();
    
     toast.success('Order updated successfully!')
  } catch (error) {
    console.error('Error updating order:', error.response?.data || error.message);
    alert(`Failed to update order: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoading(false);
  }
};

// Handle edit order (called when clicking on edit button)
const handleEditOrder = (order) => {
  if (order.status !== 'Pending') {
    alert('You can only edit orders with "Pending" status.');
    return;
  }

  setIsEditing(true);
  setEditOrderId(order._id);
  setCustomerName(order.customerName);
  setPhoneNumber(order.PhoneNumber);
  setAddress(order.Address);
  setEmail(order.Email);
  setImageUrl(order.Image);
  setNewPhoneNumber(order.PhoneNumber);
  setEditPhone(false); // Reset state
  setGpsLocation('');

  if (order.products && order.products.length > 0) {
    setCart(order.products.map((p, index) => ({
      product: p.productName || `Product ${index + 1}`,
      quantity: p.quantity || 1,
      price: p.price || p.Amount || 0,
      image: p.image || null,
    })));
    setTotalAmount(order.TotalAmount || 0);
  } else {
    setProduct(order.product || 'Product 1');
    setQuantity(order.quantity || 1);
    setAmount(order.Amount || 0);
    setTotalAmount(order.TotalAmount || 0);
  }
};


  const handleCancelOrder = async (orderId) => {
  const confirmation = window.confirm("Are you sure you want to cancel this order?");
  if (!confirmation) return;

  try {
    await axios.delete(`http://localhost:4000/api/orders/${orderId}`);
    
    // Update orders state after successful cancellation
    setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));

    // Show success toast message
    toast({
      title: "Order Cancelled",
      description: "Your order has been successfully cancelled.",
    });
  } catch (error) {
    console.error('Error canceling order:', error);

    // Show failure toast message
    toast({
      variant: "destructive",
      title: "Cancellation Failed",
      description: "Failed to cancel order. Please try again.",
    });
  }
};


  const resetForm = () => {
    setIsEditing(false);
    setEditOrderId(null);
    setCustomerName('');
    setProduct('');
    setQuantity(1);
    
    setPhoneNumber('');
    setAddress('');
    setEmail('');
    setImage(null);
    setImagePreview(null);
    setImageUrl(null);
    setCurrentPhoneNumber(false);
    setCurrentAddress(false);
    setCart([]);
    setTotalAmount(0);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setTotalAmount(newQuantity * pricePerItem);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shipped': return 'primary';
      case 'Completed': return 'success';
      case 'Canceled': return 'danger';
      case 'Pending': return 'secondary';
      case 'Processing': return 'info';
      default: return 'dark';
    }
  };
  
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        if (!myemail) return;
        const response = await axios.get(`http://localhost:4000/api/orders/status/${myemail}`);
        setOrders(response.data); // assuming you have `const [orders, setOrders] = useState([]);`
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };
  
    fetchOrderStatus();
  }, [myemail]);
  
  

  const renderCartSummary = () => (
    <div className="card mb-4 p-3">
      <h5>Order Summary</h5>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Product</th>
            <th>Image</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{item.title || item.product ||item.name|| product.title||`Product ${index + 1}`}</td>
              <td>
                {item.image ? (
                  <img
                    src={`http://localhost:4000/uploads/${item.image}`}
                    alt={item.title ||item.name || `Product ${index + 1}`}
                    width="50"
                    className="img-thumbnail"
                  />
                ) : (
                  <span className="text-muted">No image</span>
                )}
              </td>
              <td>{item.quantity}</td>
              <td>{item.price?.toFixed(2) || '0.00'}</td>
              <td>${((item.price || 0) * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="text-end">
              <strong>Total:</strong>
            </td>
            <td>
              <strong>LKR {totalAmount.toFixed(2)}</strong>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );


  const renderProductsCell = (order) => {
    if (order.products?.length > 0) {
      return (
        <td>
          <div className="d-flex flex-column align-items-center">
            {order.products.map((item, idx) => (
              <div key={idx} className="mb-2 text-start border p-2 rounded w-100">
                <strong>Product:</strong> {item.productName|| `Product ${idx + 1}`} <br />
                <strong>Price:</strong> LKR {item.price?.toFixed(2) ||item.Amount|| '0.00'} <br />
                <strong>Quantity:</strong> x{item.quantity} <br />
                {item.image ? (
                  <img
                    src={`http://localhost:4000/uploads/${item.image}`}
                    alt={`Product ${idx + 1}`}
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    className="mt-2"
                  />
                ) : (
                  <div className="text-muted">No image</div>
                )}
              </div>
            ))}
          </div>
        </td>
      );
    }
  
  
    return (
      <td>
       <td>
      <strong>{order.product || 'Product 1'}</strong>
      <div>(x{order.quantity}) LKR {(order.Amount || order.price || 0).toFixed(2)}</div>
      {order.image ? (
        <img
          src={`http://localhost:4000/uploads/${order.image}`}
          alt="Product"
          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
          className="mt-2"
        />
      ) : (
        <div className="text-muted">No image</div>
      )}
    </td>
    </td>
    );
  };
  console.log("Products in order:", product);

  return (
    <div className="container mt-4">
      {isEditing ? (
        <Container>
          <Row className="mt-3">
            <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
              <h2 className="text-center mb-4">Edit Order</h2>
              <Form onSubmit={(e) => { e.preventDefault(); handleUpdateOrder(); }} className="p-4 border rounded">
       <EditOrderForm
  show={isEditing}
  handleClose={resetForm}
  cart={cart}
  setCart={setCart}
  handleUpdateOrder={handleUpdateOrder}
  loading={loading}
  user={userSession.user}
/>



                <Form.Group className="mb-3">
                  <Form.Label>Customer Name:</Form.Label>
                  {userSession?.user?.username || 'Not available'}
                </Form.Group>

                {cart.length > 0 ? renderCartSummary() : (
                  <>
                    
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Image:</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={onInputChange}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail mt-2"
                      style={{ width: '100px' }}
                    />
                  ) : imageUrl ? (
                    <img
                      src={`http://localhost:4000/uploads/${imageUrl}`}
                      alt="Current"
                      className="img-thumbnail mt-2"
                      style={{ width: '100px' }}
                    />
                  ) : (
                    <div className="text-muted mt-2">No image selected</div>
                  )}
                </Form.Group>

              

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number:</Form.Label>
                  {userSession?.user?.phone || 'Not available'}
                
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address:</Form.Label>
                  {userSession?.user?.address || 'Not available'}
                 
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  {userSession?.user?.email || 'Not available'}
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Order'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      ) : (
        <div className="p-4 border rounded mb-4">
        
        </div>
      )}

<h2 className="text-center my-4">User Orders</h2>
<div className="table-responsive">
<Table striped bordered hover responsive className="align-middle text-center">
  <thead className="table-dark">
    <tr>
      <th>Customer</th>
      <th>Products</th>
    
      <th>Quantity</th>
      <th>Phone</th>
      <th>Address</th>
      <th>Email</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Order Date</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr>
        <td colSpan="11" className="text-center">Loading orders...</td>
      </tr>
    ) : orders.length === 0 ? (
      <tr>
        <td colSpan="11" className="text-center">No orders found</td>
      </tr>
    ) : (
      orders.map((order) => (
        <tr key={order._id}>
          <td>{order.customerName}</td>
          {renderProductsCell(order)}
        
          <td>{order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || order.quantity}</td>
          <td>{order.PhoneNumber}</td>
          <td>{order.Address}</td>
          <td>{order.Email}</td>
          <td>LKR{(order.TotalAmount?.toFixed(2) || order.Amount?.toFixed(2) || "0.00")}</td>
          <td>
            <Badge bg={getStatusBadge(order.status)} className="text-capitalize">
              {order.status}
            </Badge>
          </td>
          <td>{formatDate(order.createdAt)}</td>
          <td>
            <div className="d-flex flex-column gap-2">
              {order.status === "Pending" && (
                <>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="btn-sm fw-semibold py-1 px-2 shadow-sm"
                    onClick={() => handleEditOrder(order)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="btn-sm fw-semibold py-1 px-2 shadow-sm"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button
                variant="outline-info"
                size="sm"
                className="btn-sm fw-semibold py-1 px-2 shadow-sm"
                onClick={async () => {
                  setIsChatVisible(true);
                  setSelectedOrder(order);
                  setIsChatOpen(true);
                  try {
                    const res = await axios.get(`/api/orders/${order._id}/chat`);
                    setSelectedOrder({ ...order, chat: res.data });
                  } catch (err) {
                    console.error("Failed to load chat:", err);
                  }
                }}
              >
                View Chat
              </Button>
            </div>
          </td>
        </tr>
      ))
    )}
  </tbody>
</Table>

</div>

{selectedOrder && (
  <Chatbox selectedOrder={selectedOrder} fetchOrders={fetchOrders} userRole="customer" />
)}


      
    </div>
  );
};

export default CustomerOrders;