import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Register = () => {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault(); // Prevent the form from submitting and reloading the page

    const signupDetails = {
      name,
      company_name: role === "mentor" ? companyName : null,
      role,
      password,
    };

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupDetails),
      });
      console.log(response)
      const text = await response.text();
      alert(`${text}`);

      if (response.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Error during signup: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Error during signup. Please try again.");
    }
  };

  return (
    <div className="registration-container">
      <form className="form-container" onSubmit={handleSignup}>
        <h1 className="form-title">Signup</h1>
        <div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Name
            </label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        {role === "mentor" && (
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input-field"
            />
          </div>
        )}
        <div>
          <label htmlFor="role">Role</label>
          <select
            onChange={(e) => setRole(e.target.value)}
            value={role}
            id="role"
            className="input-field"
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
            className="input-field mb-3"
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Register
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
