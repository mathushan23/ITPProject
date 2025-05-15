const Order = require('../models/order');
const { generateChartBuffer } = require('../utils/generateChartBuffer');
const TaskModel = require('../models/TaskModel');
const moment = require('moment');
const PDFDocument = require('pdfkit');

const fetchOrderData = async () => {
  try {
    const orders = await Order.find().populate('products.productId');
    const tasks = await TaskModel.find();

    const customers = orders.map(order => ({
      name: order.customerName,
      email: order.Email,
      phone: order.Phone || 'N/A',
      address: order.Address || 'N/A'
    }));

    const taskStats = tasks.map(task => {
      const taskIdStr = task._id.toString();
      const orderCount = orders.reduce((acc, order) => {
        return acc + order.products.filter(p => p.productId && p.productId.toString() === taskIdStr).length;
      }, 0);
      return { task, count: orderCount };
    });

    const dailyOrders = Array(7).fill(0);
    const monthlyOrders = Array(12).fill(0);
    orders.forEach(order => {
      const day = moment(order.createdAt).day();
      const month = moment(order.createdAt).month();
      dailyOrders[day]++;
      monthlyOrders[month]++;
    });

    return { customers, taskStats, dailyOrders, monthlyOrders, orders };
  } catch (error) {
    console.error('Error fetching order data:', error);
    throw new Error('Error fetching order data');
  }
};

const generateReport = async (req, res) => {
  try {
    const data = await fetchOrderData();
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdf = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Admin_Report.pdf');
      res.send(pdf);
    });

    // Report Title
    doc.fontSize(20).font('Helvetica-Bold').text("Admin Order Report", { align: 'center' });
    doc.moveDown(1.5);

    // Customer Details Table
    doc.fontSize(14).font('Helvetica-Bold').text("Customer Details", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const itemHeight = 25;
    const customerCols = [120, 150, 120, 150];

    doc.rect(30, tableTop, 540, itemHeight).fillAndStroke('#007bff', '#000');
    doc.fillColor('white').fontSize(12).font('Helvetica-Bold');
    doc.text('Name', 35, tableTop + 6, { width: customerCols[0] });
    doc.text('Email', 35 + customerCols[0], tableTop + 6, { width: customerCols[1] });
    doc.text('Phone', 35 + customerCols[0] + customerCols[1], tableTop + 6, { width: customerCols[2] });
    doc.text('Address', 35 + customerCols[0] + customerCols[1] + customerCols[2], tableTop + 6, { width: customerCols[3] });

    let y = tableTop + itemHeight;
    data.customers.forEach((c, i) => {
      const bgColor = i % 2 === 0 ? '#f1f1f1' : '#ffffff';
      if (y + itemHeight > doc.page.height - 50) {
        doc.addPage();
        y = 30;
      }
      doc.rect(30, y, 540, itemHeight).fill(bgColor);
      doc.fillColor('black').fontSize(10).font('Helvetica');
      doc.text(c.name, 35, y + 6, { width: customerCols[0] });
      doc.text(c.email, 35 + customerCols[0], y + 6, { width: customerCols[1] });
      doc.text(c.phone, 35 + customerCols[0] + customerCols[1], y + 6, { width: customerCols[2] });
      doc.text(c.address, 35 + customerCols[0] + customerCols[1] + customerCols[2], y + 6, { width: customerCols[3] });
      y += itemHeight;
    });

    doc.addPage();

    // Product Summary Table
    doc.fontSize(14).font('Helvetica-Bold').text("Product Summary", { underline: true });
    doc.moveDown(0.5);

    const colWidths = [100, 180, 60, 60, 60];
    y = doc.y;
    doc.rect(30, y, 540, itemHeight).fillAndStroke('#343a40', '#000');
    doc.fillColor('white').fontSize(12).font('Helvetica-Bold');
    doc.text('Title', 35, y + 6, { width: colWidths[0] });
    doc.text('Description', 35 + colWidths[0], y + 6, { width: colWidths[1] });
    doc.text('Price', 35 + colWidths[0] + colWidths[1], y + 6, { width: colWidths[2] });
    doc.text('Qty', 35 + colWidths[0] + colWidths[1] + colWidths[2], y + 6, { width: colWidths[3] });
    doc.text('Orders', 35 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y + 6, { width: colWidths[4] });
    doc.fillColor('black');

    y += itemHeight;
    data.taskStats.forEach(({ task, count }, index) => {
      if (y + itemHeight > doc.page.height - 50) {
        doc.addPage();
        y = 30;
      }
      const bgColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
      doc.rect(30, y, 540, itemHeight).fill(bgColor);
      doc.fillColor('black').fontSize(10).font('Helvetica');
      doc.text(task.title, 35, y + 6, { width: colWidths[0] });
      doc.text(task.description, 35 + colWidths[0], y + 6, { width: colWidths[1] });
      doc.text(`$${task.price}`, 35 + colWidths[0] + colWidths[1], y + 6, { width: colWidths[2] });
      doc.text(task.quantity.toString(), 35 + colWidths[0] + colWidths[1] + colWidths[2], y + 6, { width: colWidths[3] });
      doc.text(count.toString(), 35 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y + 6, { width: colWidths[4] });
      y += itemHeight;
    });

    doc.moveDown();
    const mostBought = data.taskStats.reduce((a, b) => (a.count > b.count ? a : b));
    const leastBought = data.taskStats.reduce((a, b) => (a.count < b.count ? a : b));
    doc.fontSize(12).font('Helvetica-Bold').text(`Most Bought Product: ${mostBought.task.title} (${mostBought.count})`);
    doc.text(`Least Bought Product: ${leastBought.task.title} (${leastBought.count})`);

    // Charts Page
    doc.addPage();

    // Pie Chart
    try {
      const pieChart = await generateChartBuffer(
        "pie",
        data.taskStats.map(t => t.task.title),
        data.taskStats.map(t => t.count)
      );
      doc.fontSize(14).font('Helvetica-Bold').text("Product Distribution (Pie)", { underline: true });
      doc.moveDown(0.5);
      doc.image(pieChart, {
        fit: [500, 300],
        align: 'center',
        valign: 'center'
      });
      doc.moveDown();
    } catch (err) {
      console.error("Pie chart error:", err);
      doc.text("Could not generate pie chart.");
    }

    // Bar Chart
    try {
      const barChart = await generateChartBuffer("bar", moment.weekdays(), data.dailyOrders);
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text("Daily Orders (Bar)", { underline: true });
      doc.moveDown(0.5);
      doc.image(barChart, { fit: [500, 300], align: 'center' });
    } catch (err) {
      console.error("Bar chart error:", err);
      doc.text("Could not generate bar chart.");
    }

    // Line Chart
    try {
      const lineChart = await generateChartBuffer("line", moment.months(), data.monthlyOrders);
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text("Monthly Orders (Line)", { underline: true });
      doc.moveDown(0.5);
      doc.image(lineChart, { fit: [500, 300], align: 'center' });
    } catch (err) {
      console.error("Line chart error:", err);
      doc.text("Could not generate line chart.");
    }

    // Customer Daily Purchase Summary
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').text("Daily Purchase Summary by Customer", { underline: true });
    doc.moveDown();

    const groupedPurchases = {};
    data.orders.forEach(order => {
      const dateStr = moment(order.createdAt).format('YYYY-MM-DD');
      const customer = order.customerName || 'Unknown';
      const email = order.Email || '';
      const key = `${dateStr}__${customer}__${email}`;
      if (!groupedPurchases[key]) groupedPurchases[key] = [];
      order.products.forEach(p => {
        const title = p.productId?.title || p.productName || 'Unknown Product';
        groupedPurchases[key].push(title);
      });
    });

    Object.entries(groupedPurchases).forEach(([key, productList]) => {
      const [date, customer, email] = key.split('__');
      doc.fontSize(12).font('Helvetica-Bold').text(`Date: ${date}`);
      doc.fontSize(11).font('Helvetica').text(`Customer: ${customer} (${email})`);
      doc.text(`Products: ${[...new Set(productList)].join(', ')}`);
      doc.moveDown(0.8);
    });

    doc.end();
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).send('Error generating report: ' + err.message);
  }
};

module.exports = {
  fetchOrderData,
  generateReport
};
