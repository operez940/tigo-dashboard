import React, { useState } from "react";
import { Box, Typography, Paper, Grid, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const preguntasFrecuentes = [
  {
    pregunta: "¿Cómo registro un ticket de soporte?",
    respuesta: "Debes ingresar al panel de usuario y seleccionar la opción 'Crear ticket'. Completa el formulario y envíalo."
  },
  {
    pregunta: "¿Cómo consulto el estado de mi reparación?",
    respuesta: "En el panel de usuario, accede a la sección 'Mis tickets' para ver el estado actualizado."
  },
  {
    pregunta: "¿Quién puede acceder al panel de administración?",
    respuesta: "Solo los usuarios con rol ADMIN pueden acceder al panel de administración."
  },
  {
    pregunta: "¿Cómo solicito materiales si soy técnico?",
    respuesta: "En el panel de mantenimiento, selecciona el material y haz clic en 'Solicitar'."
  }
];

function SoportePanel() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 2000);
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Página de Soporte</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Preguntas Frecuentes</Typography>
            {preguntasFrecuentes.map((faq, idx) => (
              <Accordion key={idx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{faq.pregunta}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.respuesta}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Contacto</Typography>
            <form onSubmit={handleSubmit}>
              <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required type="email" />
              <TextField label="Mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} fullWidth margin="normal" required multiline rows={4} />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Enviar</Button>
              {enviado && <Typography color="success.main" sx={{ mt: 2 }}>Mensaje enviado correctamente.</Typography>}
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SoportePanel;
