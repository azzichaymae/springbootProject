import React, { useEffect, useState } from "react";
import "./Products.css";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/products", {
        // cache-busting: add timestamp param and request no-cache headers
        params: { t: Date.now() },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        validateStatus: (status) => status >= 200 && status < 500,
      })
      .then((res) => {
        if (res.status === 304) {
          console.info("Products not modified (304) — keeping existing list.");
          return;
        }
        const data = res.data;
        const normalized = Array.isArray(data)
          ? data
          : data && Array.isArray(data.products)
          ? data.products
          : data && data._embedded && Array.isArray(data._embedded.products)
          ? data._embedded.products
          : [];
        setProducts(normalized);
      })
      .catch((err) => {
        console.error("Error fetching products", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage products from the Product Service</p>
        </div>
          <button className="add-btn" onClick={() => window.location.href = '/products/create'}>＋ Add Product</button>
      </div>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>${p.price}</td>
                    <td>{p.stockQuantity}</td>
                    <td>
                      <span
                        className={`status ${p.active ? "active" : "inactive"}`}
                      >
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No products found.
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
