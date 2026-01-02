import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateOrder.css";
import { getUsers } from "../api/users.api.js";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}



const CreateOrder = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: crypto.randomUUID(), productId: "", quantity: 1, price: 0 }
  ]);

  useEffect(() => {
    getUsers()
          .then(res => {
            setUsers(res.data);
          })
          .catch(err => {
            console.error("Error fetching users", err);
          })
    Promise.all([
      axios.get("/api/products")
    ])
    
    .then(([productsRes]) => {
      setProducts(productsRes.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      setLoading(false);
    });

    console.log(users)
  }, []);
  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotal(newTotal);
  }, []);

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { id: crypto.randomUUID(), productId: "", quantity: 1, price: 0 }
    ]);
    calculateTotal();
  };

  const removeOrderItem = (id: string) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        if (field === "productId") {
          const product = products.find(p => p.id === value);
          if (product) {
            updated.price = product.price;
          }
        }
        
        return updated;
        
      }
      return item;
    }));
    calculateTotal();
  };

  const calculateTotal = () => {
    setTotal(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    if (orderItems.some(item => !item.productId)) {
      alert("Please select products for all order items");
      return;
    }

    try {
      const orderData = {
        userId: parseInt(selectedUserId),
        status: "PENDING",
        totalAmount: calculateTotal(),
        items: orderItems.map(item => ({
          productId: parseInt(item.productId),
          quantity: item.quantity,
          price: item.price
        }))
      };

      await axios.post("/api/orders", orderData);
      alert("Order created successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Error creating order");
    }
  };

  if (loading) {
    return <div className="create-order-page">Loading...</div>;
  }

  return (
    <div className="create-order-page">
      <button className="back-btn" onClick={() => navigate('/orders')}>
        ← Back to Orders
      </button>

      <h1>Create Order</h1>
      <p>Create a new customer order</p>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Customer</h3>
          <select
            className="customer-select"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select a customer</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} 
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Order Items</h3>
            <button
              type="button"
              className="add-item-btn"
              onClick={addOrderItem}
            >
              + Add Item
            </button>
          </div>

          <div className="order-items">
            {orderItems.map((item) => (
              <div key={item.id} className="order-item-row">
                <div className="item-field">
                  <label>Product</label>
                  <select
                    value={item.productId}
                    onChange={(e) => updateOrderItem(item.id, "productId", e.target.value)}
                    required
                  >
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="item-field qty-field">
                  <label>Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(item.id, "quantity", parseInt(e.target.value))}
                    required
                  />
                </div>

                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeOrderItem(item.id)}
                  disabled={orderItems.length === 1}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="total-section">
            <span className="total-label">Total</span>
            <span className="total-amount">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="create-btn">Create Order</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/orders')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;