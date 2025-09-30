import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, role: requiredRole }) {
    const { token, role } = useContext(AuthContext);
    const location = useLocation();

    // Not logged in -> send to login and replace history so back won't return here
    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If a specific role is required and user role doesn't match -> redirect
    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
