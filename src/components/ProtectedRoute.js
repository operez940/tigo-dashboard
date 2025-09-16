import React from "react";
import Forbidden from "./Forbidden";

function ProtectedRoute({ children, allowedRoles }) {
  const rol = localStorage.getItem("rol");
  if (!allowedRoles.includes(rol)) {
    return <Forbidden />;
  }
  return children;
}

export default ProtectedRoute;
