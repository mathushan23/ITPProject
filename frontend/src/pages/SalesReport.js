import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas'; // Import html2canvas
import { useTheme } from '../context/ThemeContext'; // Import the theme context

const SalesReport = () => {
  const { theme } = useTheme(); // Get current theme
  const [date, setDate] = useState('');
  const [salesReport, setSalesReport] = useState([]);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('date');
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchSalesReportByDate = async () => {
    try {
      const response = await fetch(`/api/workouts/salesreport/${date}`);
      if (!response.ok) throw new Error('Error fetching sales report');
      const data = await response.json();
      setSalesReport(data);
      setViewType('date');
      setError(null);
    } catch (err) {
      setError('No sales in given period');
      setSalesReport([]);
    }
  };

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

  const fetchProductSales = async (title) => {
    try {
      const response = await fetch(`/api/workouts/salesreport/product/${encodeURIComponent(title)}`);
      if (!response.ok) throw new Error('Error fetching product sales');
      const data = await response.json();
      setSalesReport([data]);
      setSelectedProduct(title);
      setViewType('productSales');
      setError(null);
    } catch (err) {
      setError('Error fetching product sales');
      setSalesReport([]);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 15);

    // Capture the chart as an image using html2canvas
    const chartElement = document.getElementById('sales-chart'); // The chart container ID
    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      
      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 10, 20, 180, 100);

      // Add the table data (sales report) below the chart
      const tableData = salesReport.map(item => [
        item.productTitle,
        item.totalQuantitySold,
        `${item.totalSales.toFixed(2)} LKR`
      ]);

      autoTable(doc, {
        head: [['Product', 'Quantity Sold', 'Total Sales']],
        body: tableData,
        startY: 130, // Start the table after the chart
      });

      // Save the PDF
      doc.save(`sales_report_${viewType}.pdf`);
    });
  };

  return (
    <div className={`container ${theme}`}> {/* Apply theme here */}
      <h1 className="heading">Sales Report</h1>

      <div className="controls">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
        <button
          onClick={fetchSalesReportByDate}
          className="btnprimary"
        >
          Get Report by Date
        </button>

        <button
          onClick={fetchAllProducts}
          className="btnsuccess"
        >
          Sales of Each Product
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Product List */}
      {viewType === 'products' && productList.length > 0 && (
        <div className="product-list">
          <h3>Click a product to view its all-time sales</h3>
          <ul>
            {productList.map((product) => (
              <li
                key={product._id}
                onClick={() => fetchProductSales(product.title)}
                className="product-item"
              >
                {product.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sales Table */}
      {salesReport.length > 0 && (
        <div className="sales-table">
          {selectedProduct && (
            <h2>All-Time Sales for: {selectedProduct}</h2>
          )}

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map((item, index) => (
                <tr key={index}>
                  <td>{item.productTitle}</td>
                  <td>{item.totalQuantitySold}</td>
                  <td>{item.totalSales.toFixed(2)} LKR</td>
                </tr>
              ))}
            </tbody>
          </table>

          {salesReport.length > 0 && (
            <button
              onClick={generatePDF}
              className="btnpdf1"
            >
              <img src="../pdf-logo.jpeg" alt="PDF Logo" className="pdf-logo" />
              Download PDF
            </button>
          )}

          {/* Chart Section */}
          <div className="chart-section" id="sales-chart">
            <h2>Sales Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salesReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productTitle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalQuantitySold" fill="#0052cc" name="Quantity Sold">
                  <LabelList dataKey="totalQuantitySold" position="top" />
                </Bar>
                <Bar dataKey="totalSales" fill="#28a745" name="Total Sales (LKR)">
                  <LabelList dataKey="totalSales" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* No data fallback */}
      {salesReport.length === 0 && viewType !== 'products' && !error && (
        <p>No sales data available for this date.</p>
      )}
    </div>
  );
};

export default SalesReport;
