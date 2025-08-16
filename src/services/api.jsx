const API_BASE = "https://gdrive-backend-elin.onrender.com/api";

// Helper to include token automatically
const request = async (endpoint, method = "GET", body) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
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

// API calls
export const login = async (email, password) => {
  const data = await request("/auth/login", "POST", { email, password });
  if (data.token) localStorage.setItem("token", data.token); // 🔑 Save JWT
  return data;
};

export const signup = (name, email, password) =>
  request("/auth/signup", "POST", { name, email, password });

export const logout = () => {
  localStorage.removeItem("token"); // 🔑 Clear token
  return request("/auth/logout", "POST");
};

export const getUserData = () => request("/user/data");

export default {
  login,
  signup,
  logout,
  getUserData,
};
