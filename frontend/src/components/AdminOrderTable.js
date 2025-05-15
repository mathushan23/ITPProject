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
  const [downloadLink, setDownloadLink] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesByCustomer, setImagesByCustomer] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  
/*  const generatePDFReport = async (timeframe, fromDate, toDate) => {
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
};*/


 const downloadReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/admin/download-report', {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'Admin_Report.pdf';
      a.click(); a.remove();
    } catch {
      toast.error('Failed to download report.');
    } finally {
      setLoading(false);
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
  
  // ————— Search / Filter —————
  const lower = searchTerm.toLowerCase();
  const filteredOrders = groupedOrders.filter((o) => {
    // customerName
    if ((o.customerName || '').toLowerCase().includes(lower)) return true;
    // phone as string
    if ((o.PhoneNumber || '').toString().toLowerCase().includes(lower)) return true;
    // address
    if ((o.Address || '').toLowerCase().includes(lower)) return true;
    // email
    if ((o.Email || '').toLowerCase().includes(lower)) return true;
    // status
    if ((o.status || '').toLowerCase().includes(lower)) return true;
    // created date
    if (formatDate(o.createdAt).toLowerCase().includes(lower)) return true;
    // products
    if (o.items.some((it) => it.product.toLowerCase().includes(lower))) return true;
    return false;
  });
  // ———————————————
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

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Customer, Phone, Address, Email, Products, Status, Created…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive shadow-sm p-3 bg-white rounded mb-3">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Email</th>
              <th>Products</th>
              
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
              <th>Chat</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 && (
              <tr><td colSpan="11">No orders found</td></tr>
            )}
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>{order.PhoneNumber}</td>
                <td style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{order.Address}</td>
                <td>{order.Email}</td>
                <td className="text-start">
                  <ul className="list-unstyled mb-0">
                    {order.items.map((it, i) => (
                      <li key={i} className="mb-2 border p-2 rounded bg-light">
                        {it.product} <small>(x{it.quantity})</small><br/>
                        <small>Amount: LKR {(it.price || 0).toFixed(2)}</small><br/>
                        <small>TotalAmount: LKR {(it.price || 0)*(it.quantity).toFixed(2)}</small>

                      </li>
                    ))}
                  </ul>
                </td>
              
                <td><span className={getStatusBadge(order.status)}>{order.status}</span></td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{formatDate(order.updatedAt)}</td>
                <td>
                  <div className="btn-group-vertical w-100">
                    <button
                      className="btn btn-outline-danger btn-sm mb-1"
                      disabled={['Completed','Canceled'].includes(order.status)}
                      onClick={() => handleCancelOrder(order._id)}
                    >❌ Cancel</button>
                    <button
                      className="btn btn-outline-primary btn-sm mb-1"
                      disabled={order.status !== 'Pending'}
                      onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                    >🚚 Shipped</button>
                    <button
                      className="btn btn-outline-success btn-sm mb-1"
                      disabled={order.status !== 'Shipped'}
                      onClick={() => handleUpdateStatus(order._id, 'Completed')}
                    >✅ Complete</button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => downloadPaymentSlip(order._id)}
                    >📄 Slip</button>
                  </div>
                </td>
                <td>
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder && selectedOrder._id === order._id ? null : order
                      )
                    }
                  >
                    {selectedOrder && selectedOrder._id === order._id ? 'Close' : 'Reply'}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Download report */}
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={downloadReport} disabled={loading}>
          {loading ? 'Loading…' : 'Download PDF Report'}
        </button>
      </div>

      {downloadLink && (
        <div className="mt-4 text-center">
          <a href={downloadLink} download="Admin_Report.pdf" className="btn btn-success">
            Download report
          </a>
        </div>
      )}
    </div>
  );
};


export default AdminOrderTable;
