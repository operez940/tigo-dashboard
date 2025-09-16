import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Tickets de Clientes
        </Typography>
        <Button color="inherit" onClick={() => navigate("/soporte")}>Soporte</Button>
        <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
