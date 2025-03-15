import logo from './logo.svg';
import './App.css';
import CustomerOrders from './components/CustomerOrders';
import AdminOrderTable from './components/AdminOrderTable';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
  {path:"/customerorder",element:<CustomerOrders/>},
  {path:"/adminorder",element:<AdminOrderTable/>},
])


function App() {
  return <RouterProvider router={router}/>
    
  ;
}

export default App;
