import axios from "axios";

export const getOrders = () =>
  axios.get("/api/orders");
