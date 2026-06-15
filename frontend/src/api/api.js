import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-order-management.onrender.com",
});

export default api;