import React, { useState } from 'react';

const SalesReport = () => {
  const [date, setDate] = useState('');
  const [salesReport, setSalesReport] = useState([]);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('date'); // 'date' | 'products' | 'productSales'
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch sales report by date
  const fetchSalesReportByDate = async () => {
    try {
      const response = await fetch(`/api/workouts/salesreport/${date}`);
      if (!response.ok) throw new Error('Error fetching sales report');
      const data = await response.json();
      setSalesReport(data);
      setViewType('date');
      setError(null);
    } catch (err) {
      setError('Error fetching sales report');
      setSalesReport([]);
    }
  };

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`/api/workouts`);
      if (!response.ok) throw new Error('Error fetching products');
      const data = await response.json();
      setProductList(data);
      setViewType('products');
      setSalesReport([]);
      setSelectedProduct(null);
      setError(null);
    } catch (err) {
      setError('Error fetching products');
    }
  };

  // Fetch all-time sales of a selected product
  const fetchProductSales = async (title) => {
    try {
      const response = await fetch(`/api/workouts/salesreport/product/${encodeURIComponent(title)}`);
      if (!response.ok) throw new Error('Error fetching product sales');
      const data = await response.json();
      setSalesReport([data]); // Wrap in array for consistent table display
      setSelectedProduct(title);
      setViewType('productSales');
      setError(null);
    } catch (err) {
      setError('Error fetching product sales');
      setSalesReport([]);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ color: '#0052cc', textAlign: 'center' }}>Sales Report</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <button
          onClick={fetchSalesReportByDate}
          style={{
            background: '#0052cc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Get Report by Date
        </button>

        <button
          onClick={fetchAllProducts}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Sales of Each Product
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Product List */}
      {viewType === 'products' && productList.length > 0 && (
        <div>
          <h3 style={{ textAlign: 'center', color: '#444' }}>Click a product to view its all-time sales</h3>
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
            {productList.map((product) => (
              <li
                key={product._id}
                onClick={() => fetchProductSales(product.title)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd',
                  color: '#0052cc',
                  fontWeight: 'bold',
                }}
              >
                {product.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sales Table */}
      {salesReport.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          {selectedProduct && (
            <h2 style={{ textAlign: 'center', color: '#444' }}>
              All-Time Sales for: {selectedProduct}
            </h2>
          )}

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            <thead>
              <tr style={{ background: '#0052cc', color: 'white' }}>
                <th style={{ padding: '12px' }}>Product</th>
                <th style={{ padding: '12px' }}>Quantity Sold</th>
                <th style={{ padding: '12px' }}>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                    textAlign: 'center',
                  }}
                >
                  <td style={{ padding: '10px' }}>{item.productTitle}</td>
                  <td style={{ padding: '10px' }}>{item.totalQuantitySold}</td>
                  <td style={{ padding: '10px' }}>{item.totalSales.toFixed(2)} LKR</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No data fallback */}
      {salesReport.length === 0 && viewType !== 'products' && !error && (
        <p style={{ textAlign: 'center' }}>
          No sales data available {viewType === 'productSales' ? 'for this product' : 'for this date'}.
        </p>
      )}
    </div>
  );
};

export default SalesReport;
