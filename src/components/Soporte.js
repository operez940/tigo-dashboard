import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText } from "@mui/material";

const preguntasFrecuentes = [
  {
    pregunta: "¿Cómo registro un ticket de soporte?",
    respuesta: "Ingresa a la sección 'Tickets de Clientes' y haz clic en 'Nuevo Ticket'. Completa los datos y envía tu solicitud."
  },
  {
    pregunta: "¿Cómo cambio mi contraseña?",
    respuesta: "Ve a tu perfil y selecciona la opción para cambiar contraseña."
  },
  {
    pregunta: "¿Quién puede ver mis tickets?",
    respuesta: "Solo tú y el personal de mantenimiento pueden ver y gestionar tus tickets."
  },
  {
    pregunta: "¿Cómo solicito materiales?",
    respuesta: "El personal de mantenimiento puede solicitar materiales desde su panel de tareas."
  }
];

function Soporte() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setNombre("");
    setEmail("");
    setMensaje("");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Soporte y Ayuda</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Preguntas Frecuentes</Typography>
        <List>
          {preguntasFrecuentes.map((faq, i) => (
            <ListItem key={i} alignItems="flex-start">
              <ListItemText
                primary={faq.pregunta}
                secondary={faq.respuesta}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Formulario de contacto</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nombre" fullWidth margin="normal" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Mensaje" multiline rows={4} fullWidth margin="normal" value={mensaje} onChange={e => setMensaje(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Enviar</Button>
        </form>
        {enviado && <Typography color="primary" sx={{ mt: 2 }}>¡Mensaje enviado! Pronto nos pondremos en contacto contigo.</Typography>}
      </Paper>
    </Box>
  );
}

export default Soporte;
