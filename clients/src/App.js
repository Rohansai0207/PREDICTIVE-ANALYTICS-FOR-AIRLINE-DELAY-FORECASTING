import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FlightForm from "./components/FlightForm";
import UserLogin from "./components/UserLogin";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import AboutUs from "./components/AboutUs";
import "./App.css";

function HomePage() {
  return (
    <div className="homepage">
      <h1>Welcome to Flight Delay Predictor ✈️</h1>
      <p>Navigate the skies smarter — predict delays before takeoff!</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/user">User Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/about">About Us</Link>
        <Link to="/flight-form">Flight Form</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/flight-form" element={<FlightForm />} />
      </Routes>
    </Router>
  );
}
