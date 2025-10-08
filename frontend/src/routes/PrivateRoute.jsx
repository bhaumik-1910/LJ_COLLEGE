// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export default function PrivateRoute({ children, role: requiredRole }) {
//     const { token, role } = useContext(AuthContext);
//     const location = useLocation();

//     // Not logged in -> send to login and replace history so back won't return here
//     if (!token) {
//         return <Navigate to="/login" replace state={{ from: location }} />;
//     }

//     // If a specific role is required and user role doesn't match -> redirect
//     if (requiredRole && role !== requiredRole) {
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// }
import React, { useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";

export default function PrivateRoute({ children, role: requiredRole }) {
    const { token, role } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    // If not logged in, redirect to the login page
    // if (!token) {
    //     return <Navigate to="/login" replace state={{ from: location }} />;
    // }

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true, state: { from: location } });
        }
    }, [token, navigate, location]);

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    // return children;
    return token ? children : null;
}