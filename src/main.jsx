// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css'; // ✅ Global CSS
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminRoute, ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
// import HomeDecor from './pages/HomeDecor';
// import Gents from './pages/Gents';
// import PartyWear from './pages/PartyWear';
// import SummerCollection from './pages/SummerCollection';
// import WinterCollection from './pages/WinterCollection';
import ProductPage from './UI/ProductPage';
import CartEmpty from './UI/CartEmpty';
import Checkout from './UI/Checkout';
import OrderSuccess from './UI/OrderSuccess';
import Login from './UI/Login';
import Signup from './UI/Signup';
import VerifyEmail from './UI/VerifyEmail';
import ForgotPassword from './UI/ForgotPassword';
import ResetPassword from './UI/ResetPassword';
import Error from './UI/Error';
// import Lawn from './pages/Lawn';
import UserPannelProfile from './components/UserPanelProfile'
import CategoryPage from './pages/CategoryPage';

// Admin Panel
import AdminProductPanel from './admin-pannel/AdminProductPanel';
import Customer from './admin-pannel/Customer';
import Order from './admin-pannel/Order';
import Product from './admin-pannel/Product';
import Dashboard from './admin-pannel/Dashboard';
import UserProfile from './admin-pannel/UserProfile';
import AddProduct from './admin-pannel/AddProduct';
import CategoryManagement from './admin-pannel/CategoryManagement';
import AttributeManagement from './admin-pannel/AttributeManagement';
import User from './admin-pannel/User';
import AddUser from './admin-pannel/AddUser';
import AddOrders from './admin-pannel/AddOrders';
import ViewProduct from './admin-pannel/ViewProduct';
import ViewUser from './admin-pannel/ViewUser';
import ViewOrder from './admin-pannel/ViewOrder';
// import Bedding from './UI/Bedding';
// import Clothing from './UI/Clothing';
// import ClutchBag from './UI/ClutchBag';
// import MattressCovers from './UI/MattressCovers';
// import SofaCovers from './UI/SofaCovers';
// import WashingMachineCovers from './UI/WashingMachineCovers';
// import Silk from './pages/Silk';
// import EmbroideredLawn from './pages/EmbroideredLawn';
// import Linen from './pages/Linen';
// import Organza from './pages/Organza';
// import Featured from './UI/Featured';

const router = createBrowserRouter([
  // Public Routes
  { path: '/', element: <Home /> },
  { path: '/login', element: <PublicRoute><Login /></PublicRoute> },
  { path: '/register', element: <PublicRoute><Signup /></PublicRoute> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/shop', element: <Shop /> },
  { path: '/cart', element: <CartEmpty /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/order-success', element: <OrderSuccess /> },
  { path: '/product/:id', element: <ProductPage /> },
  { path: '/user-profile', element: <UserPannelProfile /> },
  
  // Centralized Category Route - handles all categories
  { path: '/category/:category', element: <CategoryPage /> },

  // Protected Routes (Authenticated Users)
  { path: '/userProfile', element: <ProtectedRoute><UserProfile /></ProtectedRoute> },

  // Admin Routes (Admin Users Only)
  { path: '/admin', element: <AdminRoute><AdminProductPanel /></AdminRoute> },
  { path: '/customer', element: <AdminRoute><Customer /></AdminRoute> },
  { path: '/order', element: <AdminRoute><Order /></AdminRoute> },
  { path: '/products', element: <AdminRoute><Product /></AdminRoute> },
  { path: '/dashboard', element: <AdminRoute><Dashboard /></AdminRoute> },
  { path: '/addproduct', element: <AdminRoute><AddProduct /></AdminRoute> },
  { path: '/addproduct/:id', element: <AdminRoute><AddProduct /></AdminRoute> },
  { path: '/categories', element: <AdminRoute><CategoryManagement /></AdminRoute> },
  { path: '/attributes', element: <AdminRoute><AttributeManagement /></AdminRoute> },
  { path: '/user', element: <AdminRoute><User /></AdminRoute> },
  { path: '/addUser', element: <AdminRoute><AddUser /></AdminRoute> },
  { path: '/addUser/:id', element: <AdminRoute><AddUser /></AdminRoute> },
  { path: '/viewUser/:id', element: <AdminRoute><ViewUser /></AdminRoute> },
  { path: '/addOrders/:id', element: <AdminRoute><AddOrders /></AdminRoute> },
  { path: '/viewProduct/:id', element: <AdminRoute><ViewProduct /></AdminRoute> },
  { path: '/addOrder', element: <AdminRoute><AddOrders /></AdminRoute> },
  { path: '/addOrder/:id', element: <AdminRoute><AddOrders /></AdminRoute> },
  { path: '/viewOrder/:id', element: <AdminRoute><ViewOrder /></AdminRoute> },

  // 404 Catch-all
  { path: '*', element: <Error /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          closeOnClick 
          pauseOnHover 
          draggable
          theme="light"
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
