import { useEffect, useState } from "react";
// import { getUsers } from "../api/users.api";
import "./UserPage.css";
import axios from "axios";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    axios.get('http://localhost:8080/api/users')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.error("User Service is unreachable");
      });
    
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <main className="content">
        <div className="header">
          <div>
            <h1>Users</h1>
            <p>Manage users from the User Service</p>
          </div>
          <button className="add-btn" onClick={() => window.location.href = '/users/create'}>＋ Add User</button>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Firstname</th>
                    <th>Lastname</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td className="email">{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span
                      className={`status ${
                        u.active === true ? "active" : "inactive"
                      }`}
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
  );
}

