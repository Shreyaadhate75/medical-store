import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Medicines from "./pages/Medicines";
import Prescription from "./pages/Prescription";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/prescription" element={<Prescription />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/admin" element={<AdminDashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;