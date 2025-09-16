import React, { useState, useEffect } from "react";
import { Box, Typography, AppBar, Toolbar, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Snackbar } from "@mui/material";
import { API_MSREPARACIONES, API_TICKETSCLIENTES } from "../config/api";
import DeleteIcon from "@mui/icons-material/Delete";
import TecnicosForm from "./TecnicosForm";

function Dashboard() {
  const [reparaciones, setReparaciones] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [openTicket, setOpenTicket] = useState(false);
  const [openReparacion, setOpenReparacion] = useState(false);
  const [rol, setRol] = useState("ADMIN"); // Puedes cambiar "ADMIN" por el valor real del rol
  const [nuevoTicket, setNuevoTicket] = useState({ descripcion: "", cliente: "" });
  const [nuevaReparacion, setNuevaReparacion] = useState({ descripcionProblema: "", asunto: "", estado: "Pendiente", idTicket: "", idTecnico: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Cargar tickets y reparaciones al iniciar
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const resTickets = await fetch(`${API_TICKETSCLIENTES}/api/tickets`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const ticketsData = await resTickets.json();
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      } catch (err) {
        setTickets([]);
      }
      try {
        const resReparaciones = await fetch(`${API_MSREPARACIONES}/api/reparaciones`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const reparacionesData = await resReparaciones.json();
        setReparaciones(Array.isArray(reparacionesData) ? reparacionesData : []);
      } catch (err) {
        setReparaciones([]);
      }
    };
    fetchData();
  }, []);
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard Tigo
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" sx={{ mr: 2 }} onClick={() => window.location.href = "/soporte"}>
            Soportes
          </Button>
          <Button color="inherit" onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, overflowX: "auto", minWidth: 400, maxWidth: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Tickets de clientes</Typography>
                {(rol === "ADMIN" || rol === "MANTENIMIENTO" || rol === "USER") && (
                  <Button variant="contained" color="primary" size="small" onClick={() => setOpenTicket(true)}>Agregar</Button>
                )}
              </Box>
              {tickets.length === 0 ? (
                <Typography color="text.secondary">No hay tickets</Typography>
              ) : (
                <Table size="small" sx={{ minWidth: 650, tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 120 }}>Asunto</TableCell>
                      <TableCell sx={{ width: 120 }}>Descripción</TableCell>
                      <TableCell sx={{ width: 110 }}>Estado</TableCell>
                      <TableCell sx={{ width: 120 }}>Fecha de reparación</TableCell>
                      {rol === "ADMIN" && <TableCell sx={{ width: 90 }}>Acciones</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tickets.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.asunto}</TableCell>
                        <TableCell>{t.descripcion}</TableCell>
                        <TableCell>
                          {(rol === "ADMIN" || rol === "MANTENIMIENTO") ? (
                            <Select
                              value={t.estado}
                              onChange={async (e) => {
                                const nuevoEstado = e.target.value;
                                let nuevaFecha = t.fechaReparacion;
                                if (t.estado === "Pendiente" && nuevoEstado !== "Pendiente") {
                                  nuevaFecha = new Date().toLocaleDateString();
                                }
                                try {
                                  await fetch(`${API_TICKETSCLIENTES}/api/tickets/${t.id}`, {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${localStorage.getItem("token")}`
                                    },
                                    body: JSON.stringify({ ...t, estado: nuevoEstado, fechaReparacion: nuevaFecha })
                                  });
                                  setTickets(tickets.map(ticket => ticket.id === t.id ? { ...ticket, estado: nuevoEstado, fechaReparacion: nuevaFecha } : ticket));
                                  setSnackbarOpen(true);
                                } catch (err) {
                                  alert("Error al actualizar estado");
                                }
                              }}
                              size="small"
                            >
                              <MenuItem value="Pendiente">Pendiente</MenuItem>
                              <MenuItem value="Completado">Completado</MenuItem>
                              <MenuItem value="Abierto">Abierto</MenuItem>
                            </Select>
                          ) : (
                            t.estado
                          )}
                        </TableCell>
                        <TableCell>{t.fechaReparacion || ""}</TableCell>
                        {rol === "ADMIN" && (
                          <TableCell align="center">
                            <Button color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteTicket(t.id)}>
                              Eliminar
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>
            <Box sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
              <TecnicosForm />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, overflowX: "auto", minWidth: 400, maxWidth: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Reparaciones</Typography>
                {rol === "ADMIN" && (
                  <Button variant="contained" color="primary" size="small" onClick={() => setOpenReparacion(true)} sx={{ ml: 2 }}>Agregar reparación</Button>
                )}
              </Box>
              {reparaciones.length === 0 ? (
                <Typography color="text.secondary">No hay reparaciones</Typography>
              ) : (
                <Table size="small" sx={{ minWidth: 650, tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 120 }}>Descripción</TableCell>
                            <TableCell sx={{ width: 120 }}>Asunto</TableCell>
                      <TableCell sx={{ width: 120 }}>Estado</TableCell>
                      <TableCell sx={{ width: 120 }}>Fecha de reparación</TableCell>
                      <TableCell sx={{ width: 120 }}>ID Ticket</TableCell>
                      <TableCell sx={{ width: 120 }}>ID Técnico</TableCell>
                      {rol === "ADMIN" && <TableCell sx={{ width: 90 }}>Acciones</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reparaciones.map((r) => {
                      const ticket = tickets.find(t => t.id === r.idTicket);
                      const idCliente = ticket ? ticket.idCliente : null;
                      const asuntoTicket = ticket ? ticket.asunto : r.idTicket;
                      return (
                        <TableRow key={r.id}>
                          <TableCell>{r.descripcionProblema}</TableCell>
                          <TableCell>{asuntoTicket}</TableCell>
                          <TableCell>
                            {(rol === "ADMIN" || rol === "MANTENIMIENTO") ? (
                              <Select
                                value={r.estado}
                                onChange={async (e) => {
                                  const nuevoEstado = e.target.value;
                                  let nuevaFecha = r.fechaReparacion;
                                  if (r.estado === "Pendiente" && nuevoEstado !== "Pendiente") {
                                    const d = new Date();
                                    const pad = n => n < 10 ? '0' + n : n;
                                    nuevaFecha = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
                                  }
                                  try {
                                          await fetch(`${API_MSREPARACIONES}/api/reparaciones/${r.id}`, {
                                            method: "PUT",
                                            headers: {
                                              "Content-Type": "application/json",
                                              Authorization: `Bearer ${localStorage.getItem("token")}`
                                            },
                                            body: JSON.stringify({ ...r, estado: nuevoEstado, fechaReparacion: nuevaFecha })
                                          });
                                    setReparaciones(reparaciones.map(rep => rep.id === r.id ? { ...rep, estado: nuevoEstado, fechaReparacion: nuevaFecha } : rep));
                                    setSnackbarOpen(true);
                                  } catch (err) {
                                    alert("Error al actualizar estado");
                                  }
                                }}
                                size="small"
                              >
                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                <MenuItem value="En proceso">En proceso</MenuItem>
                                <MenuItem value="Completado">Completado</MenuItem>
                              </Select>
                            ) : (
                              r.estado
                            )}
                          </TableCell>
                          <TableCell>{r.fechaReparacion || ""}</TableCell>
                          <TableCell>{r.idTicket}</TableCell>
                          <TableCell>{r.idTecnico}</TableCell>
                          {rol === "ADMIN" && (
                            <TableCell align="center">
                              <Button color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleDeleteReparacion(r.id)}>
                                Eliminar
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={openTicket} onClose={() => setOpenTicket(false)}>
          <DialogTitle>Agregar Ticket</DialogTitle>
          <DialogContent>
            <TextField label="Descripción" name="descripcion" value={nuevoTicket.descripcion} onChange={e => setNuevoTicket({ ...nuevoTicket, descripcion: e.target.value })} fullWidth margin="normal" />
            <TextField label="Cliente" name="cliente" value={nuevoTicket.cliente} onChange={e => setNuevoTicket({ ...nuevoTicket, cliente: e.target.value })} fullWidth margin="normal" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTicket(false)}>Cancelar</Button>
            <Button onClick={async () => {
              // Lógica para guardar ticket
              try {
                const res = await fetch(`${API_TICKETSCLIENTES}/api/tickets`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  },
                  body: JSON.stringify(nuevoTicket)
                });
                if (!res.ok) throw new Error("Error al crear ticket");
                const nuevo = await res.json();
                setTickets([...tickets, nuevo]);
                setOpenTicket(false);
                setNuevoTicket({ descripcion: "", cliente: "" });
              } catch (err) {
                alert(err.message);
              }
            }} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openReparacion} onClose={() => setOpenReparacion(false)}>
          <DialogTitle>Agregar Reparación</DialogTitle>
          <DialogContent>
            <TextField label="Descripción del problema" name="descripcionProblema" value={nuevaReparacion.descripcionProblema} onChange={e => setNuevaReparacion({ ...nuevaReparacion, descripcionProblema: e.target.value })} fullWidth margin="normal" />
            <TextField label="Asunto" name="asunto" value={nuevaReparacion.asunto} onChange={e => setNuevaReparacion({ ...nuevaReparacion, asunto: e.target.value })} fullWidth margin="normal" />
            <TextField label="ID Ticket" name="idTicket" value={nuevaReparacion.idTicket} onChange={e => setNuevaReparacion({ ...nuevaReparacion, idTicket: e.target.value })} fullWidth margin="normal" />
            <TextField label="ID Técnico" name="idTecnico" value={nuevaReparacion.idTecnico} onChange={e => setNuevaReparacion({ ...nuevaReparacion, idTecnico: e.target.value })} fullWidth margin="normal" />
            <TextField label="Estado" name="estado" value={nuevaReparacion.estado} onChange={e => setNuevaReparacion({ ...nuevaReparacion, estado: e.target.value })} fullWidth margin="normal" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReparacion(false)}>Cancelar</Button>
            <Button onClick={async () => {
              try {
                const res = await fetch(`${API_MSREPARACIONES}/api/reparaciones`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  },
                  body: JSON.stringify(nuevaReparacion)
                });
                if (!res.ok) throw new Error("Error al crear reparación");
                const nueva = await res.json();
                setReparaciones([...reparaciones, nueva]);
                setOpenReparacion(false);
                setNuevaReparacion({ descripcionProblema: "", asunto: "", estado: "Pendiente", idTicket: "", idTecnico: "" });
              } catch (err) {
                alert(err.message);
              }
            }} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Estado actualizado correctamente"
        />
      </Box>
    </Box>
  );
}
export default Dashboard;
