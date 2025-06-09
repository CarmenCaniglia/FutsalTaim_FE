import axios from "axios";

const API = axios.create({
  baseURL: "https://futsaltaim-backend.onrender.com/api",
});

// Invia token se presente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
