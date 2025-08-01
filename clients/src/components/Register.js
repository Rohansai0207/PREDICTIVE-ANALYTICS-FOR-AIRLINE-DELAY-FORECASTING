import React, { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    email: "",
    password: "",
    otp: ""
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /.+@.+\..+/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!form.name) newErrors.name = "Name is required.";
    if (!form.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = "Valid 10-digit mobile required.";
    if (!form.address) newErrors.address = "Address is required.";
    if (!emailPattern.test(form.email)) newErrors.email = "Valid email required.";
    if (!form.password || !passwordPattern.test(form.password)) {
      newErrors.password = "Password must include 1 uppercase, 1 lowercase, and 1 number.";
    }
    if (otpSent && !form.otp) newErrors.otp = "Enter the OTP sent to your email.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:5000/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });
      const data = await res.json();
      if (res.ok) {
        alert("OTP sent to your email.");
        setOtpSent(true);
      } else {
        alert(data.error || "Failed to send OTP.");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        alert("🎉 Registration successful!");
        setForm({ name: "", mobile: "", address: "", email: "", password: "", otp: "" });
        setOtpSent(false);
      } else {
        alert(data.error || "OTP verification failed.");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Register</h2>
      <form onSubmit={handleSubmit} className="flight-form">
        <input name="name" placeholder="Name" className="form-input" value={form.name} onChange={handleChange} />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input name="mobile" placeholder="Mobile" className="form-input" value={form.mobile} onChange={handleChange} />
        {errors.mobile && <p className="error-text">{errors.mobile}</p>}

        <input name="address" placeholder="Address" className="form-input" value={form.address} onChange={handleChange} />
        {errors.address && <p className="error-text">{errors.address}</p>}

        <input name="email" placeholder="Email" className="form-input" value={form.email} onChange={handleChange} />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <div className="form-group">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="form-input"
            value={form.password}
            onChange={handleChange}
          />
          <label>
            <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
            Show Password
          </label>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        {otpSent && (
          <>
            <input name="otp" placeholder="Enter OTP" className="form-input" value={form.otp} onChange={handleChange} />
            {errors.otp && <p className="error-text">{errors.otp}</p>}
          </>
        )}

        {!otpSent ? (
          <button type="button" className="form-button" onClick={sendOtp}>Send OTP</button>
        ) : (
          <button type="submit" className="form-button">Register</button>
        )}
      </form>
    </div>
  );
}
