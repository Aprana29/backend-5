// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import ServicesPage from "./ServicesPage";
import OrdersPage from "./OrdersPage";
import AdminPage from './AdminPage';
import BlogPage from "./BlogPage";


function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav style={{
        padding: "10px",
        background: "#f0f0f0",
        display: "flex",
        gap: "15px"
      }}>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        < Route path="/blog" element={<BlogPage />} /> 

      </Routes>
    </Router>
  );
}

export default App;
