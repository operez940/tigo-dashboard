import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Typography } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { API_TICKETSCLIENTES } from '../config/api';
import Navbar from './Navbar';

const TicketsClientes = () => {
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ cliente: '', descripcion: '', estado: '' });

  // Obtener token JWT del localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(API_TICKETSCLIENTES + '/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data._embedded ? res.data._embedded.tickets : []);
    } catch (err) {
      console.error('Error al obtener tickets:', err);
    }
  };

  const handleOpen = (ticket = null) => {
    setEditing(ticket);
    setForm(ticket ? { ...ticket } : { cliente: '', descripcion: '', estado: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setForm({ cliente: '', descripcion: '', estado: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(API_TICKETSCLIENTES + `/tickets/${editing.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Al crear ticket, el estado se asigna automáticamente como 'Pendiente'
        await axios.post(API_TICKETSCLIENTES + '/tickets', { ...form, estado: 'Pendiente' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTickets();
      handleClose();
    } catch (err) {
      console.error('Error al guardar ticket:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este ticket?')) {
      try {
        await axios.delete(API_TICKETSCLIENTES + `/tickets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTickets();
      } catch (err) {
        console.error('Error al eliminar ticket:', err);
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Navbar />
      <div style={{ marginTop: 24, marginBottom: 16 }}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo Ticket
        </Button>
      </div>
      <Table sx={{ marginTop: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(tickets) ? (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.cliente}</TableCell>
                <TableCell>{ticket.descripcion}</TableCell>
                <TableCell>{ticket.estado}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(ticket)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(ticket.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="error">No se pudieron cargar los tickets</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar Ticket' : 'Nuevo Ticket'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Asunto" name="asunto" fullWidth value={form.asunto || ""} onChange={handleChange} />
          <TextField margin="dense" label="Descripción" name="descripcion" fullWidth value={form.descripcion || ""} onChange={handleChange} />
          <TextField margin="dense" label="Cliente" name="cliente" fullWidth value={form.cliente || ""} onChange={handleChange} />
          <TextField margin="dense" label="Fecha de reparación" name="fechaReparacion" fullWidth value={form.fechaReparacion || ""} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default TicketsClientes;
