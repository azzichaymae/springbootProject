import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    setLoading(true);
    axios
      .get("/api/orders", {
        params: { t: Date.now() },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        validateStatus: (status) => status >= 200 && status < 500,
      })
      .then((res) => {
        if (res.status === 304) {
          console.info("Orders not modified (304) — keeping existing list.");
          return;
        }
        const data = res.data;
        const normalized = Array.isArray(data)
          ? data
          : data && Array.isArray(data.orders)
          ? data.orders
          : data && data._embedded && Array.isArray(data._embedded.orders)
          ? data._embedded.orders
          : [];
        setOrders(normalized);
      })
      .catch((err) => {
        console.error("Error fetching orders", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <p>Loading orders...</p>;

   return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage orders from the Order Service</p>
        </div>
          <button className="add-btn" onClick={() => window.location.href = '/orders/create'}>＋ Add Order</button>
      </div>

      {loading ? (
        <p className="loading">Loading orders...</p>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Total amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>${order.totalAmount}</td>
                    <td>{order.status}</td>
                    <td>{order.date}</td>
                    <td>
                      <span
                        className={`status ${order.active ? "active" : "inactive"}`}
                      >
                        {order.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
