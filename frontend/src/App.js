// App.js
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

// Pages and Components
import Home from './pages/Home';
import ProductForm from './components/ProductForm';
import DirectPurchase from './pages/DirectPurchase';
import SalesReport from './pages/SalesReport';
import Product from './pages/Product';
import CustomerOrders from './components/CustomerOrders';
import AdminOrderTable from './components/AdminOrderTable';
import AddToCart from './components/AddToCart';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import HomePage from './components/HomePage';
import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';
import WorkoutDetails from './components/ProductDetails';

// Auth Components
import Login from "./components/Login";
import Signup from "./components/Signup";
import Forgotpassword from "./components/Forgotpassword";
import AdminDashboard from "./components/AdminDashboard";
import DeletUser from "./components/DeletUser";
import UserDashboard from "./components/UserDashboard";
import OTP from "./components/OTP";
import AddAdmin from "./components/AddAdmin";
import WelcomePage from "./components/Welcome";
import Profile from "./components/ViewProfile";
import ProfileUpdate from "./components/Updateprofile";

// Additional Pages
import FeedbackPage from "./pages/FeedbackPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import NotificationPage from './components/CustomerPage';
import AdminDashboard2 from "./components/AdminDashboard2";

const router = createBrowserRouter([
  // Public pages
  { path: "/", element: <WelcomePage /> },
  { path: "/login", element: <Login /> },
  { path: "/sign-up", element: <Signup /> },
  { path: "/forgot-password", element: <Forgotpassword /> },
  { path: "/otp", element: <OTP /> },
  { path: "/updateprofile", element: <ProfileUpdate /> },
  { path: "/addAdmin", element: <AddAdmin /> },
  { path: "/profile", element: <Profile /> },

  // Feedback and Notification routes
  { path: "/notifications", element: <NotificationPage /> },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <DirectPurchase /> },
      { path: "product", element: <Product /> },
      { path: "order", element: <AdminOrderTable /> },
      { path: "inventory", element: <Home /> },
      { path: "adminDashboard", element: <AdminDashboard /> },
      { path: "adminFeedback", element: <AdminFeedbackPage /> },
      { path: "report", element: <SalesReport /> },
      { path: "adminpanel", element: <AdminDashboard2 /> },
      { path: "delet-user", element: <DeletUser /> },

    ],
  },

  // Client routes
  {
    path: "/client",
    element: <ClientLayout />,
    children: [
      { path: "userhome", element: <CustomerOrders /> },
      { path: "product", element: <Product /> },
      { path: "customerorder", element: <CustomerOrders /> },
      { path: "addCart", element: <AddToCart /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "feedback", element: <FeedbackPage /> },
    ],
  },

  // User Dashboard
  { path: "/userDashboard", element: <UserDashboard /> },

  // 404 Page
  { path: "*", element: <div style={{ padding: "2rem", textAlign: "center" }}><h1>404 - Page Not Found</h1></div> },
]);

function App() {
  return (
  <div className="App">
      <ThemeProvider>
        <CartProvider>
          <ToastContainer />
          <RouterProvider router={router} />
        </CartProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
