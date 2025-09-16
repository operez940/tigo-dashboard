import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { API_MSREPARACIONES } from "../config/api";

function Reparaciones() {
  const [reparaciones, setReparaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ descripcion: "", estado: "" });
  const token = localStorage.getItem("token");

  const fetchReparaciones = () => {
    fetch(`${API_MSREPARACIONES}/reparaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setReparaciones(data));
  };

  useEffect(() => {
    fetchReparaciones();
  }, []);

  const handleOpen = (rep = null) => {
    setEdit(rep);
    setForm(rep ? { descripcion: rep.descripcion, estado: rep.estado } : { descripcion: "", estado: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(null);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const method = edit ? "PUT" : "POST";
    const url = edit ? `${API_MSREPARACIONES}/reparaciones/${edit.id}` : `${API_MSREPARACIONES}/reparaciones`;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
      .then(() => {
        fetchReparaciones();
        handleClose();
      });
  };

  const handleDelete = id => {
    fetch(`${API_MSREPARACIONES}/reparaciones/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchReparaciones());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Gestión de Reparaciones</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Nueva reparación
      </Button>
      <Grid container spacing={2}>
        {reparaciones.map((r, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper sx={{ p: 2, position: "relative" }}>
              <Typography><b>Descripción:</b> {r.descripcion}</Typography>
              <Typography><b>Estado:</b> {r.estado}</Typography>
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <IconButton color="primary" onClick={() => handleOpen(r)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(r.id)}><DeleteIcon /></IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{edit ? "Editar reparación" : "Nueva reparación"}</DialogTitle>
        <DialogContent>
          <TextField label="Descripción" name="descripcion" fullWidth margin="normal" value={form.descripcion} onChange={handleChange} />
          <TextField label="Estado" name="estado" fullWidth margin="normal" value={form.estado} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Reparaciones;
