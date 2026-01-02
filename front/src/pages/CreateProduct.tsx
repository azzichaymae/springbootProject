import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateProduct.css";
const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0.0,
    stockQuantity: 0,
    sku: "",
    category: "",
    active: true,
  });

  // Fetch categories on component mount
  useEffect(() => {
    axios.get("/api/products/categories", {
        params: { t: Date.now() },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        validateStatus: (status) => status >= 200 && status < 500,
    })
    .then((response) => {
      const contentType = response.headers && response.headers["content-type"];
      if (contentType && contentType.includes("text/html")) {
        console.error("Received HTML instead of JSON from categories endpoint", response);
        alert("Server returned HTML instead of JSON. Check backend URL or Vite proxy settings.");
        setCategories([]);
        setLoading(false);
        return;
      }

      if (response.status === 304) {
        console.info("categories not modified (304) — keeping existing list.");
        setLoading(false);
        return;
      }

      const data = response.data;
      const normalized = Array.isArray(data)
        ? data
        : data && Array.isArray(data.categories)
        ? data.categories
        : data && data._embedded && Array.isArray(data._embedded.categories)
        ? data._embedded.categories
        : [];
      setCategories(normalized);
      setLoading(false);
      console.info("Fetched categories:", normalized);
    })
    .catch((err) => {
      console.error("Error fetching categories:", err);
      alert("Failed to load categories");
      setLoading(false);
    });
    
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "stockQuantity" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.category) {
      alert("Please select a category");
      return;
    }

    try {
    await axios.post("http://localhost:8080/api/products",{
      name: form.name,
      description: form.description,
      price: form.price,
      stockQuantity: form.stockQuantity,
      sku: form.sku,
      category: form.category,
      active: form.active,
      
    },{
      headers: {
        "Content-Type": "application/json"
      }
    });
      alert("Product created successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Error creating product. Please check your data.");
    }
  };

    if (loading) {
    return <div className="create-page">Loading categories...</div>;
  }

  return (
    <div className="create-page">
      <button className="back-btn" onClick={() => navigate('/products')}>&larr; Back to Products</button>

      <h1>Create Product</h1>
      <p>Add a new product to the catalog</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Product Name
        </label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            required
          />

        <label>Category </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
       

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          

          <label>Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              required
            />
          
        </div>

        <label>SKU</label>
          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="Enter SKU"
            required
          />
        

        <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
          />
        

        <div className="form-actions">
          <button type="submit" className="create-btn">Create Product</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;