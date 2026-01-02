import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateUser.css";

export default function CreateUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/users", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        password: form.password,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },{
  headers: {
    "Content-Type": "application/json"
  }});

      navigate("/users");
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  return (
    <div className="create-user-page">
      <button className="back-btn" onClick={() => navigate("/users")}>
        ← Back to Users
      </button>

      <h1>Create User</h1>
      <p className="subtitle">Add a new user to the system</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Firstname</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lastname</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="actions">
          <button type="submit" className="primary-btn">
            Create User
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
