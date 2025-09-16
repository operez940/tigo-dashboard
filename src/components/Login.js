import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { API_MSREPARACIONES } from "../config/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_MSREPARACIONES}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        if (data.rol === "ADMIN" || data.rol === "MANTENIMIENTO") {
          navigate("/dashboard");
        } else if (data.rol === "USER") {
          navigate("/tickets-clientes");
        } else {
          navigate("/");
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar sesión - Tigo
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Usuario" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
          <TextField label="Contraseña" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error" align="center">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Entrar
          </Button>
          <Button color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/register')}>
            ¿No tienes cuenta? Regístrate
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
