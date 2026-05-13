import React from "react";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getMe } from "./api/authApi";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const location = useLocation();
  const navigate = useNavigate();

  const refreshUser = async (providedUser = null) => {
    if (providedUser) {
      setUser(providedUser);
      localStorage.setItem("user", JSON.stringify(providedUser));
      return providedUser;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const response = await getMe();
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login", { replace: true });
      }
      return null;
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const showNavbar = !["/login", "/register"].includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", color: "#1f2937" }}>
      {showNavbar ? <Navbar user={user} onLogout={() => setUser(null)} /> : null}
      <Routes>
        <Route
          path="/login"
          element={<Login onAuthChange={refreshUser} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}
