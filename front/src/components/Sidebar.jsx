import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">Admin Panel</h2>
      <p className="subtitle">Microservices Manager</p>

      <nav className="menu">
        <NavLink to="/users" className="nav-item">
          👤 Users
        </NavLink>

        <NavLink to="/products" className="nav-item">
          📦 Products
        </NavLink>

        <NavLink to="/orders" className="nav-item">
          🛒 Orders
        </NavLink>
      </nav>
    </aside>
  );
}
