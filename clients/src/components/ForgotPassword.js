import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flight-form">
        <input
          className="form-input"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="form-button">
          Send Reset Link
        </button>
      </form>
      {message && <p className="success-text">{message}</p>}
    </div>
  );
}
