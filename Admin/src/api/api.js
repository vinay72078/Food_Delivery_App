import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://food-delivery-backend-1vc6.onrender.com/api";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const token = admin?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const adminLogin = async (username, password) => {
  const response = await API.post("/admin/login", {
    username,
    password,
  });

  return response.data;
};

export const getFoodItems = async () => {
  const response = await API.get("/admin/food-items");
  return response.data;
};

export const createFoodItem = async (foodItem) => {
  const response = await API.post("/admin/food-items", foodItem);
  return response.data;
};

export const updateFoodItem = async (id, foodItem) => {
  const response = await API.put(`/admin/food-items/${id}`, foodItem);
  return response.data;
};

export const deleteFoodItem = async (id) => {
  const response = await API.delete(`/admin/food-items/${id}`);
  return response.data;
};

export const toggleFoodAvailability = async (id) => {
  const response = await API.patch(
    `/admin/food-items/${id}/availability`
  );

  return response.data;
};

export const getOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await API.put(`/orders/${orderId}/status`, {
    status,
  });

  return response.data;
};

export default API;