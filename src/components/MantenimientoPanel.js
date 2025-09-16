import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { API_MSREPARACIONES } from "../config/api";

function MantenimientoPanel() {
  const [reparaciones, setReparaciones] = useState([]);
  const [error, setError] = useState("");
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (rol !== "MANTENIMIENTO") return;
    fetch(`${API_MSREPARACIONES}/api/reparaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar reparaciones");
        return res.json();
      })
      .then(data => setReparaciones(data))
      .catch(err => setError(err.message));
  }, [rol, token]);

  if (rol !== "MANTENIMIENTO") {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" color="error">Acceso denegado. Solo personal de mantenimiento puede ver este panel.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Panel de Mantenimiento</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Reparaciones asignadas</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Ticket</TableCell>
                  <TableCell>Técnico</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reparaciones.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.descripcionProblema}</TableCell>
                    <TableCell>{r.estado}</TableCell>
                    <TableCell>{r.idTicket}</TableCell>
                    <TableCell>{r.idTecnico}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Solicitud de materiales</Typography>
            <Typography color="textSecondary">Funcionalidad pendiente de integración con backend.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MantenimientoPanel;
