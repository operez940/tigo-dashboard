import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { API_MSREPARACIONES } from "../config/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_MSREPARACIONES}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Solo USER
      });
      if (res.ok) {
        setSuccess("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
        setUsername("");
        setPassword("");
        setTimeout(() => navigate("/"), 2000);
      } else {
        const msg = await res.text();
        setError(msg || "Error al registrar usuario");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registro de usuario - Tigo
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField label="Usuario" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
          <TextField label="Contraseña" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error" align="center">{error}</Typography>}
          {success && <Typography color="primary" align="center">{success}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Registrarse
          </Button>
        </form>
        <Button color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>¿Ya tienes cuenta? Inicia sesión</Button>
      </Paper>
    </Box>
  );
}

export default Register;
