import React from "react";
import { Typography, Box } from "@mui/material";

function Forbidden() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Typography variant="h4" color="error">Acceso denegado: No tienes permisos para ver esta página.</Typography>
    </Box>
  );
}

export default Forbidden;
