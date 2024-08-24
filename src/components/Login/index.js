import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = { name, role, password };
    const apiUrl = "http://localhost:3001/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Parse the JSON response
      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        localStorage.setItem('name',name)
        localStorage.setItem('role',role)
        alert("Login successful!");
        navigate("/home"); // Navigate to home page
      } else {
        // Handle errors
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="input-container">
          <label className="form-label" htmlFor="name">
            USERNAME
          </label>
          <input
            type="text"
            placeholder="Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            onChange={(e) => setRole(e.target.value)}
            value={role}
            className="input-field form-select"
            id="role"
          >
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
        <div>
          <label htmlFor="inputPassword5" className="form-label">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button className="btn btn-primary mt-2" type="submit">
          Login
        </button>
        <p>
          New User? <Link to="/">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
