import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chatbox from './CustomerChatbox';
import { ToastContainer, toast } from 'react-toastify';
import { Chart } from 'chart.js';
import { jsPDF } from 'jspdf';

import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

import { Table, Modal, Button, Form, Badge } from 'react-bootstrap';

const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
const myemail = userSession?.user?.email;

const AdminOrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesByCustomer, setImagesByCustomer] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0); // Define newQuantity state
  useEffect(() => {
    fetchOrders();
    fetchImages();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/api/admin');
      setOrders(data);
    } catch (error) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/admin/${orderId}`, {
        status: 'Canceled',
      });
      if (response.status === 200) {
        toast.success('Order canceled successfully.');
        fetchOrders();
      }
    } catch (error) {
      toast.error('Failed to cancel order.');
      console.error('Error canceling order:', error);
    }
  };
  const downloadPaymentSlip = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/orders/${orderId}/pdf`, {
        responseType: 'blob', // important for binary files
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Order_${orderId}_Payment_Slip.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download payment slip.');
    }
  };
  // Function to download report based on timeframe
/*const downloadReport = async (timeframe) => {
  try {
    const fromDate = new Date('2023-01-01');
    const toDate = new Date('2023-12-31');

    const reportUrl = `${apiUrl}/api/reports/order-details/${timeframe}?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`;
    console.log('🔄 Requesting report from:', reportUrl);

    const response = await axios.get(reportUrl, { responseType: 'blob' });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Order_Report_${timeframe}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    console.log('✅ Report downloaded successfully');
  } catch (error) {
    console.error('❌ Error downloading report:', error);
    alert('Failed to download report. Please check the server logs.');
  }
};*/
// Generate the charts
  const generateCharts = () => {
    // Pie Chart - Order Status Distribution
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = acc[order.status] ? acc[order.status] + 1 : 1;
      return acc;
    }, {});

    const statusLabels = Object.keys(statusCount);
    const statusData = Object.values(statusCount);

    const pieCtx = document.getElementById('orderStatusPie').getContext('2d');
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusData,
          backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
        }]
      },
    });

    // Bar Chart - Orders per Customer
    const customerNames = orders.map(order => order.customerName);
    const customerOrdersCount = customerNames.reduce((acc, name) => {
      acc[name] = acc[name] ? acc[name] + 1 : 1;
      return acc;
    }, {});

    const barCtx = document.getElementById('ordersPerCustomerBar').getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(customerOrdersCount),
        datasets: [{
          label: 'Orders per Customer',
          data: Object.values(customerOrdersCount),
          backgroundColor: '#28a745',
        }]
      },
    });

    // Linear Chart - Order Amount Over Time
    const orderDates = orders.map(order => new Date(order.createdAt).toLocaleDateString());
    const orderAmounts = orders.map(order => order.amount);

    const lineCtx = document.getElementById('orderAmountOverTime').getContext('2d');
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: orderDates,
        datasets: [{
          label: 'Order Amount',
          data: orderAmounts,
          borderColor: '#007bff',
          fill: false,
        }]
      },
    });
  };

  
  const generatePDFReport = async (timeframe, fromDate, toDate) => {
  try {
    const response = await axios.get(`http://localhost:4000/api/reports/order-details/${timeframe}`, {
      params: { fromDate, toDate },
      responseType: 'arraybuffer' // Ensure the response is in binary format for PDF
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Order_Report.pdf';
    link.click();
  } catch (error) {
    console.error('Error generating report:', error);
    alert('Failed to generate report PDF.');
  }
};



  const fetchImages = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/get-image');
      const grouped = data.data.reduce((acc, img) => {
        acc[img.customerName] = acc[img.customerName] || [];
        acc[img.customerName].push(img);
        return acc;
      }, {});
      setImagesByCustomer(grouped);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return isNaN(date) ? 'Invalid date' : date.toLocaleString();
  };

  const groupedOrders = orders.map((order) => {

    
    const items = (order.products || []).map((p) => ({
      product: typeof p.product === 'string' ? p.product : p.product?.name ||p.productName|| 'Unknown',
      quantity: p.quantity,
      price: p.price||p.Amount||p.amount,
      Amount: (p.price || 0) * (p.quantity || 0),
      productId: p.productId || p.product?._id || p._id , // ✅ <-- fix here
      
      image: p.image, // Optional, only if your product has an image

      
    }));
  

    const amount = items.reduce((sum, item) => sum + item.amount, 0);
  
    return {
      ...order,
      items,
      amount,
    };
  });
  
  console.log(groupedOrders);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shipped': return 'badge bg-primary';
      case 'Completed': return 'badge bg-success';
      case 'Canceled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order) {
        toast.error('Order not found.');
        return;
      }
  
      if (!newStatus) {
        toast.error('Status is required.');
        return;
      }
  
      // 🔄 This PUT request triggers both the status update and the email sending in your backend
      const response = await axios.put(`http://localhost:4000/api/admin/${orderId}`, {
        status: newStatus,
      });
  
      const { message, order: updatedOrder } = response.data;
  
      // If status is Completed, update the inventory
      if (newStatus === 'Completed') {
        await updateInventory(order);
      }
  
      // Update frontend state
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o._id === orderId ? { ...o, status: updatedOrder.status } : o
        )
      );
  
      toast.success(message || `Order marked as "${newStatus}" and email sent to customer.`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to update order status.';
      toast.error(errorMsg);
      console.error('Error updating order:', error);
    }
  };
  
/*
  const updateInventory = async (order) => {
  if (!order.products?.length) {
    console.warn('No products to update inventory on', order);
    return;
  }

  for (const item of order.products) {
    const productId = item.productId || item._id;
    const quantity  = item.quantity;

    if (!productId || !quantity) {
      console.warn(`Skipping invalid item:`, item);
      continue;
    }

    try {
      const url = `http://localhost:4000/api/tasks/${productId}/update-quantity`;
      console.log(`PUT ${url}`, { quantity });
      const res = await axios.put(url, { quantity });
      console.log(`Updated inventory for ${productId}:`, res.data);
    } catch (err) {
      console.error(`Failed updating inventory for ${productId}:`, 
        err.response?.status, err.response?.data || err.message);
      toast.error(`Inventory update failed for product ${productId}`);
    }
  }

  toast.success('Inventory updated successfully');
};
*/

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const updateInventory = async (order) => {
  if (!order || !Array.isArray(order.products) || order.products.length === 0) {
    console.error('❌ Invalid order or empty product list:', order);
    toast.error('Invalid order or empty product list');
    return false;
  }

  // Validate products for missing or invalid titles and quantities
  const invalidProducts = order.products.filter(
    p => 
      !p.title && 
      !p.productName && 
      !(p.product?.name) || // Check for different naming conventions
      isNaN(p.quantity) || 
      p.quantity <= 0
  );

  if (invalidProducts.length > 0) {
    console.warn('❌ Invalid products detected:', invalidProducts);
    toast.error('❌ Some products have invalid title or quantity');
    return false;
  }

  try {
    console.log('🔄 Sending inventory update request:', order.products);

    // Prepare products with consistent title handling (prefer title -> productName -> product?.name)
    const formattedProducts = order.products.map(p => ({
      title: p.title || p.productName || p.product?.name || 'Unknown', // fallback to 'Unknown' if no title is provided
      quantity: p.quantity
    }));

    // Send request to update inventory
    const response = await axios.put(`${apiUrl}/api/workouts/products/update-quantity`, {
      products: formattedProducts
    });

    if (response.status === 200) {
      toast.success('✅ All product inventories updated successfully');
      console.log('✅ Inventory update response:', response.data);
      return true;
    }

    // Handle partial update scenario
    if (response.status === 207) {
      console.warn('⚠️ Partial update:', response.data);
      response.data.failed.forEach(f => {
        toast.error(`❌ Failed to update "${f.title}": ${f.reason}`);
        console.error(`Failed to update "${f.title}": ${f.reason}`);
      });
      toast.warning('⚠️ Some product inventories failed to update. Please review the products with issues.');
      return false;
    }

    // Handle unexpected server response
    toast.error('❌ Unexpected server response');
    return false;

  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    console.error('❌ Error sending update request:', errorMsg);
    toast.error(`❌ Failed to update inventory: ${errorMsg}`);
    return false;
  }
};

  if (loading) return <div className="text-center mt-5">Loading orders...</div>;

  return (
    <div className="container py-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Admin Order Management</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="container-fluid px-3">
        <div className="table-responsive">
       <div className="table-responsive shadow-sm p-3 bg-white rounded">
  <table className="table table-bordered table-hover table-striped align-middle text-center animate__animated animate__fadeIn" style={{ fontSize: '0.95rem' }}>
  <thead className="table-dark">
    <tr>
      <th>Customer</th>
   
      <th>Phone</th>
      <th>Address</th>
      <th>Email</th>
      <th>Products</th>
      <th>Images</th>
      <th>Status</th>
      <th>Created</th>
      <th>Updated</th>
      <th>Actions</th>
      <th>Chat</th>
    </tr>
  </thead>
  <tbody>
    {groupedOrders.length === 0 ? (
      <tr><td colSpan="12" className="text-center">No orders found</td></tr>
    ) : (
      groupedOrders.map((order) => (
        <tr key={order._id} className="animate__animated animate__fadeInUp">
          <td style={{ fontSize: '0.95rem' }}>{order.customerName}</td>
        
          <td style={{ fontSize: '0.95rem' }}>{order.PhoneNumber}</td>
          <td style={{ fontSize: '0.95rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{order.Address}</td>
          <td style={{ fontSize: '0.95rem' }}>{order.Email}</td>

          {/* Products */}
          <td style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '0.95rem' }}>
            <ul className="list-unstyled m-0">
              {order.items.map((item, i) => (
                <li key={i} className="mb-2 text-start border p-2 rounded bg-light">
                  {item.product || 'Unnamed Product'} <span className="text-muted">(x{item.quantity})</span><br />
                  <span className="text-muted">Amount: LKR{(item.price || 0).toFixed(2)}</span><br />
                  <span className="text-muted">Total: LKR{((item.price || 0) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </td>

          {/* Images */}
          <td>
            {(imagesByCustomer[order.customerName] || []).map((img) => (
              <img
                key={img._id}
                src={`http://localhost:4000/uploads/${img.image}`}
                alt=""
                className="img-thumbnail me-1 mb-1"
                style={{ width: 50, height: 50, objectFit: "cover" }}
              />
            ))}
          </td>

          {/* Status Badge */}
          <td>
            <span className={getStatusBadge(order.status)}>{order.status}</span>
          </td>

          <td style={{ fontSize: '0.95rem' }}>{formatDate(order.createdAt)}</td>
          <td style={{ fontSize: '0.95rem' }}>{formatDate(order.updatedAt)}</td>

          {/* Action Buttons */}
          <td>
            <div className="btn-group-vertical w-100" role="group" aria-label="Order Actions">
              <button
                className="btn btn-outline-danger btn-sm fw-semibold py-0 px-1 shadow-sm mb-1"
                disabled={order.status === 'Completed' || order.status === 'Canceled'}
                onClick={() => handleCancelOrder(order._id)}
              >
                ❌ Cancel
              </button>
              <button
                className="btn btn-outline-primary btn-sm fw-semibold py-0 px-1 shadow-sm mb-1"
                disabled={order.status !== 'Pending'}
                onClick={() => handleUpdateStatus(order._id, 'Shipped')}
              >
                🚚 Mark as Shipped
              </button>
              <button
                className="btn btn-outline-success btn-sm fw-semibold py-0 px-1 shadow-sm mb-1"
                disabled={order.status !== 'Shipped'}
                onClick={() => handleUpdateStatus(order._id, 'Completed')}
              >
                ✅ Mark as Completed
              </button>
              <button
                className="btn btn-outline-secondary btn-sm fw-semibold py-0 px-1 shadow-sm"
                onClick={() => downloadPaymentSlip(order._id)}
              >
                📄 Download Slip
              </button>
            </div>
          </td>

          {/* Chat Button */}
          <td>
            <button
              className="btn btn-outline-info btn-sm w-100"
              onClick={() => setSelectedOrder(order._id === selectedOrder?._id ? null : order)}
            >
              {selectedOrder && selectedOrder._id === order._id ? 'Close Chat' : 'Reply'}
            </button>

            {selectedOrder && selectedOrder._id === order._id && (
              <div className="mt-2">
                <Chatbox
                  selectedOrder={selectedOrder}
                  fetchOrders={fetchOrders}
                  userRole="admin"
                />
              </div>
            )}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

</div>

           {/* Report Download Buttons */}
    
        </div>
        {/* Charts Section */}
        <div className="mt-5">
          <canvas id="orderStatusPie" width="400" height="400"></canvas>
          <canvas id="ordersPerCustomerBar" width="400" height="400" className="mt-5"></canvas>
          <canvas id="orderAmountOverTime" width="400" height="400" className="mt-5"></canvas>
        </div>

        {/* Download PDF Button */}
        <div className="mt-4 text-center">
          <Button onClick={generatePDFReport} variant="primary">Download Report as PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderTable;
