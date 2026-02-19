import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 40000,
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/* ================= STUDENT ================= */

// LOGIN
export const studentLogin = async (registration, password) => {
  const res = await api.post("/api/auth/student/login", {
    registration,
    password,
  });
  return res.data;
};

// CHANGE PASSWORD
export const changeStudentPassword = async (registration, password) => {
  const res = await api.put("/api/auth/student/change-password", {
    registration,
    password,
  });
  return res.data;
};

// PROFILE
export const getStudentProfile = async () => {
  const res = await api.get("/api/student/profile");
  return res.data;
};

// UPDATE PROFILE
export const updateStudentProfile = async (data) => {
  const res = await api.put("/api/student/profile", data);
  return res.data;
};

// SUBMIT REQUEST
export const submitRequest = async (data) => {
  const res = await api.post("/api/student/submit", data);
  return res.data;
};

// GET MY REQUESTS
export const getMyRequests = async () => {
  const res = await api.get("/api/student/my-requests");
  return res.data;
};

/* ================= STAFF ================= */

// LOGIN
export const staffLogin = async (staffId, password) => {
  const res = await api.post("/api/staff/login", {
    staffId,
    password,
  });
  return res.data;
};

// GET ALL REQUESTS
export const getAllRequests = async () => {
  const res = await api.get("/api/staff/requests");
  return res.data;
};

// UPDATE STATUS
export const updateRequestStatus = async (id, status) => {
  const res = await api.put(`/api/staff/request/${id}/status`, {
    status,
  });
  return res.data;
};