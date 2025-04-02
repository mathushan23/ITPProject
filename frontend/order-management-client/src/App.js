import React from 'react';
import './App.css';

import CustomerOrders from './components/CustomerOrders';
import AdminOrderTable from './components/AdminOrderTable';
import HomePage from './components/HomePage';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OrdersPage from './components/Add to Cart';



const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/customerorder", element: <CustomerOrders /> },
  { path: "/adminorder", element: <AdminOrderTable /> },
  {path: "/addtocart",element:<OrdersPage/>}
 
]);

function App() {
  
  return  <RouterProvider router={router} />;
}

export default App;
