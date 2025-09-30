import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
    const { token, role } = useContext(AuthContext);

    if (token) {
        const safeRole = String(role || "").toLowerCase().trim();
        const path = safeRole ? `/${safeRole}-dashboard` : "/";
        return <Navigate to={path} replace />;
    }

    return children;
}
