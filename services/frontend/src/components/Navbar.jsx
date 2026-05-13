import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/login", { replace: true });
  };

  return (
    <header
      style={{
        background: "#111827",
        color: "#fff",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontWeight: 700 }}>Task Manager</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span>{user ? `Hello, ${user.name}` : "Loading..."}</span>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
