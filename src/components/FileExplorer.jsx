import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FileExplorer() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("https://gdrive-backend-elin.onrender.com/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch("https://gdrive-backend-elin.onrender.com/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>My Files</h2>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {files.length > 0 ? (
          files.map((f) => <li key={f.id}>{f.name}</li>)
        ) : (
          <li>No files found</li>
        )}
      </ul>
    </div>
  );
}
