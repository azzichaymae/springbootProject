import axios from "axios";
import api from "./axios";

export const getProducts = () => {
  return axios.get("/api/products");
};
// export const createProduct = (data) => axios.post("/api/products", data);