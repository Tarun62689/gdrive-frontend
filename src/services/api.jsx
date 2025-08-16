const API_BASE = "https://gdrive-backend-elin.onrender.com/api";

// Save token in localStorage
const setToken = (token) => {
  localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

// Generic helper
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

// Specific API functions
export const login = async (email, password) => {
  const data = await request("/auth/login", "POST", { email, password });

  if (data.token) {
    setToken(data.token); // ✅ store token in localStorage
  }

  return data;
};

export const signup = async (name, email, password) => {
  const data = await request("/auth/signup", "POST", { name, email, password });

  if (data.token) {
    setToken(data.token); // ✅ store token in localStorage
  }

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
};
