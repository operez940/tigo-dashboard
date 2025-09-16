import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import axios from "axios";

const API_TECNICOS = "http://localhost:8082/api/tecnicos";

function TecnicosForm() {
  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState({ idEmpleado: "", nombreCompleto: "" });

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    const res = await axios.get(API_TECNICOS, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setTecnicos(res.data);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(API_TECNICOS, form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setForm({ idEmpleado: "", nombreCompleto: "" });
    fetchTecnicos();
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>Crear Técnico</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          name="idEmpleado"
          label="ID Empleado"
          value={form.idEmpleado}
          onChange={handleChange}
          required
        />
        <TextField
          name="nombreCompleto"
          label="Nombre Completo"
          value={form.nombreCompleto}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained">Agregar</Button>
      </Box>
      <Typography variant="h6" gutterBottom>Lista de Técnicos</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Empleado</TableCell>
            <TableCell>Nombre Completo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tecnicos.map(t => (
            <TableRow key={t.idEmpleado}>
              <TableCell>{t.idEmpleado}</TableCell>
              <TableCell>{t.nombreCompleto}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default TecnicosForm;
