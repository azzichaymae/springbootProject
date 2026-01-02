import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import CreateUser from "./pages/CreateUser";
import CreateProduct from "./pages/CreateProduct";
import CreateOrder from "./pages/CreateOrder";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "40px" }}>
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Users />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/orders/create" element={<CreateOrder />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
