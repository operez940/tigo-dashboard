import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TicketsClientes from "./components/TicketsClientes";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import SoportePanel from "./components/SoportePanel";
import AdminPanel from "./components/AdminPanel";
import MantenimientoPanel from "./components/MantenimientoPanel";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets-clientes"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "USER"]}>
              <TicketsClientes />
            </ProtectedRoute>
          }
        />
  <Route path="/soporte" element={<SoportePanel />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mantenimiento"
          element={
            <ProtectedRoute allowedRoles={["MANTENIMIENTO"]}>
              <MantenimientoPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
