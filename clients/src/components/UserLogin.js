import React, { useState } from "react";
import FlightForm from './FlightForm'; // Import FlightForm

export default function UserLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); // Track login status

  const validate = () => {
    const newErrors = {};
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!userId) newErrors.userId = "User ID is required.";
    if (!password) newErrors.password = "Password is required.";
    else if (!passwordPattern.test(password)) {
      newErrors.password =
        "Password must include at least 1 uppercase, 1 lowercase, and 1 number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Simulating successful login (you can replace this with actual backend login logic)
    alert("Login successful!");
    setLoggedIn(true); // Set login status to true
  };

  return (
    <div className="form-container">
      {loggedIn ? (
        <FlightForm /> // Display FlightForm if logged in
      ) : (
        <>
          <h2 className="form-title">User Login</h2>
          <form onSubmit={handleSubmit} className="flight-form">
            <input
              className="form-input"
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            {errors.userId && <p className="error-text">{errors.userId}</p>}

            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />{" "}
              Show Password
            </label>
            {errors.password && <p className="error-text">{errors.password}</p>}

            <button type="submit" className="form-button">
              Login
            </button>
          </form>
        </>
      )}
    </div>
  );
}
