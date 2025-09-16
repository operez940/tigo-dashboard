import React, { useEffect, useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const menuItemsUser = [
  { text: "Tickets de Clientes", icon: <ConfirmationNumberIcon />, path: "/tickets-clientes" },
  { text: "Perfil", icon: <PersonIcon />, path: "/perfil" },
  { text: "Soporte", icon: <PersonIcon />, path: "/soporte" },
];

const menuItemsMantenimiento = [
  { text: "Reparaciones", icon: <BuildIcon />, path: "/reparaciones" },
  { text: "Tickets de Clientes", icon: <ConfirmationNumberIcon />, path: "/tickets-clientes" },
  { text: "Perfil", icon: <PersonIcon />, path: "/perfil" },
  { text: "Soporte", icon: <PersonIcon />, path: "/soporte" },
  { text: "Panel de Mantenimiento", icon: <BuildIcon />, path: "/mantenimiento" },
];

const menuItemsAdmin = [
  { text: "Reparaciones", icon: <BuildIcon />, path: "/reparaciones" },
  { text: "Tickets de Clientes", icon: <ConfirmationNumberIcon />, path: "/tickets-clientes" },
  { text: "Perfil", icon: <PersonIcon />, path: "/perfil" },
  { text: "Soporte", icon: <PersonIcon />, path: "/soporte" },
  { text: "Panel de Administración", icon: <PersonIcon />, path: "/admin" },
  // Opciones exclusivas para admin
];

function Sidebar() {
  const navigate = useNavigate();
  const [rol, setRol] = useState("USER");

  useEffect(() => {
    const storedRol = localStorage.getItem("rol");
    if (storedRol) setRol(storedRol);
  }, []);

  let menuItems;
  if (rol === "ADMIN") menuItems = menuItemsAdmin;
  else if (rol === "MANTENIMIENTO") menuItems = menuItemsMantenimiento;
  else menuItems = menuItemsUser;

  return (
    <Drawer variant="permanent" anchor="left">
      <Toolbar />
      <List>
        {menuItems.map((item, i) => (
          <ListItem button key={i} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
