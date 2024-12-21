// src/components/login/ProtectedRoute.tsx

import React from "react";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import { RootState } from "../../store/index.tsx";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') // useSelector((state: RootState) => state.userProfile.token);
  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};
