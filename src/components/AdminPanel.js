import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";

import { API_MSREPARACIONES } from "../config/api";

const auditoriaFicticia = [
  { id: 1, accion: "Creación de ticket", usuario: "juan", fecha: "2025-09-10" },
  { id: 2, accion: "Cambio de estado de reparación", usuario: "maria", fecha: "2025-09-11" },
  { id: 3, accion: "Nuevo usuario registrado", usuario: "juan", fecha: "2025-09-12" },
];

function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ username: "", password: "", rol: "USER" });
  const [enviado, setEnviado] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [error, setError] = useState("");

  // Solo mostrar si el rol es ADMIN
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (rol !== "ADMIN") return;
    fetch(`${API_MSREPARACIONES}/auth/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar usuarios");
        return res.json();
      })
      .then(data => setUsuarios(data))
      .catch(err => setError(err.message));
  }, [rol, token]);

  const handleOpen = () => {
    setOpen(true);
    setEnviado(false);
    setNuevoUsuario({ username: "", password: "", rol: "USER" });
  };
  const handleClose = () => setOpen(false);
  const handleChange = e => setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  const handleSave = e => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(handleClose, 1500);
  };
  const handleEditOpen = (usuario) => {
    setUsuarioEdit(usuario);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleEditChange = e => setUsuarioEdit({ ...usuarioEdit, [e.target.name]: e.target.value });
  const handleEditSave = e => {
    e.preventDefault();
    setEditOpen(false);
  };

  if (rol !== "ADMIN") {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" color="error">Acceso denegado. Solo administradores pueden ver este panel.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Panel de Administración</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Estadísticas generales</Typography>
            <Typography>Total de usuarios: {usuarios.length}</Typography>
            <Typography>Total de acciones registradas: {auditoriaFicticia.length}</Typography>
            <Typography>Tickets activos: 5</Typography>
            <Typography>Reparaciones en curso: 2</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Gestión de usuarios</Typography>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>Crear nuevo usuario</Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosFicticios.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.rol}</TableCell>
                    <TableCell>
                      <Button size="small" color="primary" onClick={() => handleEditOpen(u)}>Editar</Button>
                      {u.rol !== "ADMIN" && (
                        <Button size="small" color="error">Eliminar</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Crear nuevo usuario</DialogTitle>
              <form onSubmit={handleSave}>
                <DialogContent>
                  <TextField label="Usuario" name="username" fullWidth margin="normal" value={nuevoUsuario.username} onChange={handleChange} required />
                  <TextField label="Contraseña" name="password" type="password" fullWidth margin="normal" value={nuevoUsuario.password} onChange={handleChange} required />
                  <TextField select label="Rol" name="rol" fullWidth margin="normal" value={nuevoUsuario.rol} onChange={handleChange} required>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="MANTENIMIENTO">MANTENIMIENTO</MenuItem>
                  </TextField>
                  {enviado && <Typography color="primary" sx={{ mt: 2 }}>¡Usuario creado exitosamente!</Typography>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancelar</Button>
                  <Button type="submit" variant="contained" color="primary">Crear</Button>
                </DialogActions>
              </form>
            </Dialog>
            <Dialog open={editOpen} onClose={handleEditClose}>
              <DialogTitle>Editar usuario</DialogTitle>
              <form onSubmit={handleEditSave}>
                <DialogContent>
                  <TextField label="Usuario" name="username" fullWidth margin="normal" value={usuarioEdit?.username || ""} onChange={handleEditChange} required />
                  <TextField select label="Rol" name="rol" fullWidth margin="normal" value={usuarioEdit?.rol || "USER"} onChange={handleEditChange} required>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="MANTENIMIENTO">MANTENIMIENTO</MenuItem>
                  </TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleEditClose}>Cancelar</Button>
                  <Button type="submit" variant="contained" color="primary">Guardar</Button>
                </DialogActions>
              </form>
            </Dialog>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>Auditoría</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Acción</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditoriaFicticia.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>{a.accion}</TableCell>
                    <TableCell>{a.usuario}</TableCell>
                    <TableCell>{a.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminPanel;
