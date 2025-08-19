// src/services/api.jsx
const API_BASE = "https://gdrive-backend-elin.onrender.com/api";

const setToken = (token) => {
  localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (endpoint, method = "GET", body) => {
  const token = getToken();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Request failed");
  }
  return res.json();
};

// ---- File Upload (multipart) ----
export const uploadFile = async (file) => {
  const token = getToken();
  if (!token) throw new Error("No auth token found");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ token only, no Content-Type
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "File upload failed");
  }

  return res.json();
};

export const login = async (email, password) => {
  const data = await request("/auth/login", "POST", { email, password });
  if (data.token) setToken(data.token);
  return data;
};

export const signup = async (email, password) => {
  const data = await request("/auth/signup", "POST", { email, password });
  if (data.token) setToken(data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getUserData = () => request("/user/data");

export default {
  login,
  signup,
  logout,
  getUserData,
  uploadFile, 
};
